"use client";

import { useState, useCallback, useEffect, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./DocumentPage.module.scss";

interface DocumentItem {
  src: string;
  alt: string;
  label: string;
  num: string;
}

const documents: DocumentItem[] = [
  { src: "/images/docs/o1.png", alt: "Декларация о соответствии ЕАС", label: "Декларация ЕАС", num: "01" },
  { src: "/images/docs/o2.png", alt: "Сертификат CE (ECM Mark)", label: "Сертификат CE", num: "02" },
  { src: "/images/docs/o3.png", alt: "Сертификат соответствия ЕС 2014/30/EU", label: "Сертификат ЕС", num: "03" },
  { src: "/images/docs/o5.png", alt: "Сертификат TÜV Rheinland", label: "Сертификат TÜV", num: "04" },
  { src: "/images/docs/o6.png", alt: "Письмо TÜV Rheinland — подтверждение EMC", label: "Подтверждение TÜV", num: "05" },
  { src: "/images/docs/o7.png", alt: "Сертификат FDA Registration", label: "Сертификат FDA", num: "06" },
  { src: "/images/docs/o8.png", alt: "Сертификат ISO 13485:2016 (SGS)", label: "Сертификат ISO", num: "07" },
];

export function DocumentPage(): ReactElement {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
    setTimeout(() => setActiveIndex(null), 300);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev !== null ? (prev - 1 + documents.length) % documents.length : 0
    );
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev !== null ? (prev + 1) % documents.length : 0
    );
  }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLightbox, goPrev, goNext]);

  const currentDoc = activeIndex !== null ? documents[activeIndex] : null;

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.hero__inner}>
          <nav className={styles.hero__breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.hero__breadcrumbLink}>Главная</Link>
            <span className={styles.hero__breadcrumbSep}>›</span>
            <Link href="/epilation/" className={styles.hero__breadcrumbLink}>Лазерная эпиляция</Link>
            <span className={styles.hero__breadcrumbSep}>›</span>
            <span className={styles.hero__breadcrumbCurrent}>Документы</span>
          </nav>

          <span className={styles.hero__eyebrow}>Сертификация</span>

          <h1 className={styles.hero__title}>
            Документы на <em>оборудование</em>
          </h1>

          <p className={styles.hero__subtitle}>
            Диодный лазер Evolution — сертификаты качества и безопасности
          </p>

          <div className={styles.hero__badges}>
            <span className={styles.hero__badge}>
              <span className={styles.hero__badgeDot} />
              Сертификат ЕС
            </span>
            <span className={styles.hero__badge}>
              <span className={styles.hero__badgeDot} />
              Сертификат FDA
            </span>
            <span className={`${styles.hero__badge} ${styles["hero__badge--accent"]}`}>
              <span className={styles.hero__badgeDot} />
              7 документов
            </span>
          </div>
        </div>
      </section>

      <div className={styles.heroDivider} />

      {/* Documents section */}
      <section className={styles.docsSection}>
        <div className={styles.docsSection__container}>

          <div className={styles.docsSection__intro}>
            <div className={styles.docsSection__introText}>
              <span className={styles.docsSection__eyebrow}>Официальные документы</span>
              <h2 className={styles.docsSection__title}>Диодный лазер Evolution</h2>
            </div>
            <span className={styles.docsSection__count}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="2" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M4.5 5H8.5M4.5 7.5H8.5M4.5 10H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M10 9L12.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="10.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              8 сертификатов
            </span>
          </div>

          <div className={styles.docsGrid}>
            {documents.map((doc, index) => (
              <div
                key={index}
                className={styles.docCard}
                role="button"
                tabIndex={0}
                aria-label={`Открыть Документ ${index + 1}`}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(index);
                  }
                }}
              >
                <div className={styles.docCard__imgWrap}>
                  <Image
                    src={doc.src}
                    alt={doc.alt}
                    width={400}
                    height={560}
                    className={styles.docCard__img}
                  />
                  <div className={styles.docCard__overlay}>
                    <div className={styles.docCard__zoom}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M11.5 11.5L15.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M7.5 5V10M5 7.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className={styles.docCard__footer}>
                  <span className={styles.docCard__label}>{doc.label}</span>
                  <span className={styles.docCard__num}>{doc.num}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Info block */}
      <section className={styles.docsInfo}>
        <div className={styles.docsInfo__container}>
          <div className={styles.docsInfo__inner}>
            <div className={styles.docsInfo__textBlock}>
              <div className={styles.docsInfo__icon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2L12.39 7.26L18 8.18L14 12.08L14.94 18L10 15.27L5.06 18L6 12.08L2 8.18L7.61 7.26L10 2Z"
                    stroke="#b28b85"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.docsInfo__heading}>Об оборудовании</h3>
              <p className={styles.docsInfo__para}>
                Все документы предоставлены производителем оборудования. Диодный лазер Evolution имеет
                сертификат Евросоюза и сертификат FDA — продукт безопасен для здоровья человека.
              </p>
            </div>

            <Link href="/epilation/" className={styles.docsInfo__back}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M8.5 2.5L4 7L8.5 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Вернуться к лазерной эпиляции
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          className={`${styles.lightbox} ${isOpen ? styles["lightbox--open"] : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр документа"
        >
          <div className={styles.lightbox__backdrop} onClick={closeLightbox} />

          <button
            className={styles.lightbox__close}
            aria-label="Закрыть"
            onClick={closeLightbox}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <div className={styles.lightbox__inner}>
            <button
              className={styles.lightbox__arrow}
              aria-label="Предыдущий документ"
              disabled={activeIndex === 0}
              onClick={goPrev}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M9.5 3L5 8L9.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={`${styles.lightbox__imageWrap} ${isOpen ? styles["lightbox__imageWrap--open"] : ""}`}>
              {currentDoc && (
                <Image
                  src={currentDoc.src}
                  alt={currentDoc.alt}
                  width={600}
                  height={840}
                  className={styles.lightbox__img}
                  priority
                />
              )}
            </div>

            <button
              className={styles.lightbox__arrow}
              aria-label="Следующий документ"
              disabled={activeIndex === documents.length - 1}
              onClick={goNext}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 3L11 8L6.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className={styles.lightbox__caption}>
            {currentDoc?.label} — документ {activeIndex + 1} из {documents.length}
          </div>

          <div className={styles.lightbox__counter} role="tablist" aria-label="Навигация по документам">
            {documents.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Документ ${i + 1}`}
                className={`${styles.lightbox__dot} ${i === activeIndex ? styles["lightbox__dot--active"] : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
