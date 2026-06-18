"use client";

import type { ReactElement } from "react";
import Image from "next/image";

import styles from "../ServicePage.module.scss";
import { OstentatiousCrossIcon } from "@/shared/ui/icons/OstentatiousCrossIcon";
import { useBeforeAfterLightbox } from "../hooks/useBeforeAfterLightbox";
import type { ServiceData } from "@/entities/service";

interface BeforeAfterSectionProps {
  data: ServiceData;
}

export function BeforeAfterSection({ data }: BeforeAfterSectionProps): ReactElement | null {
  const { lightboxIndex, setLightboxIndex, closeLightbox, showPrev, showNext } =
    useBeforeAfterLightbox(data.beforeAfter);

  if (!data.beforeAfter || data.beforeAfter.length === 0) return null;

  return (
    <section className={styles["before-after"]} id="before-after">
      <div className={styles["before-after__container"]}>
        <div className={`${styles["before-after__head"]} ${styles["before-after__head--center"]}`}>
          <span className={styles["before-after__eyebrow"]}>Результаты</span>
          <h2 className={styles["before-after__title"]}>
            До и <em>после</em>
          </h2>
          <p className={styles["before-after__sub"]}>
            Реальные результаты наших клиентов
          </p>
        </div>

        <div className={styles["before-after__grid"]}>
          {data.beforeAfter.map((item, i) => (
            <div
              key={i}
              className={styles["ba-card"]}
              onClick={() => setLightboxIndex(i)}
              role="button"
              tabIndex={0}
              aria-label={item.alt ?? `До и после ${i + 1}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setLightboxIndex(i);
              }}
            >
              <div className={styles["ba-card__img-wrap"]}>
                <Image
                  src={item.image}
                  alt={item.alt ?? `До и после ${i + 1}`}
                  fill
                  className={styles["ba-card__img"]}
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
                <div className={styles["ba-card__zoom"]} aria-hidden="true">
                  <div className={styles["ba-card__zoom-icon"]}>
                    <svg viewBox="0 0 18 18" aria-hidden="true">
                      <circle cx="8" cy="8" r="5" />
                      <line x1="12" y1="12" x2="16" y2="16" />
                      <line x1="6" y1="8" x2="10" y2="8" />
                      <line x1="8" y1="6" x2="8" y2="10" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles["ba-card__footer"]}>
                <span className={styles["ba-card__label"]}>До / После</span>
                <span className={styles["ba-card__num"]}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className={styles["ba-lightbox"]}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото"
        >
          <div
            className={styles["ba-lightbox__bg"]}
            onClick={closeLightbox}
            aria-hidden="true"
          />
          <div className={styles["ba-lightbox__content"]}>
            <button
              type="button"
              className={styles["ba-lightbox__close"]}
              onClick={closeLightbox}
              aria-label="Закрыть"
            >
              <OstentatiousCrossIcon size={14} />
            </button>
            <div className={styles["ba-lightbox__img-wrap"]}>
              <Image
                src={data.beforeAfter[lightboxIndex].image}
                alt={data.beforeAfter[lightboxIndex].alt ?? `До и после ${lightboxIndex + 1}`}
                width={1200}
                height={1200}
                className={styles["ba-lightbox__img"]}
                unoptimized
              />
            </div>
            <div className={styles["ba-lightbox__nav"]}>
              <button
                type="button"
                className={styles["ba-lightbox__nav-btn"]}
                onClick={showPrev}
                aria-label="Предыдущее фото"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <polyline points="10 3 5 8 10 13" />
                </svg>
              </button>
              <span className={styles["ba-lightbox__counter"]}>
                {lightboxIndex + 1} / {data.beforeAfter.length}
              </span>
              <button
                type="button"
                className={styles["ba-lightbox__nav-btn"]}
                onClick={showNext}
                aria-label="Следующее фото"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <polyline points="6 3 11 8 6 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
