"use client";

import type { ReactElement, ReactNode } from "react";

import { ContactForm } from "@/features/contact-form";
import { ContactFormProvider, useContactForm } from "@/shared/lib/hooks/useContactForm";
import { CartProvider } from "@/features/cart/CartProvider";
import { CartDrawer } from "@/features/cart/CartDrawer";

function ContactFormModal(): ReactElement | null {
  const { isOpen, preselectedService, extras, close } = useContactForm();
  return (
    <ContactForm
      isOpen={isOpen}
      preselectedService={preselectedService}
      extras={extras}
      onClose={close}
    />
  );
}

export function Providers({ children }: { children: ReactNode }): ReactElement {
  return (
    <ContactFormProvider>
      <CartProvider>
        {children}
        <ContactFormModal />
        <CartDrawer />
      </CartProvider>
    </ContactFormProvider>
  );
}
