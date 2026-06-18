import { useEffect, useState } from "react";

interface UseModalLifecycleOptions {
  isOpen: boolean;
  onClose: () => void;
  closeDelayMs?: number;
  onAfterClose?: () => void;
}

interface UseModalLifecycleResult {
  visible: boolean;
  closing: boolean;
}

/**
 * Unified open/close animation + escape + body overflow lock for modals.
 * Returns `visible` (keep DOM mounted) and `closing` (apply --closing modifier).
 */
export function useModalLifecycle({
  isOpen,
  onClose,
  closeDelayMs = 350,
  onAfterClose,
}: UseModalLifecycleOptions): UseModalLifecycleResult {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Анимация открытия/закрытия модалки — легитимный setState-in-effect:
  // состояние visible/closing синхронизируется с пропом isOpen и таймером
  // закрытия (внешняя система — время). Документированное исключение правила.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
      document.body.style.overflow = "hidden";
      return;
    }
    if (visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
        document.body.style.overflow = "";
        onAfterClose?.();
      }, closeDelayMs);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return { visible, closing };
}
