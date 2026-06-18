import type { ReactElement } from "react";

import styles from "../ServicePage.module.scss";
import type { ServiceData } from "@/entities/service";

interface ResultsSectionProps {
  data: ServiceData;
}

export function ResultsSection({ data }: ResultsSectionProps): ReactElement {
  return (
    <section className={styles.results} id="results">
      <div className={styles.results__container}>
        <div className={styles.results__head}>
          <span className={styles.results__eyebrow}>
            Эффекты и результаты
          </span>
          <h2 className={styles.results__title}>
            Что вы <em>получите</em>
          </h2>
          <p className={styles.results__sub}>
            Уже с первого сеанса вы почувствуете разницу. Курс обеспечивает
            долгосрочный результат.
          </p>
        </div>

        <div className={styles.results__grid}>
          {data.results.map((result, i) => (
            <div key={i} className={styles["result-card"]}>
              <span className={styles["result-card__icon"]}>✦</span>
              <div className={styles["result-card__num"]}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className={styles["result-card__text"]}>{result}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
