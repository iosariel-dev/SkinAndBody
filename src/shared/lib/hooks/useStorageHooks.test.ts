import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

import { useShareMode } from "./useShareMode";
import { useIsClient } from "./useIsClient";

describe("useShareMode", () => {
	beforeEach(() => sessionStorage.clear());

	it("false, когда флаг sb_share не выставлен", () => {
		const { result } = renderHook(() => useShareMode());
		expect(result.current).toBe(false);
	});

	it("true, когда sb_share = '1'", () => {
		sessionStorage.setItem("sb_share", "1");
		const { result } = renderHook(() => useShareMode());
		expect(result.current).toBe(true);
	});

	it("false при любом другом значении", () => {
		sessionStorage.setItem("sb_share", "0");
		const { result } = renderHook(() => useShareMode());
		expect(result.current).toBe(false);
	});
});

describe("useIsClient", () => {
	it("true после монтирования (в jsdom — клиент)", () => {
		const { result } = renderHook(() => useIsClient());
		expect(result.current).toBe(true);
	});
});
