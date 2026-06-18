"use client";

import type { ReactNode, ReactElement } from "react";
import { createContext, useCallback, useContext, useState } from "react";

export type ContactFormExtra =
  | {
      id: string;
      type: "text" | "tel" | "number";
      label: string;
      placeholder?: string;
      optional?: boolean;
      maxLength?: number;
    }
  | {
      id: string;
      type: "select";
      label: string;
      placeholder?: string;
      optional?: boolean;
      options: Array<{ value: string; label: string }>;
    };

interface ContactFormOpenOptions {
  extras?: ContactFormExtra[];
}

interface ContactFormContextValue {
  isOpen: boolean;
  preselectedService: string;
  extras: ContactFormExtra[];
  open: (service?: string, options?: ContactFormOpenOptions) => void;
  close: () => void;
}

const ContactFormContext = createContext<ContactFormContextValue>({
  isOpen: false,
  preselectedService: "",
  extras: [],
  open: () => {},
  close: () => {},
});

export function ContactFormProvider({ children }: { children: ReactNode }): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState("");
  const [extras, setExtras] = useState<ContactFormExtra[]>([]);

  const open = useCallback((service?: string, options?: ContactFormOpenOptions) => {
    setPreselectedService(service || "");
    setExtras(options?.extras ?? []);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setPreselectedService("");
    setExtras([]);
  }, []);

  return (
    <ContactFormContext.Provider value={{ isOpen, preselectedService, extras, open, close }}>
      {children}
    </ContactFormContext.Provider>
  );
}

export function useContactForm(): ContactFormContextValue {
  return useContext(ContactFormContext);
}
