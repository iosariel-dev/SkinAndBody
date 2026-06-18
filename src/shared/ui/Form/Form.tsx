"use client";

import type { ReactElement, ReactNode, TextareaHTMLAttributes } from "react";
import Link from "next/link";
import { formatPhone } from "@/shared/lib/helpers/formatPhone";
import { Dropdown } from "@/shared/ui/Dropdown/Dropdown";
import styles from "./Form.module.scss";

// ───────── NameField ─────────

interface NameFieldProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  hint?: string;
  placeholder?: string;
  maxLength?: number;
}

export function NameField({
  id = "name",
  value,
  onChange,
  error,
  hint = "Минимум 2 символа",
  placeholder = "Мария",
  maxLength = 40,
}: NameFieldProps): ReactElement {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>Имя</label>
      <input
        id={id}
        type="text"
        className={`${styles.input} ${error ? styles["input--error"] : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, ""))}
        maxLength={maxLength}
        autoComplete="name"
        required
      />
      {error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

// ───────── PhoneField ─────────

interface PhoneFieldProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  hint?: string;
}

export function PhoneField({
  id = "phone",
  value,
  onChange,
  error,
  hint = "Введите номер полностью",
}: PhoneFieldProps): ReactElement {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>Телефон</label>
      <input
        id={id}
        type="tel"
        className={`${styles.input} ym-disable-keys ym-hide-content ${error ? styles["input--error"] : ""}`}
        placeholder="+7 (___) ___-__-__"
        value={value}
        onChange={(e) => onChange(formatPhone(e.target.value))}
        autoComplete="tel"
      />
      {error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

// ───────── TextareaField ─────────

interface TextareaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  optional?: boolean;
  error?: boolean;
  hint?: string;
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  optional,
  error,
  hint,
  ...rest
}: TextareaFieldProps): ReactElement {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}{" "}
        {optional && <span className={styles.optional}>(необязательно)</span>}
      </label>
      <textarea
        id={id}
        className={`${styles.textarea} ym-disable-keys ym-hide-content ${error ? styles["textarea--error"] : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={1000}
        {...rest}
      />
      {error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

// ───────── TextField (generic single-line) ─────────

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: "text" | "tel" | "number";
  placeholder?: string;
  optional?: boolean;
  maxLength?: number;
  error?: boolean;
  hint?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  optional,
  maxLength,
  error,
  hint,
}: TextFieldProps): ReactElement {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}{" "}
        {optional && <span className={styles.optional}>(необязательно)</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`${styles.input} ym-disable-keys ym-hide-content ${error ? styles["input--error"] : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
      />
      {error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

// ───────── SelectField (label + Dropdown) ─────────

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  optional?: boolean;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  optional,
}: SelectFieldProps): ReactElement {
  return (
    <div className={styles.field}>
      <span className={styles.label}>
        {label}{" "}
        {optional && <span className={styles.optional}>(необязательно)</span>}
      </span>
      <Dropdown
        id={id}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
      />
    </div>
  );
}

// ───────── ConsentCheckbox ─────────

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Called when user clicks links inside the checkbox text (to close modal etc.) */
  onLinkClick?: () => void;
}

export function ConsentCheckbox({
  checked,
  onChange,
  onLinkClick,
}: ConsentCheckboxProps): ReactElement {
  return (
    <label className={styles.consent}>
      <input
        type="checkbox"
        className={styles.consentBox}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.consentText}>
        Я даю{" "}
        <Link href="/consent/" className={styles.legalLink} onClick={onLinkClick}>
          согласие на обработку персональных данных
        </Link>{" "}
        и ознакомлен(а) с{" "}
        <Link href="/privacy/" className={styles.legalLink} onClick={onLinkClick}>
          политикой конфиденциальности
        </Link>
      </span>
    </label>
  );
}

// ───────── FormError ─────────

export function FormError({ message }: { message: string }): ReactElement | null {
  if (!message) return null;
  return (
    <div className={styles.errorBlock} role="alert">
      {message}
    </div>
  );
}

// ───────── SubmitButton ─────────

interface SubmitButtonProps {
  children: ReactNode;
  /** Submit еnabled when form is valid */
  valid: boolean;
  /** Loading state (disables click) */
  loading?: boolean;
  /** Click on disabled state — should set "attempted" flag in form */
  onAttempt?: () => void;
  loadingText?: string;
}

export function SubmitButton({
  children,
  valid,
  loading,
  onAttempt,
  loadingText = "Отправка...",
}: SubmitButtonProps): ReactElement {
  return (
    <button
      type={valid ? "submit" : "button"}
      className={`${styles.submit} ${!valid ? styles["submit--disabled"] : ""}`}
      disabled={loading}
      onClick={!valid ? onAttempt : undefined}
    >
      {loading ? loadingText : children}
    </button>
  );
}

// ───────── FormRow (two columns) ─────────

export function FormRow({ children }: { children: ReactNode }): ReactElement {
  return <div className={styles.row}>{children}</div>;
}
