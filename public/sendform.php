<?php
// ============================================================
// Skin&Body — form → Telegram gateway
// Endpoints: /sendform.php
// Accepts JSON POST with `type` field. Types:
//   - contact_form          (main "Свяжитесь с нами" modal)
//   - consultation_general  (500₽ cosmetologist consult)
//   - consultation_acne     (1 500₽ acne consult)
//   - privacy_request       (PD request from /privacy)
//
// Server layout:
//   /www/config/tg.php          ← defines TELEGRAM_TOKEN, TELEGRAM_ID, THREAD_ID
//   /www/skinandbody.ru/        ← document root for the domain
//     └── sendform.php          ← this file
// ============================================================

// Load Telegram credentials from outside-of-webroot config
$configPath = __DIR__ . '/../config/tg.php';
if (!is_file($configPath)) {
    http_response_code(500);
    error_log("sendform.php: config not found at {$configPath}");
    echo json_encode(['success' => false, 'error' => 'Server misconfiguration']);
    exit;
}
require_once $configPath;

// --- Security headers ---
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// --- CORS: production origin only ---
$ALLOWED_ORIGINS = [
    'https://skinandbody.ru',
    'https://www.skinandbody.ru',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// --- Rate limiting: max 5 submissions per IP per 10 minutes ---
$RATE_WINDOW = 600;     // seconds
$RATE_LIMIT  = 5;       // max submissions in window
// За nginx REG.RU реальный IP — ПОСЛЕДНИЙ хоп X-Forwarded-For (его добавляет наш
// прокси). Первый элемент управляется клиентом и спуфится → лимит обходится.
$xff   = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
$parts = array_values(array_filter(array_map('trim', explode(',', $xff)), 'strlen'));
$ip    = !empty($parts) ? end($parts) : ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateDir = sys_get_temp_dir() . '/sb_ratelimit';
if (!is_dir($rateDir)) @mkdir($rateDir, 0700, true);
$rateFile = $rateDir . '/' . md5($ip);

$now = time();
$hits = [];
if (is_file($rateFile)) {
    $raw = @file_get_contents($rateFile);
    if ($raw) {
        $hits = array_filter(
            array_map('intval', explode("\n", trim($raw))),
            fn($t) => $t > $now - $RATE_WINDOW
        );
    }
}
if (count($hits) >= $RATE_LIMIT) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Слишком много заявок, попробуйте позже']);
    exit;
}
$hits[] = $now;
@file_put_contents($rateFile, implode("\n", $hits), LOCK_EX);

// Периодическая уборка протухших rate-файлов (по файлу на IP иначе копится вечно).
if (random_int(1, 20) === 1) {
    foreach (glob($rateDir . '/*') ?: [] as $f) {
        if (is_file($f) && @filemtime($f) < $now - $RATE_WINDOW) @unlink($f);
    }
}

// --- Parse input ---
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = $_POST;
}

