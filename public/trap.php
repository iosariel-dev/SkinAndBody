<?php
// Honeypot для парсеров. На эту страницу ведёт скрытая ссылка со всех страниц,
// а в robots.txt она Disallow. Реальные пользователи её не видят, добропорядочные
// боты (Google/Yandex) не заходят (уважают robots.txt). Сюда попадают только те,
// кто игнорирует robots.txt и ходит по скрытым ссылкам — т.е. парсеры.
$logFile = __DIR__ . '/scrapers.log';

function client_ip(): string {
    // nginx перед Apache на REG.RU — реальный IP в последнем хопе X-Forwarded-For
    $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($xff !== '') {
        $parts = array_map('trim', explode(',', $xff));
        return end($parts);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '-';
}
function clean($s): string {
    return str_replace(["\t", "\n", "\r"], ' ', (string)$s);
}

$line = sprintf(
    "%s\t%s\t%s\t%s\t%s\n",
    gmdate('Y-m-d H:i:s'),
    client_ip(),
    clean($_SERVER['HTTP_USER_AGENT'] ?? '-'),
    clean($_SERVER['REQUEST_URI'] ?? '-'),
    clean($_SERVER['HTTP_REFERER'] ?? '-')
);
@file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

// Не даём логу расти бесконечно: при >~800КБ оставляем последние 5000 строк.
if (@filesize($logFile) > 800000) {
    $lines = @file($logFile);
    if ($lines && count($lines) > 5000) {
        @file_put_contents($logFile, implode('', array_slice($lines, -5000)), LOCK_EX);
    }
}

http_response_code(403);
header('Content-Type: text/plain; charset=utf-8');
echo "Автоматический сбор данных с этого сайта запрещён.";
