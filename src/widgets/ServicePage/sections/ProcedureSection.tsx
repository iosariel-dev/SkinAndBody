import type { ReactElement } from "react";
import Image from "next/image";

import styles from "../ServicePage.module.scss";
import { splitTitleAccent } from "../lib";
import type { ServiceData } from "@/entities/service";

interface ProcedureSectionProps {
  data: ServiceData;
}

export function ProcedureSection({ data }: ProcedureSectionProps): ReactElement {
  return (
    <section className={styles.procedure} id="procedure">
      <div className={styles.procedure__container}>
        <div className={styles.procedure__inner}>
          {/* Aside — sticky image + note */}
          <div className={styles.procedure__aside}>
            <div className={styles["procedure__aside-img"]}>
              <Image
                src={data.procedure.image}
                alt={data.procedure.imageAlt ?? data.procedure.title}
                fill
                className={styles["procedure__aside-img-el"]}
                sizes="(max-width: 900px) 100vw, 38vw"
              />
            </div>
            {data.procedure.note && (
              <div className={styles["procedure__aside-note"]}>
                <div className={styles["procedure__aside-note-label"]}>
                  Важно знать
                </div>
                <div className={styles["procedure__aside-note-text"]}>
                  {data.procedure.note}
                </div>
              </div>
            )}
          </div>

          {/* Body — description + steps */}
          <div className={styles.procedure__body}>
            <span className={styles.procedure__eyebrow}>Как это работает</span>
            {(() => {
              const { rest, last } = splitTitleAccent(data.procedure.title);
              return (
                <h2 className={styles.procedure__title}>
                  {rest && <>{rest} </>}
                  <em>{last}</em>
                </h2>
              );
            })()}

            <p className={styles.procedure__text}>{data.procedure.description}</p>

            {data.procedure.steps && data.procedure.steps.length > 0 && (
              <div className={styles.procedure__steps}>
                {data.procedure.steps.map((step, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  const dashIndex = step.indexOf("—");
                  const title = dashIndex > -1 ? step.slice(0, dashIndex).trim() : step;
                  const desc = dashIndex > -1 ? step.slice(dashIndex + 1).trim() : "";
                  return (
                    <div key={i} className={styles.procedure__step}>
                      <span className={styles["procedure__step-num"]}>
                        {num}
                      </span>
                      <div className={styles["procedure__step-text"]}>
                        <strong>{title}</strong>
                        {desc && <> — {desc}</>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
