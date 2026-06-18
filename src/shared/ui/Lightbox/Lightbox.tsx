"use client";

import type { ReactElement } from "react";
import { useCallback, useEffect } from "react";
import Image from "next/image";

import { OstentatiousCrossIcon } from "@/shared/ui/icons/OstentatiousCrossIcon";
import styles from "./Lightbox.module.scss";

export interface LightboxImage {
  src: string;
  alt?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: LightboxProps): ReactElement | null {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (index === null) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, handleKey]);

  if (index === null) return null;
  const current = images[index];
  if (!current) return null;

  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фото"
    >
      <div className={styles.lightbox__bg} onClick={onClose} aria-hidden="true" />
      <div className={styles.lightbox__content}>
        <button
          type="button"
          className={styles.lightbox__close}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <OstentatiousCrossIcon size={14} />
        </button>
        <div className={styles.lightbox__imgWrap}>
          <Image
            src={current.src}
            alt={current.alt ?? `Фото ${index + 1}`}
            width={1440}
            height={1440}
            className={styles.lightbox__img}
            unoptimized
          />
        </div>
        {images.length > 1 && (
          <div className={styles.lightbox__nav}>
            <button
              type="button"
              className={styles.lightbox__navBtn}
              onClick={onPrev}
              aria-label="Предыдущее фото"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <polyline points="10 3 5 8 10 13" />
              </svg>
            </button>
            <span className={styles.lightbox__counter}>
              {index + 1} / {images.length}
            </span>
            <button
              type="button"
              className={styles.lightbox__navBtn}
              onClick={onNext}
              aria-label="Следующее фото"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <polyline points="6 3 11 8 6 13" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
