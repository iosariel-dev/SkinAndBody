import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "../ServicePage.module.scss";
import { splitTitleAccent } from "../lib";
import type { ServiceData } from "@/entities/service";

interface HeroSectionProps {
  data: ServiceData;
  openContactForm: (title?: string) => void;
}

export function HeroSection({ data, openContactForm }: HeroSectionProps): ReactElement {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.hero__inner}>
        {/* Content column */}
        <div className={styles.hero__content}>
          <div className={styles.hero__breadcrumb}>
            <Link href="/#services" className={styles["hero__breadcrumb-link"]}>
              Услуги
            </Link>
            <span className={styles["hero__breadcrumb-sep"]}>›</span>
            <span className={styles["hero__breadcrumb-current"]}>
              {data.title}
            </span>
          </div>

          <span className={styles.hero__eyebrow}>{data.subtitle}</span>

          {(() => {
            const { rest, last } = splitTitleAccent(data.title);
            return (
              <h1 className={styles.hero__heading}>
                {rest && <>{rest} </>}
                <em>{last}</em>
              </h1>
            );
          })()}

          {data.heroTagline && (
            <p className={styles.hero__subtitle}>{data.heroTagline}</p>
          )}

          {data.heroMeta && data.heroMeta.length > 0 && (
            <div className={styles.hero__meta}>
              {data.heroMeta.map((meta, i) => (
                <span key={i} className={`${styles["hero__meta-item"]} ${i > 0 ? styles["hero__meta-item--bordered"] : ""}`}>
                  <span className={styles["hero__meta-val"]}>{meta.value}</span>
                  <span className={styles["hero__meta-label"]}>{meta.label}</span>
                </span>
              ))}
            </div>
          )}

          <div className={styles.hero__actions}>
            <button
              className={styles["hero__btn-primary"]}
              onClick={() => openContactForm(data.title)}
              type="button"
            >
              Связаться с нами
            </button>
            <button
              type="button"
              className={styles["hero__btn-ghost"]}
              onClick={() => document.getElementById("prices")?.scrollIntoView({ behavior: "smooth" })}
            >
              Посмотреть цены
            </button>
          </div>
        </div>

        {/* Visual column */}
        <div className={styles.hero__visual}>
          <Image
            src={data.heroImage}
            alt={data.heroImageAlt ?? data.title}
            fill
            className={styles["hero__image-main"]}
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            style={data.heroImagePosition ? { objectPosition: data.heroImagePosition } : undefined}
          />

          {/* Floating card — bottom left */}
          {data.heroFloatLabel && data.heroFloatValue && (
            <div className={styles["hero__float-card"]}>
              <div className={styles["hero__float-icon"]}>✦</div>
              <div>
                <div className={styles["hero__float-label"]}>{data.heroFloatLabel}</div>
                <div className={styles["hero__float-val"]}>{data.heroFloatValue}</div>
              </div>
            </div>
          )}

          {/* Stat badge — top right */}
          {data.heroBadgeValue && data.heroBadgeLabel && (
            <div className={styles["hero__stat-badge"]}>
              <div className={styles["hero__stat-num"]}>{data.heroBadgeValue}</div>
              <div className={styles["hero__stat-lbl"]}>
                {data.heroBadgeLabel.split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
