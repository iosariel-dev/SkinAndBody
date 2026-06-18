"use client";

import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useContactForm } from "@/shared/lib/hooks/useContactForm";
import { config } from "@/shared/config";
import { TelegramIcon } from "@/shared/ui/icons/TelegramIcon";
import { WhatsAppIcon } from "@/shared/ui/icons/WhatsAppIcon";
import { InstagramIcon } from "@/shared/ui/icons/InstagramIcon";
import { VkIcon } from "@/shared/ui/icons/VkIcon";
import { SBLogoIcon } from "@/shared/ui/icons/SBLogoIcon";
import { CartButton } from "@/features/cart/CartButton";
import styles from "./Header.module.scss";

const NAV_LEFT = [
  { id: "promos", label: "Акции" },
  { id: "services", label: "Услуги" },
  { id: "team", label: "Специалисты" },
];

const NAV_RIGHT = [
  { id: "contacts", label: "Контакты" },
  { id: "reviews", label: "Отзывы" },
];

const MOBILE_LINKS = [
  { id: "promos", label: "Акции" },
  { id: "services", label: "Услуги" },
  { id: "team", label: "Специалисты" },
  { id: "contacts", label: "Контакты" },
  { id: "reviews", label: "Отзывы" },
];

export function Header(): ReactElement {
  const { open: openContactForm } = useContactForm();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    if (pathname !== "/") {
      router.push("/");
      const check = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          requestAnimationFrame(check);
        }
      };
      requestAnimationFrame(check);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname, router]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("lock", next);
      return next;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.classList.remove("lock");
  }, []);

  const handleCta = useCallback(() => {
    closeMenu();
    openContactForm();
  }, [closeMenu, openContactForm]);

  const handleNavClick = useCallback((id: string) => {
    closeMenu();
    scrollToSection(id);
  }, [closeMenu, scrollToSection]);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles["header--scrolled"] : ""}`}
      >
        <div className={styles.header__container}>
          <div className={styles.header__inner}>

            {/* Left nav — desktop */}
            <nav className={styles.header__navLeft} aria-label="Основная навигация (левая)">
              {NAV_LEFT.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={styles.header__link}
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </button>
              ))}
              <Link href="/shop/" className={styles.header__link}>
                Магазин
              </Link>
            </nav>

            {/* Centered logo */}
            <Link href="/" className={styles.header__logo} aria-label="Skin&Body — на главную">
              <SBLogoIcon size={34} className={styles.header__logoIcon} />
              <div className={styles.header__logoText}>
                <span className={styles.header__logoName}>SKIN&amp;BODY</span>
                <span className={styles.header__logoSub}>эстетика лица и тела</span>
              </div>
            </Link>

            {/* Right nav — desktop */}
            <nav className={styles.header__navRight} aria-label="Основная навигация (правая)">
              {NAV_RIGHT.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={styles.header__link}
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                className={styles.header__cta}
                onClick={() => openContactForm()}
              >
                Оставить заявку
              </button>
              <CartButton />
            </nav>

            {/* Burger — mobile */}
            <button
              type="button"
              className={`${styles.header__burger} ${menuOpen ? styles["header__burger--open"] : ""}`}
              onClick={toggleMenu}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>

            {/* Cart — mobile (right side) */}
            <CartButton className={styles.header__cartMobile} />

          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles["mobileMenu--open"] : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.mobileMenu__nav} aria-label="Мобильная навигация">
          {MOBILE_LINKS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={styles.mobileMenu__link}
              onClick={() => handleNavClick(id)}
            >
              {label}
            </button>
          ))}
          <Link
            href="/shop/"
            className={styles.mobileMenu__link}
            onClick={closeMenu}
          >
            Магазин
          </Link>
        </nav>

        <a
          href={`tel:${config.PHONE_RAW}`}
          className={styles.mobileMenu__phone}
        >
          {config.PHONE}
        </a>

        <div className={styles.mobileMenu__socials}>
          <a
            href="https://t.me/example"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileMenu__socialLink}
            aria-label="Telegram"
          >
            <TelegramIcon size={16} />
          </a>
          <a
            href={`https://wa.me/${config.PHONE_RAW}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileMenu__socialLink}
            aria-label="WhatsApp"
          >
            <WhatsAppIcon size={16} />
          </a>
          <a
            href="https://www.instagram.com/skinlab_ulyanovsk"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileMenu__socialLink}
            aria-label="Instagram"
          >
            <InstagramIcon size={16} />
          </a>
          <a
            href="https://vk.com/example"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileMenu__socialLink}
            aria-label="ВКонтакте"
          >
            <VkIcon size={16} />
          </a>
        </div>

        <button
          type="button"
          className={styles.mobileMenu__cta}
          onClick={handleCta}
        >
          Записаться на процедуру
        </button>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className={styles.header__backdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
