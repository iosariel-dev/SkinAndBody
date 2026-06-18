<?php
// ============================================================
// Skin&Body — создание платежа Тинькофф (Т-эквайринг, Acquiring API v2)
// Endpoint: /create-payment.php
//
// Принимает JSON POST:
//   { "items": [ { "slug", "qty" } ], "customer": { name, phone, email, delivery, comment } }
// Возвращает: { "success": true, "confirmation_url": "https://securepay..." }
//
// Безопасность: суммы пересчитываются на сервере по catalog.json.
//
// Конфиг (вне webroot): /www/config/tinkoff.php — должен определять:
//   define('TINKOFF_TERMINAL_KEY', '...');   // TerminalKey из ЛК Т-Бизнес
//   define('TINKOFF_PASSWORD',     '...');    // пароль терминала
//   define('TINKOFF_TAXATION', 'usn_income'); // СНО: osn|usn_income|usn_income_outcome|patent|esn|envd
//   define('TINKOFF_VAT', 'none');            // НДС позиции: none|vat0|vat10|vat20|vat110|vat120
// 54-ФЗ: к терминалу должна быть подключена онлайн-касса.
// ============================================================

$configPath = __DIR__ . '/../config/tinkoff.php';
if (!is_file($configPath)) {
    http_response_code(500);
    error_log("create-payment.php: config not found at {$configPath}");
    echo json_encode(['success' => false, 'error' => 'Платёжный модуль не настроен']);
    exit;
}
require_once $configPath;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$ALLOWED_ORIGINS = ['https://skinandbody.ru', 'https://www.skinandbody.ru'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// --- Rate limiting: 10 / IP / 10 мин ---
// За nginx REG.RU реальный IP — ПОСЛЕДНИЙ хоп X-Forwarded-For (его добавляет наш
// прокси). Первый элемент управляется клиентом и спуфится → лимит обходится.
$xff   = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
$parts = array_values(array_filter(array_map('trim', explode(',', $xff)), 'strlen'));
$ip    = !empty($parts) ? end($parts) : ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateDir = sys_get_temp_dir() . '/sb_pay_ratelimit';
if (!is_dir($rateDir)) @mkdir($rateDir, 0700, true);
$rateFile = $rateDir . '/' . md5($ip);
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $raw = @file_get_contents($rateFile);
    if ($raw) $hits = array_filter(array_map('intval', explode("\n", trim($raw))), fn($t) => $t > $now - 600);
}
if (count($hits) >= 10) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Слишком много попыток, попробуйте позже']);
    exit;
}
$hits[] = $now;
@file_put_contents($rateFile, implode("\n", $hits), LOCK_EX);

// Периодическая уборка протухших rate-файлов (иначе по файлу на каждый IP копится
// вечно → исчерпание inode на shared-хостинге). Раз в ~20 запросов.
if (random_int(1, 20) === 1) {
    foreach (glob($rateDir . '/*') ?: [] as $f) {
        if (is_file($f) && @filemtime($f) < $now - 600) @unlink($f);
    }
}

// --- Catalog (серверные цены) ---
$catalogPath = __DIR__ . '/catalog.json';
$catalog = is_file($catalogPath) ? json_decode(@file_get_contents($catalogPath), true) : null;
if (!is_array($catalog)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Каталог недоступен']);
    exit;
}

// --- Input ---
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный запрос']);
    exit;
}

function clean(string $v, int $max): string {
    return mb_substr(trim($v), 0, $max);
}

$customer = is_array($input['customer'] ?? null) ? $input['customer'] : [];
$name     = clean((string)($customer['name'] ?? ''), 60);
$phone    = clean((string)($customer['phone'] ?? ''), 30);
$email    = clean((string)($customer['email'] ?? ''), 80);
$delivery = clean((string)($customer['delivery'] ?? ''), 80);
$comment  = clean((string)($customer['comment'] ?? ''), 500);

if ($name === '' || $phone === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите имя и телефон']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Укажите корректный email для чека']);
    exit;
}

// --- Receipt items (server-side pricing, в копейках) ---
$rawItems = is_array($input['items'] ?? null) ? $input['items'] : [];
$receiptItems = [];
$totalKopecks = 0;
$summaryParts = [];
$descParts = [];
$vat = defined('TINKOFF_VAT') ? TINKOFF_VAT : 'none';

foreach (array_slice($rawItems, 0, 50) as $row) {
    if (!is_array($row)) continue;
    $slug   = (string)($row['slug'] ?? '');
    $qty    = (int)($row['qty'] ?? 0);
    $volume = mb_substr(trim((string)($row['volume'] ?? '')), 0, 40);
    if ($slug === '' || $qty < 1 || $qty > 99 || !isset($catalog[$slug])) continue;

    // Цена по выбранному объёму (вариант), иначе основная — серверная валидация.
    $variants = $catalog[$slug]['variants'] ?? null;
    if (is_array($variants) && $volume !== '' && isset($variants[$volume])) {
        $price = (int)$variants[$volume];
    } else {
        $price = (int)($catalog[$slug]['price'] ?? 0);
    }
    if ($price <= 0) continue;

    $priceKopecks = $price * 100;
    $lineKopecks  = $priceKopecks * $qty;
    $totalKopecks += $lineKopecks;

    $nameWithVol = trim((string)$catalog[$slug]['name'] . ($volume !== '' ? ", {$volume}" : ''));
    $receiptItems[] = [
        'Name'          => mb_substr($nameWithVol, 0, 128),
        'Price'         => $priceKopecks,
        'Quantity'      => $qty,
        'Amount'        => $lineKopecks,
        'Tax'           => $vat,
        'PaymentMethod' => 'full_payment',
        'PaymentObject' => 'commodity',
    ];
    $brand = (string)($catalog[$slug]['brand'] ?? '');
    $summaryParts[] = trim("{$brand} {$nameWithVol}") . " × {$qty} шт";
    // Компактный список для Description на платёжной форме (лимит 140 символов).
    $descParts[] = "{$catalog[$slug]['name']} {$volume} ×{$qty}";
}

