"use client";

import { useCallback, useState } from "react";

import { getPhoneDigits } from "@/shared/lib/helpers/formatPhone";
import { submitForm, getPageTitle } from "@/shared/lib/helpers/sendToTelegram";

export type ConsultType = "general" | "acne";

/**
 * Состояние и логика модалки консультаций (две карточки: общая / по акне):
 * открытие по типу, валидация, отправка в Telegram, сброс после закрытия.
 */
export function useConsultForm() {
  const [consultModalOpen, setConsultModalOpen] = useState<ConsultType | null>(null);
  const [consultStatus, setConsultStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [consultAttempted, setConsultAttempted] = useState(false);
  const [consultAgreement, setConsultAgreement] = useState(false);
  const [consultErrorMessage, setConsultErrorMessage] = useState("");

  const [consultForm, setConsultForm] = useState({
    name: "",
    phone: "",
    comment: "",
    problem: "",
  });

  const openConsult = useCallback((type: ConsultType) => {
    setConsultModalOpen(type);
  }, []);

  const closeConsultModal = useCallback(() => {
    setConsultModalOpen(null);
  }, []);

  // Запоминаем последний открытый тип, чтобы Modal во время closing-анимации
  // продолжал показывать корректный заголовок (consultModalOpen уже null).
  // setState during render — стандартный паттерн React для производных значений.
  const [consultActiveType, setConsultActiveType] = useState<ConsultType | null>(null);
  if (consultModalOpen !== null && consultModalOpen !== consultActiveType) {
    setConsultActiveType(consultModalOpen);
  }

  const handleConsultSubmit = useCallback(
    async (type: ConsultType) => {
      if (consultForm.name.trim().length < 2) {
        setConsultErrorMessage("Имя должно содержать минимум 2 символа");
        return;
      }
      if (getPhoneDigits(consultForm.phone).length !== 11) {
        setConsultErrorMessage("Введите корректный номер телефона");
        return;
      }
      if (!consultAgreement) {
        setConsultErrorMessage("Поставьте галочку согласия на обработку персональных данных");
        return;
      }

      setConsultErrorMessage("");
      setConsultStatus("loading");

      try {
        await submitForm(
          type === "general"
            ? {
                type: "consultation_general",
                name: consultForm.name.trim(),
                phone: consultForm.phone,
                page: getPageTitle(),
                comment: consultForm.comment || undefined,
              }
            : {
                type: "consultation_acne",
                name: consultForm.name.trim(),
                phone: consultForm.phone,
                page: getPageTitle(),
                problem: consultForm.problem || undefined,
              }
        );

        setConsultStatus("success");
        setTimeout(() => closeConsultModal(), 3000);
      } catch {
        setConsultStatus("error");
        setConsultErrorMessage("Произошла ошибка. Попробуйте ещё раз.");
      }
    },
    [consultForm, consultAgreement, closeConsultModal]
  );

  const resetAfterClose = useCallback(() => {
    setConsultActiveType(null);
    setConsultForm({ name: "", phone: "", comment: "", problem: "" });
    setConsultStatus("idle");
    setConsultAttempted(false);
    setConsultAgreement(false);
    setConsultErrorMessage("");
  }, []);

  const consultNameValid = consultForm.name.trim().length >= 2;
  const consultPhoneValid = getPhoneDigits(consultForm.phone).length === 11;
  const consultNameError = consultAttempted && !consultNameValid;
  const consultPhoneError = consultAttempted && !consultPhoneValid;

  return {
    consultModalOpen,
    consultActiveType,
    consultStatus,
    consultForm,
    setConsultForm,
    consultAgreement,
    setConsultAgreement,
    setConsultAttempted,
    consultErrorMessage,
    openConsult,
    closeConsultModal,
    handleConsultSubmit,
    resetAfterClose,
    consultNameValid,
    consultPhoneValid,
    consultNameError,
    consultPhoneError,
  };
}
