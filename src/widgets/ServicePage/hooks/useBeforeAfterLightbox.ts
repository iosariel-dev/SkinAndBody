"use client";

import { useCallback, useEffect, useState } from "react";

import type { ServiceData } from "@/entities/service";

/**
 * Лайтбокс блока «до/после»: индекс активного фото, циклическая навигация,
 * управление с клавиатуры (Esc / стрелки) и блокировка скролла body.
 */
export function useBeforeAfterLightbox(beforeAfter: ServiceData["beforeAfter"]) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(() => {
    if (!beforeAfter) return;
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + beforeAfter.length) % beforeAfter.length
    );
  }, [beforeAfter]);

  const showNext = useCallback(() => {
    if (!beforeAfter) return;
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % beforeAfter.length
    );
  }, [beforeAfter]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  return { lightboxIndex, setLightboxIndex, closeLightbox, showPrev, showNext };
}