function s(array $in, string $key, int $max = 500): string {
    $v = (string)($in[$key] ?? '');
    $v = mb_substr(trim($v), 0, $max);
    // htmlspecialchars: safe for both HTML parse_mode in Telegram AND storage
    return htmlspecialchars($v, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

$type           = s($input, 'type', 40);
$name           = s($input, 'name', 60);
$phone          = s($input, 'phone', 30);
$email          = s($input, 'email', 80);
$service        = s($input, 'service', 80);
$preselected    = s($input, 'preselectedService', 80);
$comment        = s($input, 'comment', 500);
$problem        = s($input, 'problem', 500);
$message_text   = s($input, 'message', 1000);
$contactMethod  = s($input, 'contactMethod', 10);
$page           = s($input, 'page', 120);

// Optional custom fields (form-specific). Each item: {label, value}.
// Cap at 8 items × 80/200 chars to limit abuse surface.
$extras = [];
$rawExtras = $input['extras'] ?? null;
if (is_array($rawExtras)) {
    foreach (array_slice($rawExtras, 0, 8) as $item) {
        if (!is_array($item)) continue;
        $label = htmlspecialchars(mb_substr(trim((string)($item['label'] ?? '')), 0, 80), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $value = htmlspecialchars(mb_substr(trim((string)($item['value'] ?? '')), 0, 200), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        if ($label !== '' && $value !== '') {
            $extras[] = ['label' => $label, 'value' => $value];
        }
    }
}

// --- Basic validation ---
if ($name === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Имя обязательно']);
    exit;
}
if ($phone === '' && $type !== 'privacy_request') {
    // Всем формам нужен телефон, включая privacy_request в новой версии
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Телефон обязателен']);
    exit;
}

// --- Telegram credentials (from /www/config/tg.php) ---
$token           = defined('TELEGRAM_TOKEN') ? TELEGRAM_TOKEN : '';
$chatId          = defined('TELEGRAM_ID')    ? TELEGRAM_ID    : '';
$messageThreadId = defined('THREAD_ID')      ? (int) THREAD_ID : 0;

if ($token === '' || $chatId === '') {
    http_response_code(500);
    error_log("sendform.php: TELEGRAM_TOKEN or TELEGRAM_ID not defined in config");
    echo json_encode(['success' => false, 'error' => 'Server misconfiguration']);
    exit;
}

// --- Build message ---
switch ($type) {
    case 'consultation_general':
        $message = "🩺 <b>Запись на консультацию косметолога</b>\n\n"
            . "👤 <b>Имя:</b> {$name}\n"
            . "📞 <b>Телефон:</b> {$phone}\n";
        if ($comment !== '')  $message .= "💬 <b>Комментарий:</b> {$comment}\n";
        if ($page !== '')     $message .= "📄 <b>Страница:</b> {$page}\n";
        $message .= "💰 <b>Стоимость:</b> 500 ₽";
        break;

    case 'consultation_acne':
        $message = "🔬 <b>Запись на консультацию по акне</b>\n\n"
            . "👤 <b>Имя:</b> {$name}\n"
            . "📞 <b>Телефон:</b> {$phone}\n";
        if ($problem !== '')  $message .= "📝 <b>Проблема:</b> {$problem}\n";
        if ($page !== '')     $message .= "📄 <b>Страница:</b> {$page}\n";
        $message .= "💰 <b>Стоимость:</b> 1 500 ₽";
        break;

    case 'privacy_request':
        $message = "📋 <b>Обращение по персональным данным</b>\n\n"
            . "👤 <b>Имя:</b> {$name}\n"
            . "📞 <b>Телефон:</b> {$phone}\n";
        if ($email !== '')    $message .= "📧 <b>Email:</b> {$email}\n";
        $message .= "💬 <b>Обращение:</b> {$message_text}";
        break;

    case 'contact_form':
    default:
        $label = ($contactMethod === 'write') ? 'Написать' : ($contactMethod === 'call' ? 'Позвонить' : '');
        $message = "📋 <b>Новая заявка с сайта Skin&Body</b>\n\n"
            . "👤 <b>Имя:</b> {$name}\n"
            . "📞 <b>Телефон:</b> {$phone}\n";
        if ($page !== '')         $message .= "📄 <b>Страница:</b> {$page}\n";
        if ($preselected !== '')  $message .= "💆 <b>Процедура:</b> {$preselected}\n";
        if ($service !== '')      $message .= "💆 <b>Выбранная процедура:</b> {$service}\n";
        foreach ($extras as $extra) {
            $message .= "🔹 <b>{$extra['label']}:</b> {$extra['value']}\n";
        }
        if ($comment !== '')      $message .= "💬 <b>Комментарий:</b> {$comment}\n";
        if ($label !== '')        $message .= "📲 <b>Способ связи:</b> {$label}";
        break;
}

// --- Send to Telegram ---
$url = "https://api.telegram.org/bot{$token}/sendMessage";
$data = [
    'chat_id'           => $chatId,
    'message_thread_id' => $messageThreadId,
    'parse_mode'        => 'HTML',
    'text'              => $message,
    'disable_web_page_preview' => true,
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query($data),
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_CONNECTTIMEOUT => 5,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'Ошибка отправки']);
    error_log("sendform.php: Telegram API returned {$httpCode}, response: {$response}");
}
