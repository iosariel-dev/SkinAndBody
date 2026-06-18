import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "../ServicePage.module.scss";
import { splitTitleAccent } from "../lib";
import type { ServiceData } from "@/entities/service";

interface EquipmentSectionProps {
  data: ServiceData;
}

export function EquipmentSection({ data }: EquipmentSectionProps): ReactElement | null {
  if (!data.equipment) return null;

  return (
    <section className={styles.equipment} id="equipment">
      <div className={styles.equipment__container}>
        <div className={styles.equipment__inner}>
          {/* Visual */}
          <div className={styles.equipment__visual}>
            <div className={styles["equipment__img-wrap"]}>
              <Image
                src={data.equipment.image}
                alt={data.equipment.imageAlt ?? data.equipment.title}
                fill
                className={styles["equipment__img"]}
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
            <div className={styles.equipment__certs}>
              <div className={styles.equipment__cert}>
                <div className={styles["equipment__cert-icon"]}>🇪🇺</div>
                <div className={styles["equipment__cert-label"]}>
                  EU cert
                </div>
              </div>
              <div className={styles.equipment__cert}>
                <div className={styles["equipment__cert-icon"]}>🇺🇸</div>
                <div className={styles["equipment__cert-label"]}>FDA</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className={styles.equipment__body}>
            <span className={styles.equipment__eyebrow}>
              Наше оборудование
            </span>
            {(() => {
              const { rest, last } = splitTitleAccent(data.equipment.title);
              return (
                <h2 className={styles.equipment__title}>
                  {rest && <>{rest} </>}
                  <em>{last}</em>
                </h2>
              );
            })()}
            <p className={styles.equipment__model}>
              Профессиональное оборудование последнего поколения
            </p>

            <div className={styles.equipment__specs}>
              {data.equipment.items.map((item, i) => (
                <div key={i} className={styles.equipment__spec}>
                  <div
                    className={styles["equipment__spec-dot"]}
                    aria-hidden="true"
                  />
                  <div className={styles["equipment__spec-text"]}>
                    {item}
                  </div>
                </div>
              ))}
            </div>

            {data.equipment.documentsLink && (
              <Link
                href={data.equipment.documentsLink}
                className={styles["equipment__docs-link"]}
              >
                Документы на оборудование
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
