/**
 * Form submission hub.
 *
 * Two modes:
 *  - production build → POST to /sendform.php (server-side Telegram sender,
 *    keeps bot token private, applies CORS + rate-limit).
 *  - development build → POST directly to Telegram Bot API (quick local debug,
 *    no PHP runtime needed on dev).
 *
 * Which mode is selected: NODE_ENV === "production" at build time.
 */

// Dev-fallback шлёт напрямую в Telegram Bot API (только при локальной разработке).
// Значения берутся из .env.local (NEXT_PUBLIC_*), в репозитории секретов нет.
// В production используется /sendform.php (токен живёт на сервере в /www/config/tg.php).
const BOT_TOKEN = process.env.NEXT_PUBLIC_TG_BOT_TOKEN ?? "";
const TEST_CHAT_ID = process.env.NEXT_PUBLIC_TG_CHAT_ID ?? "";
const USE_SENDFORM_PHP = process.env.NODE_ENV === "production";

export interface FormExtra {
  label: string;
  value: string;
}

export type FormPayload =
  | {
      type: "contact_form";
      name: string;
      phone: string;
      page: string;
      preselectedService?: string;
      service?: string;
      comment?: string;
      contactMethod: "write" | "call";
      extras?: FormExtra[];
    }
  | {
      type: "consultation_general";
      name: string;
      phone: string;
      page: string;
      comment?: string;
    }
  | {
      type: "consultation_acne";
      name: string;
      phone: string;
      page: string;
      problem?: string;
    }
  | {
      type: "privacy_request";
      name: string;
      phone: string;
      email?: string;
      message: string;
    };

export async function submitForm(payload: FormPayload): Promise<void> {
  if (USE_SENDFORM_PHP) {
    const res = await fetch("/sendform.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`sendform.php returned ${res.status}`);
    }
    return;
  }

  // Dev fallback: build HTML text and send directly to Telegram.
  if (!BOT_TOKEN || !TEST_CHAT_ID) {
    console.warn(
      "[sendToTelegram] dev: NEXT_PUBLIC_TG_BOT_TOKEN / NEXT_PUBLIC_TG_CHAT_ID не заданы — заявка не отправлена. Заполните .env.local.",
    );
    return;
  }
  const text = buildTelegramText(payload);
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TEST_CHAT_ID,
      parse_mode: "HTML",
      text,
    }),
  });
}

export function getPageTitle(): string {
  if (typeof document === "undefined") return "Главная";
  return (
    document.title
      .replace(/^Skin&Body\s*[—-]\s*/, "")
      .replace(/\s*\|\s*Skin&Body$/, "") || "Главная"
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildTelegramText(p: FormPayload): string {
  const name = escapeHtml(p.name.trim());
  const phone = escapeHtml(p.phone);
  switch (p.type) {
    case "contact_form": {
      const contactLabel = p.contactMethod === "write" ? "Написать" : "Позвонить";
      let t = `📋 <b>Новая заявка с сайта Skin&Body</b>\n\n`;
      t += `👤 <b>Имя:</b> ${name}\n`;
      t += `📞 <b>Телефон:</b> ${phone}\n`;
      t += `📄 <b>Страница:</b> ${escapeHtml(p.page)}\n`;
      if (p.preselectedService) t += `💆 <b>Процедура:</b> ${escapeHtml(p.preselectedService)}\n`;
      if (p.service) t += `💆 <b>Выбранная процедура:</b> ${escapeHtml(p.service)}\n`;
      if (p.extras && p.extras.length > 0) {
        for (const extra of p.extras) {
          t += `🔹 <b>${escapeHtml(extra.label)}:</b> ${escapeHtml(extra.value)}\n`;
        }
      }
      if (p.comment) t += `💬 <b>Комментарий:</b> ${escapeHtml(p.comment)}\n`;
      t += `📲 <b>Способ связи:</b> ${contactLabel}`;
      return t;
    }
    case "consultation_general": {
      let t = `📋 <b>Заявка на консультацию</b>\n\n`;
      t += `👤 <b>Имя:</b> ${name}\n`;
      t += `📞 <b>Телефон:</b> ${phone}\n`;
      t += `💆 <b>Услуга:</b> Консультация у косметолога — 500₽\n`;
      t += `📄 <b>Страница:</b> ${escapeHtml(p.page)}`;
      if (p.comment) t += `\n💬 <b>Комментарий:</b> ${escapeHtml(p.comment)}`;
      return t;
    }
    case "consultation_acne": {
      let t = `📋 <b>Заявка на консультацию</b>\n\n`;
      t += `👤 <b>Имя:</b> ${name}\n`;
      t += `📞 <b>Телефон:</b> ${phone}\n`;
      t += `💆 <b>Услуга:</b> Консультация по акне — 1 500₽\n`;
      t += `📄 <b>Страница:</b> ${escapeHtml(p.page)}`;
      if (p.problem) t += `\n🔎 <b>Проблема:</b> ${escapeHtml(p.problem)}`;
      return t;
    }
    case "privacy_request": {
      let t = `📋 <b>Обращение по персональным данным</b>\n\n`;
      t += `👤 <b>Имя:</b> ${name}\n`;
      t += `📞 <b>Телефон:</b> ${phone}`;
      if (p.email) t += `\n📧 <b>Email:</b> ${escapeHtml(p.email)}`;
      t += `\n💬 <b>Обращение:</b> ${escapeHtml(p.message)}`;
      return t;
    }
  }
}
