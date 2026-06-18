"use client";

import type { ReactElement } from "react";

import styles from "./ServicePage.module.scss";
import { useContactForm } from "@/shared/lib/hooks/useContactForm";
import { useReveal } from "@/shared/lib/hooks/useReveal";
import type { ServiceData } from "@/entities/service";

import { HeroSection } from "./sections/HeroSection";
import { ProcedureSection } from "./sections/ProcedureSection";
import { ProceduresAccordion } from "./sections/ProceduresAccordion";
import { ResultsSection } from "./sections/ResultsSection";
import { BeforeAfterSection } from "./sections/BeforeAfterSection";
import { EquipmentSection } from "./sections/EquipmentSection";
import { ConsultationSection } from "./sections/ConsultationSection";
import { PricesSection } from "./sections/PricesSection";
import { CtaBand } from "./sections/CtaBand";

interface ServicePageProps {
  data: ServiceData;
}

export function ServicePage({ data }: ServicePageProps): ReactElement {
  const { open: openContactForm } = useContactForm();
  const revealRef = useReveal();

  return (
    <div className={styles.page} ref={revealRef as React.RefObject<HTMLDivElement>}>
      <HeroSection data={data} openContactForm={openContactForm} />
      <ProcedureSection data={data} />
      <ProceduresAccordion data={data} />
      <ResultsSection data={data} />
      <BeforeAfterSection data={data} />
      <EquipmentSection data={data} />
      <ConsultationSection data={data} />
      <PricesSection data={data} openContactForm={openContactForm} />
      <CtaBand data={data} openContactForm={openContactForm} />
    </div>
  );
}
