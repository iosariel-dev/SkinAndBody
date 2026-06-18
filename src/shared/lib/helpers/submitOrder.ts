/**
 * Оформление заказа магазина → платёж Тинькофф (Т-эквайринг).
 *
 * Два режима (как submitForm):
 *  - production build → POST /create-payment.php (сервер пересчитывает суммы,
 *    создаёт платёж через Tinkoff Init, возвращает confirmation_url=PaymentURL)
 *    → редирект на оплату.
 *  - development build → платёжка/PHP локально недоступны, имитируем успех
 *    и ведём на /shop/success/ (проверка UX-флоу).
 */

const USE_REAL_PAYMENT = process.env.NODE_ENV === "production";

export interface OrderItem {
	slug: string;
	volume: string;
	qty: number;
}

export interface OrderCustomer {
	name: string;
	phone: string;
	email: string;
	delivery: string;
	comment?: string;
}

export interface OrderPayload {
	items: OrderItem[];
	customer: OrderCustomer;
}

export async function submitOrder(payload: OrderPayload): Promise<void> {
	if (USE_REAL_PAYMENT) {
		const res = await fetch("/create-payment.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const data: { success?: boolean; confirmation_url?: string; error?: string } =
			await res.json().catch(() => ({}));

		if (!res.ok || !data.success || !data.confirmation_url) {
			throw new Error(data.error || "Не удалось создать платёж");
		}

		window.location.href = data.confirmation_url;
		return;
	}

	// Dev fallback — имитация успешной оплаты.
	await new Promise((resolve) => setTimeout(resolve, 600));
	window.location.href = "/shop/success/";
}
