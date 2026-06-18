"use client";

import type { ReactElement } from "react";
import { useState } from "react";

import styles from "../ServicePage.module.scss";
import type { ServiceData } from "@/entities/service";

interface ProceduresAccordionProps {
  data: ServiceData;
}

export function ProceduresAccordion({ data }: ProceduresAccordionProps): ReactElement | null {
  const [openProcedure, setOpenProcedure] = useState(0);

  if (!data.procedures || data.procedures.length === 0) return null;

  return (
    <section className={styles.procedures} id="procedures">
      <div className={styles.procedures__container}>
        <div className={styles.procedures__head}>
          <span className={styles.procedures__eyebrow}>Виды процедур</span>
          <h2 className={styles.procedures__title}>
            Наши <em>методики</em>
          </h2>
        </div>
        <div className={styles.procedures__accordion}>
          {data.procedures.map((proc, i) => (
            <div
              key={i}
              className={`${styles.procedures__item} ${openProcedure === i ? styles["procedures__item--open"] : ""}`}
              style={{ "--item-bg": `url(${proc.image})`, "--item-bg-pos": proc.imagePosition || "center" } as React.CSSProperties}
            >
              <button
                type="button"
                className={styles.procedures__btn}
                onClick={() => setOpenProcedure(openProcedure === i ? -1 : i)}
              >
                <span className={styles.procedures__btnTitle}>{proc.title}</span>
                <svg className={styles.procedures__chevron} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="5 8 10 13 15 8" />
                </svg>
              </button>
              <div className={styles.procedures__body}>
                <p className={styles.procedures__text}>{proc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
