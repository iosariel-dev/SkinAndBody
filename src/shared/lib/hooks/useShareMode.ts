"use client";

import { useSyncExternalStore } from "react";

const subscribe = (): (() => void) => () => {};

function getSnapshot(): boolean {
	try {
		return sessionStorage.getItem("sb_share") === "1";
	} catch {
		return false;
	}
}

/**
 * Режим «поделиться корзиной» — флаг `sb_share` в sessionStorage (ставится на
 * `/shop/share/*`). SSR-безопасное чтение через useSyncExternalStore: `false`
 * на сервере, актуальное значение на клиенте, без setState в эффекте.
 */
export function useShareMode(): boolean {
	return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
