"use client";

import type { ReactElement } from "react";
import { useCallback, useState } from "react";

import { useContactForm } from "@/shared/lib/hooks/useContactForm";
import { useReveal } from "@/shared/lib/hooks/useReveal";

import { locations, locationKeys, specialists } from "./homeData";

import { HeroSection } from "./sections/HeroSection";
import { PromosSection } from "./sections/PromosSection";
import { SpecialsSection } from "./sections/SpecialsSection";
import { ServicesSection } from "./sections/ServicesSection";
import { ShopSection } from "./sections/ShopSection";
import { SpecialistsSection } from "./sections/SpecialistsSection";
import { GallerySection } from "./sections/GallerySection";
import { ContactsSection } from "./sections/ContactsSection";
import { ReviewsSection } from "./sections/ReviewsSection";

export function HomePage(): ReactElement {
	const { open: openContactForm } = useContactForm();
	const revealRef = useReveal();

	// Активная локация шарится между «Специалистами», «Контактами» и «Отзывами».
	const [activeLocation, setActiveLocation] = useState(0);
	const switchLocation = useCallback((index: number) => {
		setActiveLocation(index);
	}, []);

	const currentSpecialists = specialists[locationKeys[activeLocation]] ?? [];
	const currentLocation = locations[activeLocation];

	return (
		<div ref={revealRef}>
			<HeroSection openContactForm={openContactForm} />
			<PromosSection openContactForm={openContactForm} />
			<SpecialsSection />
			<ServicesSection />
			<ShopSection />
			<SpecialistsSection
				activeLocation={activeLocation}
				switchLocation={switchLocation}
				currentSpecialists={currentSpecialists}
			/>
			<GallerySection />
			<ContactsSection
				currentLocation={currentLocation}
				activeLocation={activeLocation}
				switchLocation={switchLocation}
				openContactForm={openContactForm}
			/>
			<ReviewsSection
				currentLocation={currentLocation}
				activeLocation={activeLocation}
				switchLocation={switchLocation}
			/>
		</div>
	);
}
