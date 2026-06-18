<?php
// ПРИМЕР конфига Тинькофф (Т-эквайринг) для магазина.
// На хостинге REG.RU положить как  /www/config/tinkoff.php  (ВНЕ webroot,
// рядом с tg.php — так секреты недоступны из браузера).
//
// Значения брать в ЛК Т-Бизнес → Магазины → Терминалы.

define('TINKOFF_TERMINAL_KEY', 'СЮДА_TERMINAL_KEY');  // TerminalKey терминала
define('TINKOFF_PASSWORD',     'СЮДА_PASSWORD');       // пароль терминала

// Система налогообложения (54-ФЗ). Уточнить у бухгалтера ИП Иванова А.С.:
//   osn                  — ОСН
//   usn_income           — УСН «доходы»            ← частый вариант
//   usn_income_outcome   — УСН «доходы минус расходы»
//   patent               — Патент (ПСН)
//   esn / envd           — ЕСХН / ЕНВД
define('TINKOFF_TAXATION', 'usn_income');

// Ставка НДС позиции:
//   none   — без НДС     ← для УСН/патента
//   vat0   — 0%
//   vat10  — 10%
//   vat20  — 20%
//   vat110 / vat120 — расчётные 10/110, 20/120
define('TINKOFF_VAT', 'none');

// Отдельный Telegram-чат для уведомлений об ОПЛАЧЕННЫХ заказах (опционально).
// Если не задать — заказы уйдут в общий чат заявок из tg.php.
// chat_id нового чата: добавить бота в чат → отправить сообщение →
// открыть https://api.telegram.org/bot<TOKEN>/getUpdates → взять chat.id
// define('TINKOFF_ORDER_CHAT_ID', '-100xxxxxxxxxx');
// define('TINKOFF_ORDER_THREAD_ID', 0); // id темы, если чат с темами

// ВАЖНО: для пробития чеков к терминалу должна быть подключена онлайн-касса.
// NotificationURL терминала: https://skinandbody.ru/tinkoff-webhook.php
