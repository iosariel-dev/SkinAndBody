"use client";

import type { ReactElement } from "react";

import styles from "../ServicePage.module.scss";
import { Modal, ModalHeader } from "@/shared/ui/Modal";
import {
  NameField,
  PhoneField,
  TextareaField,
  ConsentCheckbox,
  FormError,
  SubmitButton,
  FormRow,
} from "@/shared/ui/Form";
import { WheatIcon } from "@/shared/ui/icons/WheatIcon";
import { MicroscopeIcon } from "@/shared/ui/icons/MicroscopeIcon";
import { useConsultForm } from "../hooks/useConsultForm";
import { consultations } from "@/entities/service";
import type { ServiceData } from "@/entities/service";

interface ConsultationSectionProps {
  data: ServiceData;
}

export function ConsultationSection({ data }: ConsultationSectionProps): ReactElement | null {
  const c = useConsultForm();

  if (!data.showConsultation) return null;

  return (
    <>
      <section className={styles.consultation} id="consultation">
        <div className={styles.consultation__container}>
          <div className={`${styles.consultation__head} ${styles["consultation__head--center"]}`}>
            <span className={styles.consultation__eyebrow}>Консультации</span>
            <h2 className={styles.consultation__title}>
              Индивидуальный <em>подход</em>
            </h2>
            <p className={styles.consultation__sub}>
              Подберём оптимальный уход для вашей кожи
            </p>
          </div>

          <div className={styles.consultation__grid}>
            {/* Card 1 — General */}
            <div className={styles["consult-card"]}>
              <div className={styles["consult-card__badge-placeholder"]} />
              <div className={styles["consult-card__icon"]} aria-hidden="true">
                <WheatIcon size={32} style={{ color: "#8BAF7E" }} />
              </div>
              <h3 className={styles["consult-card__title"]}>Консультация у косметолога</h3>
              <p className={styles["consult-card__desc"]}>
                Индивидуальный осмотр кожи, подбор процедур и рекомендации по домашнему уходу. Специалист определит тип кожи и составит план ухода.
              </p>
              <div className={styles["consult-card__meta"]}>
                <span className={styles["consult-card__price"]}>{consultations.general.price}</span>
                <span className={styles["consult-card__duration"]}>{consultations.general.duration}</span>
              </div>
              <button
                type="button"
                className={`${styles["consult-card__btn"]} ${styles["consult-card__btn--ghost"]}`}
                onClick={() => c.openConsult("general")}
              >
                Записаться
              </button>
            </div>

            {/* Card 2 — Acne (featured) */}
            <div className={`${styles["consult-card"]} ${styles["consult-card--featured"]}`}>
              <div className={styles["consult-card__badge"]}>✦ Рекомендуем</div>
              <div className={styles["consult-card__icon"]} aria-hidden="true">
                <MicroscopeIcon size={32} style={{ color: "#b28b85" }} />
              </div>
              <h3 className={styles["consult-card__title"]}>Консультация по акне</h3>
              <p className={styles["consult-card__desc"]}>
                Углублённая диагностика кожи с акне. Определение причин высыпаний, назначение курса процедур и подбор лечебной косметики.
              </p>
              <div className={styles["consult-card__meta"]}>
                <span className={styles["consult-card__price"]}>{consultations.acne.price}</span>
                <span className={styles["consult-card__duration"]}>{consultations.acne.duration}</span>
              </div>
              <button
                type="button"
                className={styles["consult-card__btn"]}
                onClick={() => c.openConsult("acne")}
              >
                Записаться
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONSULTATION MODAL ===== */}
      <Modal
        isOpen={c.consultModalOpen !== null}
        onClose={c.closeConsultModal}
        onAfterClose={c.resetAfterClose}
        ariaLabel={c.consultActiveType === "general" ? "Консультация у косметолога" : "Консультация по акне"}
        cornerClose={c.consultStatus === "success"}
        header={
          c.consultStatus === "success" || c.consultActiveType === null ? undefined : (
            <ModalHeader
              eyebrow="Консультации"
              title={c.consultActiveType === "general" ? "Консультация у косметолога" : "Консультация по акне"}
              sub="Оставьте контакты — специалист перезвонит"
              onClose={c.closeConsultModal}
            />
          )
        }
      >
        {c.consultStatus === "success" ? (
          <div className={styles["consult-success"]}>
            <div className={styles["consult-success__icon"]} aria-hidden="true">✓</div>
            <h3 className={styles["consult-success__title"]}>Заявка отправлена!</h3>
            <p className={styles["consult-success__text"]}>Спасибо! Мы свяжемся с вами</p>
          </div>
        ) : c.consultActiveType !== null ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void c.handleConsultSubmit(c.consultActiveType!);
            }}
            noValidate
          >
            <FormRow>
              <NameField
                id="cm-name"
                value={c.consultForm.name}
                onChange={(name) => c.setConsultForm((f) => ({ ...f, name }))}
                error={c.consultNameError}
                placeholder="Ваше имя"
              />
              <PhoneField
                id="cm-phone"
                value={c.consultForm.phone}
                onChange={(phone) => c.setConsultForm((f) => ({ ...f, phone }))}
                error={c.consultPhoneError}
              />
            </FormRow>

            {c.consultActiveType === "general" ? (
              <TextareaField
                id="cm-comment"
                label="Комментарий"
                optional
                value={c.consultForm.comment}
                onChange={(comment) => c.setConsultForm((f) => ({ ...f, comment }))}
                placeholder="Удобное время, вопросы..."
                maxLength={200}
              />
            ) : (
              <TextareaField
                id="cm-problem"
                label="Опишите проблему"
                optional
                value={c.consultForm.problem}
                onChange={(problem) => c.setConsultForm((f) => ({ ...f, problem }))}
                placeholder="Опишите проблему кожи"
                maxLength={200}
              />
            )}

            <ConsentCheckbox
              checked={c.consultAgreement}
              onChange={c.setConsultAgreement}
              onLinkClick={c.closeConsultModal}
            />

            <FormError
              message={
                c.consultStatus === "error" || c.consultErrorMessage
                  ? c.consultErrorMessage || "Произошла ошибка. Попробуйте ещё раз."
                  : ""
              }
            />

            <SubmitButton
              valid={c.consultNameValid && c.consultPhoneValid && c.consultAgreement}
              loading={c.consultStatus === "loading"}
              onAttempt={() => c.setConsultAttempted(true)}
            >
              Записаться
            </SubmitButton>
          </form>
        ) : null}
      </Modal>
    </>
  );
}
