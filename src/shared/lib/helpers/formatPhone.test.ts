import { describe, it, expect } from "vitest";

import { formatPhone, getPhoneDigits } from "./formatPhone";

describe("formatPhone", () => {
	it("возвращает пустую строку для пустого ввода", () => {
		expect(formatPhone("")).toBe("");
		expect(formatPhone("abc")).toBe("");
	});

	it("полностью форматирует 11-значный номер", () => {
		expect(formatPhone("89000000000")).toBe("+7 (900) 000-00-00");
	});

	it("нормализует ведущую 8 в 7", () => {
		expect(formatPhone("8")).toBe("+7");
		expect(formatPhone("8900")).toBe("+7 (900");
	});

	it("подставляет 7 перед номером, начинающимся с 9", () => {
		expect(formatPhone("9000000000")).toBe("+7 (900) 000-00-00");
	});

	it("идемпотентен на уже отформатированной строке", () => {
		const once = formatPhone("89000000000");
		expect(formatPhone(once)).toBe(once);
	});

	it("обрезает лишние цифры до 11", () => {
		expect(formatPhone("890000000009999")).toBe("+7 (900) 000-00-00");
	});

	it("форматирует промежуточные длины", () => {
		expect(formatPhone("8900000")).toBe("+7 (900) 000");
		expect(formatPhone("890000000")).toBe("+7 (900) 000-00");
	});
});

describe("getPhoneDigits", () => {
	it("извлекает только цифры", () => {
		expect(getPhoneDigits("+7 (900) 000-00-00")).toBe("79000000000");
		expect(getPhoneDigits("")).toBe("");
	});

	it("обратная совместимость с formatPhone (11 цифр)", () => {
		expect(getPhoneDigits(formatPhone("89000000000"))).toHaveLength(11);
	});
});
