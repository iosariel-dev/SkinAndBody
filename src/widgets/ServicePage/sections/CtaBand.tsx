import type { ReactElement } from "react";

import styles from "../ServicePage.module.scss";
import type { ServiceData } from "@/entities/service";

interface CtaBandProps {
  data: ServiceData;
  openContactForm: (title?: string) => void;
}

export function CtaBand({ data, openContactForm }: CtaBandProps): ReactElement {
  return (
    <section className={styles["cta-band"]} id="booking" data-no-reveal>
      <div className={styles["cta-band__container"]}>
        <div className={styles["cta-band__inner"]}>
          <div>
            <span className={styles["cta-band__eyebrow"]}>
              Готовы начать?
            </span>
            <h2 className={styles["cta-band__title"]}>
              Записаться на <em>процедуру</em>
            </h2>
            <p className={styles["cta-band__sub"]}>
              Оставьте заявку — специалист перезвонит и поможет выбрать
              удобное время. Консультация бесплатна.
            </p>
          </div>
          <div className={styles["cta-band__actions"]}>
            <button
              className={styles["cta-band__btn"]}
              onClick={() => openContactForm(data.title)}
              type="button"
            >
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
