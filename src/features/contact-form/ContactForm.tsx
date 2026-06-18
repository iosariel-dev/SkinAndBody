"use client";

import type { ReactElement, FormEvent } from "react";
import { useCallback, useState } from "react";
import { Dropdown } from "@/shared/ui/Dropdown/Dropdown";
import { Modal, ModalHeader } from "@/shared/ui/Modal";
import {
  NameField,
  PhoneField,
  TextField,
  SelectField,
  TextareaField,
  ConsentCheckbox,
  FormError,
  SubmitButton,
  FormRow,
} from "@/shared/ui/Form";
import { getPhoneDigits } from "@/shared/lib/helpers/formatPhone";
import { submitForm, getPageTitle } from "@/shared/lib/helpers/sendToTelegram";
import type { ContactFormExtra } from "@/shared/lib/hooks/useContactForm";
import styles from "./ContactForm.module.scss";

type ContactMethod = "write" | "call";
type FormStatus = "idle" | "loading" | "success" | "error";

interface ContactFormProps {
  isOpen: boolean;
  preselectedService?: string;
  extras?: ContactFormExtra[];
  onClose: () => void;
}

export function ContactForm({
  isOpen,
  preselectedService,
  extras = [],
  onClose,
}: ContactFormProps): ReactElement | null {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [comment, setComment] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("write");
  const [attempted, setAttempted] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});

  const setExtraValue = useCallback((id: string, val: string): void => {
    setExtraValues((prev) => ({ ...prev, [id]: val }));
  }, []);

  const resetForm = useCallback((): void => {
    setName("");
    setPhone("");
    setService("");
    setComment("");
    setContactMethod("write");
    setAttempted(false);
    setAgreement(false);
    setStatus("idle");
    setErrorMessage("");
    setExtraValues({});
  }, []);

  const requiredExtrasFilled = extras.every((extra) => {
    if (extra.optional) return true;
    return (extraValues[extra.id] ?? "").trim().length > 0;
  });

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      if (name.trim().length < 2) {
        setErrorMessage("Имя должно содержать минимум 2 символа");
        return;
      }
      if (getPhoneDigits(phone).length !== 11) {
        setErrorMessage("Введите корректный номер телефона");
        return;
      }
      if (!requiredExtrasFilled) {
        setErrorMessage("Заполните обязательные поля");
        return;
      }
      if (!agreement) {
        setErrorMessage("Поставьте галочку согласия на обработку персональных данных");
        return;
      }

      setErrorMessage("");
      setStatus("loading");

      const extrasPayload = extras
        .map((extra) => ({ label: extra.label, value: (extraValues[extra.id] ?? "").trim() }))
        .filter((item) => item.value.length > 0);

      try {
        await submitForm({
          type: "contact_form",
          name: name.trim(),
          phone,
          page: getPageTitle(),
          preselectedService: preselectedService || undefined,
          service: service || undefined,
          comment: comment || undefined,
          contactMethod,
          extras: extrasPayload.length > 0 ? extrasPayload : undefined,
        });

        setStatus("success");
        setTimeout(() => onClose(), 3000);
      } catch {
        setStatus("error");
        setErrorMessage("Произошла ошибка. Попробуйте ещё раз.");
      }
    },
    [
      name,
      phone,
      service,
      comment,
      contactMethod,
      preselectedService,
      agreement,
      extras,
      extraValues,
      requiredExtrasFilled,
      onClose,
    ],
  );

  const nameValid = name.trim().length >= 2;
  const phoneValid = getPhoneDigits(phone).length === 11;
  const allValid = nameValid && phoneValid && agreement && requiredExtrasFilled;
  const nameError = attempted && !nameValid;
  const phoneError = attempted && !phoneValid;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onAfterClose={resetForm}
      ariaLabel="Форма обратной связи"
      cornerClose={status === "success"}
      header={
        status === "success" ? undefined : (
          <ModalHeader
            eyebrow="Обратная связь"
            title="Свяжитесь с нами"
            sub="Оставьте контакты — мы свяжемся с вами в ближайшее время."
            onClose={onClose}
          />
        )
      }
    >
      {status === "success" ? (
        <div className={styles.success}>
          <div className={styles.success__icon}>✓</div>
          <h3 className={styles.success__title}>Заявка отправлена!</h3>
          <p className={styles.success__text}>Спасибо! Мы свяжемся с вами</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormRow>
            <NameField id="cf-name" value={name} onChange={setName} error={nameError} />
            <PhoneField id="cf-phone" value={phone} onChange={setPhone} error={phoneError} />
          </FormRow>

          {!preselectedService && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>
                Процедура <span className={styles.fieldOptional}>(необязательно)</span>
              </span>
              <Dropdown
                id="cf-service"
                value={service}
                onChange={setService}
                placeholder="Выберите процедуру"
                options={[
                  { value: "Лазерная эпиляция", label: "Лазерная эпиляция" },
                  { value: "Депиляция", label: "Депиляция" },
                  { value: "Чистка лица", label: "Чистка лица" },
                  { value: "Пилинг", label: "Пилинг" },
                  { value: "LPG", label: "LPG" },
                  { value: "RF-лифтинг", label: "RF-лифтинг" },
                  { value: "Микротоковая терапия", label: "Микротоковая терапия" },
                  { value: "EMS", label: "EMS" },
                  { value: "Вакуум + RF", label: "Вакуум + RF" },
                ]}
              />
            </div>
          )}

          {extras.map((extra) => {
            const value = extraValues[extra.id] ?? "";
            if (extra.type === "select") {
              return (
                <SelectField
                  key={extra.id}
                  id={`cf-extra-${extra.id}`}
                  label={extra.label}
                  value={value}
                  onChange={(val) => setExtraValue(extra.id, val)}
                  options={extra.options}
                  placeholder={extra.placeholder}
                  optional={extra.optional}
                />
              );
            }
            return (
              <TextField
                key={extra.id}
                id={`cf-extra-${extra.id}`}
                type={extra.type}
                label={extra.label}
                value={value}
                onChange={(val) => setExtraValue(extra.id, val)}
                placeholder={extra.placeholder}
                optional={extra.optional}
                maxLength={extra.maxLength}
              />
            );
          })}

          <TextareaField
            id="cf-comment"
            label="Комментарий"
            optional
            value={comment}
            onChange={setComment}
            placeholder="Удобное время, вопросы..."
            maxLength={200}
          />

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Как с вами связаться?</span>
            <div className={styles.toggle}>
              <button
                type="button"
                className={`${styles.toggle__pill} ${contactMethod === "write" ? styles["toggle__pill--active"] : ""}`}
                onClick={() => setContactMethod("write")}
              >
                Написать
              </button>
              <button
                type="button"
                className={`${styles.toggle__pill} ${contactMethod === "call" ? styles["toggle__pill--active"] : ""}`}
                onClick={() => setContactMethod("call")}
              >
                Позвонить
              </button>
            </div>
          </div>

          <ConsentCheckbox checked={agreement} onChange={setAgreement} onLinkClick={onClose} />

          <FormError
            message={
              status === "error" || errorMessage
                ? errorMessage || "Произошла ошибка. Попробуйте ещё раз."
                : ""
            }
          />

          <SubmitButton
            valid={allValid}
            loading={status === "loading"}
            onAttempt={() => setAttempted(true)}
          >
            Отправить
          </SubmitButton>
        </form>
      )}
    </Modal>
  );
}
