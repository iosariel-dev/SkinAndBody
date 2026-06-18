"use client";

import { useSyncExternalStore } from "react";

const subscribe = (): (() => void) => () => {};

/**
 * `false` на сервере и во время гидрации, `true` после неё — SSR-безопасная
 * замена паттерну `useEffect(() => setMounted(true), [])`. Без setState в эффекте.
 */
export function useIsClient(): boolean {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
}
