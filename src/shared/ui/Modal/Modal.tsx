"use client";

import type { ReactElement, ReactNode } from "react";
import { useCallback } from "react";
import { OstentatiousCrossIcon } from "@/shared/ui/icons/OstentatiousCrossIcon";
import { useModalLifecycle } from "@/shared/lib/hooks/useModalLifecycle";
import styles from "./Modal.module.scss";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Show close button in corner (for success state without header) */
  cornerClose?: boolean;
  /** Reset state after close animation completes */
  onAfterClose?: () => void;
  /** Sticky header content: eyebrow, title, sub */
  header?: ReactNode;
  /** Scrollable body content */
  children?: ReactNode;
  /** Aria label for screen readers */
  ariaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  cornerClose = false,
  onAfterClose,
  header,
  children,
  ariaLabel,
}: ModalProps): ReactElement | null {
  const { visible, closing } = useModalLifecycle({ isOpen, onClose, onAfterClose });

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${closing ? styles["overlay--closing"] : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div className={styles.box}>
        {cornerClose && (
          <button
            type="button"
            className={`${styles.close} ${styles["close--corner"]}`}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <OstentatiousCrossIcon size={12} />
          </button>
        )}
        {header && <div className={styles.header}>{header}</div>}
        {children !== undefined && <div className={styles.body}>{children}</div>}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  onClose: () => void;
}

/** Convenience component: eyebrow + title-row (with close button) + sub */
export function ModalHeader({ eyebrow, title, sub, onClose }: ModalHeaderProps): ReactElement {
  return (
    <>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <div className={styles.titleRow}>
        <h2 className={styles.title}>{title}</h2>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <OstentatiousCrossIcon size={14} />
        </button>
      </div>
      {sub && <p className={styles.sub}>{sub}</p>}
    </>
  );
}
