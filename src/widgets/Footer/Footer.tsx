"use client";

import type { MouseEvent, ReactElement } from "react";
import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { config } from "@/shared/config";
import { TelegramIcon } from "@/shared/ui/icons/TelegramIcon";
import { WhatsAppIcon } from "@/shared/ui/icons/WhatsAppIcon";
import { InstagramIcon } from "@/shared/ui/icons/InstagramIcon";
import { VkIcon } from "@/shared/ui/icons/VkIcon";
import { SBLogoIcon } from "@/shared/ui/icons/SBLogoIcon";
import styles from "./Footer.module.scss";

const NAV_LINKS = [
	{ href: "/", label: "Главная" },
	{ href: "/#promos", id: "promos", label: "Акции" },
	{ href: "/#services", id: "services", label: "Услуги" },
	{ href: "/#team", id: "team", label: "Специалисты" },
	{ href: "/#gallery", id: "gallery", label: "Галерея" },
	{ href: "/#contacts", id: "contacts", label: "Контакты" },
	{ href: "/shop/", label: "Магазин" },
	{ href: "/abonementy/", label: "Абонементы" },
	{ href: "/sertifikaty/", label: "Сертификаты" },
	{ href: "/installments/", label: "Рассрочка" },
] as const;

const SERVICE_LINKS = [
	{ href: "/epilation/", label: "Лазерная эпиляция" },
	{ href: "/depilation/", label: "Депиляция" },
	{ href: "/cleansing/", label: "Чистки лица" },
	{ href: "/peelings/", label: "Пилинги" },
	{ href: "/microcurrenttherapy/", label: "Микротоковая терапия" },
	{ href: "/rflifting/", label: "RF-лифтинг" },
	{ href: "/lpg/", label: "LPG" },
	{ href: "/vacuum/", label: "Вакуум + RF" },
	{ href: "/ems/", label: "EMS" },
] as const;

export function Footer(): ReactElement {
	const pathname = usePathname();

	const handleSectionLink = useCallback((e: MouseEvent<HTMLAnchorElement>, id?: string) => {
		if (!id) return;
		if (pathname !== "/") {
			return;
		}

		const el = document.getElementById(id);
		if (el) {
			e.preventDefault();
			el.scrollIntoView({ behavior: "smooth" });
		}
	}, [pathname]);

	return (
		<footer className={styles.footer}>
			<div className={styles.footer__container}>
				<div className={styles.footer__inner}>
					<div className={styles.footer__brand}>
						<div className={styles.footer__logo}>
							<SBLogoIcon size={30} className={styles.footer__logoIcon} />
							{config.SITE_NAME}
						</div>
						<div className={styles.footer__owner}>
							ИП Иванова Анна Сергеевна
							<span className={styles.footer__inn}>
								ИНН {config.INN}
							</span>
						</div>
						<div className={styles.footer__socials}>
							<a
								href="https://t.me/example"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.footer__social}
								aria-label="Telegram"
							>
								<TelegramIcon size={16} />
							</a>
							<a
								href={`https://wa.me/${config.PHONE_RAW}`}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.footer__social}
								aria-label="WhatsApp"
							>
								<WhatsAppIcon size={16} />
							</a>
							<a
								href="https://www.instagram.com/skinlab_ulyanovsk"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.footer__social}
								aria-label="Instagram"
							>
								<InstagramIcon size={16} />
							</a>
							<a
								href="https://vk.com/example"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.footer__social}
								aria-label="ВКонтакте"
							>
								<VkIcon size={16} />
							</a>
						</div>

						<a
							href="https://честныйзнак.рф"
							target="_blank"
							rel="noopener noreferrer"
							className={styles.footer__mark}
							aria-label="Участник национальной системы маркировки «Честный знак»"
						>
							<Image
								src="/images/chestny-znak-compact.webp"
								alt="Честный ЗНАК — национальная система цифровой маркировки"
								width={620}
								height={270}
								className={styles.footer__markImg}
							/>
							<span className={styles.footer__markNote}>
								Подлинность товаров можно проверить в приложении «Честный знак»
							</span>
						</a>
					</div>

					<div className={styles.footer__nav}>
						<div className={styles.footer__navGroup}>
							<div className={styles.footer__navTitle}>Навигация</div>
							{NAV_LINKS.map((link) => (
								<Link
									key={link.label}
									href={link.href}
									className={styles.footer__navLink}
									onClick={(e) => handleSectionLink(e, "id" in link ? link.id : undefined)}
								>
									{link.label}
								</Link>
							))}
						</div>
						<div className={styles.footer__navGroup}>
							<div className={styles.footer__navTitle}>Услуги</div>
							{SERVICE_LINKS.map(({ href, label }) => (
								<Link key={href} href={href} className={styles.footer__navLink}>
									{label}
								</Link>
							))}
						</div>
						<div className={styles.footer__navGroup}>
							<div className={styles.footer__navTitle}>Контакты</div>
							<a href={`tel:${config.PHONE_RAW}`} className={styles.footer__navLink}>
								{config.PHONE}
							</a>
							<a
								href="https://t.me/example"
								target="_blank"
								rel="noopener noreferrer"
								className={styles.footer__navLink}
							>
								Telegram: @example
							</a>
							<span className={styles.footer__navLink}>
								Примерная, 1
							</span>
							<span className={styles.footer__navLink}>
								Образцовая, 2
							</span>
						</div>
					</div>
				</div>

				<div className={styles.footer__bottom}>
					<div className={styles.footer__copy}>
						© 2026 {config.SITE_NAME}. Все права защищены.
					</div>
					<div className={styles.footer__legal}>
						<Link href="/privacy/">Политика конфиденциальности</Link>
						<span className={styles.footer__legalSep}>·</span>
						<Link href="/consent/">Согласие на обработку ПД</Link>
						<span className={styles.footer__legalSep}>·</span>
						<Link href="/shop/oferta/">Публичная оферта</Link>
						<span className={styles.footer__legalSep}>·</span>
						<Link href="/document/">Документы и сертификаты</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
