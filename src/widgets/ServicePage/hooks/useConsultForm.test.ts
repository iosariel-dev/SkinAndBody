import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useConsultForm } from "./useConsultForm";
import { submitForm } from "@/shared/lib/helpers/sendToTelegram";

vi.mock("@/shared/lib/helpers/sendToTelegram", () => ({
	submitForm: vi.fn(() => Promise.resolve()),
	getPageTitle: () => "Тестовая страница",
}));

const VALID_PHONE = "+7 (900) 000-00-00";

beforeEach(() => vi.clearAllMocks());

describe("useConsultForm", () => {
	it("начальное состояние — модалка закрыта, статус idle", () => {
		const { result } = renderHook(() => useConsultForm());
		expect(result.current.consultModalOpen).toBeNull();
		expect(result.current.consultStatus).toBe("idle");
		expect(result.current.consultNameValid).toBe(false);
	});

	it("openConsult открывает модалку и запоминает тип", () => {
		const { result } = renderHook(() => useConsultForm());
		act(() => result.current.openConsult("acne"));
		expect(result.current.consultModalOpen).toBe("acne");
		expect(result.current.consultActiveType).toBe("acne");
	});

	it("короткое имя блокирует отправку", async () => {
		const { result } = renderHook(() => useConsultForm());
		act(() => result.current.setConsultForm((f) => ({ ...f, name: "А", phone: VALID_PHONE })));
		act(() => result.current.setConsultAgreement(true));
		await act(async () => {
			await result.current.handleConsultSubmit("general");
		});
		expect(submitForm).not.toHaveBeenCalled();
		expect(result.current.consultErrorMessage).toMatch(/Имя/);
	});

	it("некорректный телефон блокирует отправку", async () => {
		const { result } = renderHook(() => useConsultForm());
		act(() => result.current.setConsultForm((f) => ({ ...f, name: "Иван", phone: "+7 (900)" })));
		act(() => result.current.setConsultAgreement(true));
		await act(async () => {
			await result.current.handleConsultSubmit("general");
		});
		expect(submitForm).not.toHaveBeenCalled();
		expect(result.current.consultErrorMessage).toMatch(/телефон/i);
	});

	it("без согласия блокирует отправку", async () => {
		const { result } = renderHook(() => useConsultForm());
		act(() => result.current.setConsultForm((f) => ({ ...f, name: "Иван", phone: VALID_PHONE })));
		await act(async () => {
			await result.current.handleConsultSubmit("general");
		});
		expect(submitForm).not.toHaveBeenCalled();
		expect(result.current.consultErrorMessage).toMatch(/согласи/i);
	});

	it("валидная форма отправляется и статус становится success", async () => {
		const { result } = renderHook(() => useConsultForm());
		act(() => result.current.setConsultForm((f) => ({ ...f, name: "Иван", phone: VALID_PHONE })));
		act(() => result.current.setConsultAgreement(true));
		await act(async () => {
			await result.current.handleConsultSubmit("general");
		});
		expect(submitForm).toHaveBeenCalledTimes(1);
		expect(submitForm).toHaveBeenCalledWith(
			expect.objectContaining({ type: "consultation_general", name: "Иван" }),
		);
		expect(result.current.consultStatus).toBe("success");
	});

	it("acne-заявка уходит с типом consultation_acne", async () => {
		const { result } = renderHook(() => useConsultForm());
		act(() => result.current.setConsultForm((f) => ({ ...f, name: "Иван", phone: VALID_PHONE })));
		act(() => result.current.setConsultAgreement(true));
		await act(async () => {
			await result.current.handleConsultSubmit("acne");
		});
		expect(submitForm).toHaveBeenCalledWith(
			expect.objectContaining({ type: "consultation_acne" }),
		);
	});
});
