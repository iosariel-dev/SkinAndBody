"use client";

import { useCallback, useState } from "react";

export function useLightbox(count: number): {
  index: number | null;
  openAt: (i: number) => void;
  close: () => void;
  prev: () => void;
  next: () => void;
} {
  const [index, setIndex] = useState<number | null>(null);

  const openAt = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => {
    setIndex((i) => (i === null || count === 0 ? null : (i - 1 + count) % count));
  }, [count]);
  const next = useCallback(() => {
    setIndex((i) => (i === null || count === 0 ? null : (i + 1) % count));
  }, [count]);

  return { index, openAt, close, prev, next };
}