if (empty($receiptItems)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Корзина пуста или товары недоступны']);
    exit;
}

// --- Tinkoff credentials ---
$terminalKey = defined('TINKOFF_TERMINAL_KEY') ? TINKOFF_TERMINAL_KEY : '';
$password    = defined('TINKOFF_PASSWORD') ? TINKOFF_PASSWORD : '';
if ($terminalKey === '' || $password === '') {
    http_response_code(500);
    error_log("create-payment.php: TINKOFF creds not set");
    echo json_encode(['success' => false, 'error' => 'Платёжный модуль не настроен']);
    exit;
}

$orderId     = 'sb_' . bin2hex(random_bytes(10));
// Description — список товаров на платёжной форме (лимит Tinkoff 140 символов).
$descFull    = implode(', ', $descParts);
$description  = mb_strlen($descFull) > 140 ? mb_substr($descFull, 0, 139) . '…' : $descFull;
if ($description === '') $description = 'Заказ Skin&Body';
$phoneDigits = preg_replace('/\D+/', '', $phone);

// --- Token: SHA-256 от корневых скалярных параметров + Password (ksort, concat значений) ---
// В подпись НЕ входят вложенные объекты (Receipt, DATA) и сам Token.
$signParams = [
    'TerminalKey'     => $terminalKey,
    'Amount'          => (string)$totalKopecks,
    'OrderId'         => $orderId,
    'Description'     => $description,
    'NotificationURL' => 'https://skinandbody.ru/tinkoff-webhook.php',
    'SuccessURL'      => 'https://skinandbody.ru/shop/success/',
    'FailURL'         => 'https://skinandbody.ru/shop/fail/',
    'Password'        => $password,
];
ksort($signParams);
$token = hash('sha256', implode('', array_values($signParams)));

// --- Init payload ---
$payload = [
    'TerminalKey'     => $terminalKey,
    'Amount'          => $totalKopecks,
    'OrderId'         => $orderId,
    'Description'     => $description,
    'NotificationURL' => 'https://skinandbody.ru/tinkoff-webhook.php',
    'SuccessURL'      => 'https://skinandbody.ru/shop/success/',
    'FailURL'         => 'https://skinandbody.ru/shop/fail/',
    'Token'           => $token,
    'DATA'            => [
        'Phone' => $phoneDigits,
        'Email' => $email,
    ],
    'Receipt'         => [
        'Email'    => $email,
        'Phone'    => $phoneDigits !== '' ? '+' . $phoneDigits : '',
        'Taxation' => defined('TINKOFF_TAXATION') ? TINKOFF_TAXATION : 'usn_income',
        'Items'    => $receiptItems,
    ],
];

$ch = curl_init('https://securepay.tinkoff.ru/v2/Init');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_CONNECTTIMEOUT => 5,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

if ($httpCode === 200 && is_array($data) && ($data['Success'] ?? false) === true && !empty($data['PaymentURL'])) {
    // Сохраняем заказ для webhook (нотификация Тинькофф не содержит состава).
    $orderDir = sys_get_temp_dir() . '/sb_orders';
    if (!is_dir($orderDir)) @mkdir($orderDir, 0700, true);
    // Уборка брошенных заказов старше 24ч: неоплаченные платежи иначе копятся в /tmp
    // вместе с ПДн (имя/телефон/email/адрес). Webhook чистит только оплаченные.
    if (random_int(1, 20) === 1) {
        foreach (glob($orderDir . '/*.json') ?: [] as $f) {
            if (is_file($f) && @filemtime($f) < $now - 86400) @unlink($f);
        }
    }
    @file_put_contents($orderDir . '/' . $orderId . '.json', json_encode([
        'name'     => $name,
        'phone'    => $phone,
        'email'    => $email,
        'delivery' => $delivery,
        'comment'  => $comment,
        'items'    => $summaryParts,
        'amount'   => number_format($totalKopecks / 100, 2, '.', ''),
        'ts'       => $now,
    ], JSON_UNESCAPED_UNICODE), LOCK_EX);

    echo json_encode([
        'success'          => true,
        'confirmation_url' => $data['PaymentURL'],
        'payment_id'       => $data['PaymentId'] ?? null,
    ]);
} else {
    http_response_code(502);
    error_log("create-payment.php: Tinkoff Init {$httpCode}: {$response}");
    $msg = is_array($data) && !empty($data['Message']) ? $data['Message'] : 'Не удалось создать платёж. Попробуйте ещё раз.';
    echo json_encode(['success' => false, 'error' => $msg]);
}
