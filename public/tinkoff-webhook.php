<?php
// ============================================================
// Skin&Body — приём нотификаций Тинькофф (Т-эквайринг)
// Endpoint: /tinkoff-webhook.php
//
// Тинькофф шлёт POST при изменении статуса платежа.
// Безопасность: подтверждаем статус через GetState (server-to-server,
// нашими кредами — подделать нельзя) + сверяем Token нотификации.
// При Status=CONFIRMED — уведомление о заказе в Telegram
// (состав читаем из файла, сохранённого create-payment.php по OrderId).
//
// В ЛК Т-Бизнес указать NotificationURL: https://skinandbody.ru/tinkoff-webhook.php
//
// Конфиги (вне webroot):
//   /www/config/tinkoff.php — TINKOFF_TERMINAL_KEY, TINKOFF_PASSWORD
//   /www/config/tg.php      — TELEGRAM_TOKEN, TELEGRAM_ID, THREAD_ID
//
// ВАЖНО: в ответ Тинькофф ждёт тело ровно "OK".
// ============================================================

$tinkoffConfig = __DIR__ . '/../config/tinkoff.php';
$tgConfig      = __DIR__ . '/../config/tg.php';
foreach ([$tinkoffConfig, $tgConfig] as $cfg) {
    if (!is_file($cfg)) {
        http_response_code(500);
        error_log("tinkoff-webhook.php: config missing {$cfg}");
        echo 'ERROR';
        exit;
    }
    require_once $cfg;
}
header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'ERROR';
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) { echo 'OK'; exit; }

$orderId   = (string)($input['OrderId'] ?? '');
$paymentId = (string)($input['PaymentId'] ?? '');
$status    = (string)($input['Status'] ?? '');
$notifyToken = (string)($input['Token'] ?? '');

$terminalKey = defined('TINKOFF_TERMINAL_KEY') ? TINKOFF_TERMINAL_KEY : '';
$password    = defined('TINKOFF_PASSWORD') ? TINKOFF_PASSWORD : '';

// --- Сверка Token нотификации (диагностика; основная проверка — GetState) ---
$tokenOk = false;
if ($notifyToken !== '' && $password !== '') {
    $signSrc = [];
    foreach ($input as $k => $v) {
        if ($k === 'Token') continue;
        if (is_array($v)) continue; // вложенные не участвуют
        if (is_bool($v)) $v = $v ? 'true' : 'false';
        $signSrc[$k] = (string)$v;
    }
    $signSrc['Password'] = $password;
    ksort($signSrc);
    $calc = hash('sha256', implode('', array_values($signSrc)));
    $tokenOk = hash_equals($calc, $notifyToken);
    if (!$tokenOk) error_log("tinkoff-webhook.php: token mismatch for {$orderId}");
}

// Интересует только успешная оплата.
if ($status !== 'CONFIRMED') { echo 'OK'; exit; }
if ($paymentId === '') { echo 'OK'; exit; }

// --- Подтверждение статуса через GetState (анти-подделка) ---
$gp = ['TerminalKey' => $terminalKey, 'PaymentId' => $paymentId, 'Password' => $password];
ksort($gp);
$gToken = hash('sha256', implode('', array_values($gp)));

$ch = curl_init('https://securepay.tinkoff.ru/v2/GetState');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode([
        'TerminalKey' => $terminalKey,
        'PaymentId'   => $paymentId,
        'Token'       => $gToken,
    ]),
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_CONNECTTIMEOUT => 5,
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$state = json_decode($resp, true);
if ($code !== 200 || !is_array($state) || ($state['Status'] ?? '') !== 'CONFIRMED') {
    error_log("tinkoff-webhook.php: GetState not confirmed for {$paymentId} (code {$code})");
    echo 'OK'; // принято, но не уведомляем
    exit;
}

// --- Заказ из сохранённого файла (дедуп: файл удаляется после отправки) ---
$orderFile = sys_get_temp_dir() . '/sb_orders/' . preg_replace('/[^a-z0-9_]/i', '', $orderId) . '.json';
$order = is_file($orderFile) ? json_decode(@file_get_contents($orderFile), true) : null;

function esc($v): string {
    return htmlspecialchars((string)$v, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

$amount = is_array($order) && !empty($order['amount'])
    ? $order['amount']
    : number_format(((int)($input['Amount'] ?? 0)) / 100, 2, '.', '');

$message  = "🛒 <b>Новый оплаченный заказ — Skin&Body</b>\n\n";
$message .= "💰 <b>Сумма:</b> {$amount} ₽\n";
if (is_array($order)) {
    if (!empty($order['name']))     $message .= "👤 <b>Имя:</b> " . esc($order['name']) . "\n";
    if (!empty($order['phone']))    $message .= "📞 <b>Телефон:</b> " . esc($order['phone']) . "\n";
    if (!empty($order['email']))    $message .= "📧 <b>Email:</b> " . esc($order['email']) . "\n";
    if (!empty($order['delivery'])) $message .= "🚚 <b>Получение:</b> " . esc($order['delivery']) . "\n";
    if (!empty($order['items'])) {
        $message .= "📦 <b>Состав:</b>\n";
        foreach ((array) $order['items'] as $it) {
            $message .= "• " . esc($it) . "\n";
        }
    }
    if (!empty($order['comment']))  $message .= "💬 <b>Комментарий:</b> " . esc($order['comment']) . "\n";
} else {
    $message .= "⚠️ Детали заказа не найдены (OrderId " . esc($orderId) . ")\n";
}
$message .= "🧾 <b>Платёж:</b> " . esc($paymentId);

// --- Telegram ---
$token  = defined('TELEGRAM_TOKEN') ? TELEGRAM_TOKEN : '';
// Отдельный чат/тред для заказов магазина (задаётся в tinkoff.php).
// Если не задан — fallback на общий чат заявок из tg.php.
$chatId = (defined('TINKOFF_ORDER_CHAT_ID') && TINKOFF_ORDER_CHAT_ID !== '')
    ? TINKOFF_ORDER_CHAT_ID
    : (defined('TELEGRAM_ID') ? TELEGRAM_ID : '');
$thread = defined('TINKOFF_ORDER_THREAD_ID')
    ? (int) TINKOFF_ORDER_THREAD_ID
    : (defined('THREAD_ID') ? (int) THREAD_ID : 0);

if ($token !== '' && $chatId !== '') {
    $ch = curl_init("https://api.telegram.org/bot{$token}/sendMessage");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query([
            'chat_id'                  => $chatId,
            'message_thread_id'        => $thread,
            'parse_mode'               => 'HTML',
            'text'                     => $message,
            'disable_web_page_preview' => true,
        ]),
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    curl_exec($ch);
    curl_close($ch);
}

// Удаляем файл заказа — защита от дублей при повторной нотификации.
if (is_file($orderFile)) @unlink($orderFile);

echo 'OK';
