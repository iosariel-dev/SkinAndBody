"use client";

import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";

import styles from "../ServicePage.module.scss";
import { ROMAN, splitPriceItems } from "../lib";
import type { ServiceData } from "@/entities/service";

interface PriceRowProps {
  badge: ReactNode;
  name: ReactNode;
  zones?: ReactNode;
  price: ReactNode;
  complex?: boolean;
}

// Строка прайса: badge + название (+ опц. строка зон/описания) + цена.
// complex добавляет модификатор --complex (для комплексов/абонементов/одиночных тарифов).
function PriceRow({ badge, name, zones, price, complex }: PriceRowProps): ReactElement {
  return (
    <div className={`${styles["price-item"]}${complex ? ` ${styles["price-item--complex"]}` : ""}`}>
      <div className={styles["price-item__left"]}>
        <div className={styles["price-item__badge"]}>{badge}</div>
        <div>
          <div className={styles["price-item__name"]}>{name}</div>
          {zones && <div className={styles["price-item__zones"]}>{zones}</div>}
        </div>
      </div>
      <div className={styles["price-item__right"]}>
        <div className={styles["price-item__price"]}>{price}</div>
      </div>
    </div>
  );
}

interface PricesSectionProps {
  data: ServiceData;
  openContactForm: (title?: string) => void;
}

export function PricesSection({ data, openContactForm }: PricesSectionProps): ReactElement {
  const [activeTab, setActiveTab] = useState(0);

  const activeTier = data.prices[activeTab];

  // If every tier has only 1 item — render as flat list without tabs
  const isSingleItemPerTier =
    data.prices.length > 1 &&
    data.prices.every((tier) => tier.items.length === 1);

  const { complexItems, subscriptionItems, singleItems } = splitPriceItems(activeTier);

  return (
    <section className={styles.prices} id="prices">
      <div className={styles.prices__container}>
        <div className={styles.prices__head}>
          <span className={styles.prices__eyebrow}>Стоимость</span>
          <h2 className={styles.prices__title}>
            Цены на <em>{(data.titleAccusative || data.title).toLowerCase()}</em>
          </h2>
          {data.showConsultation && (
            <p className={styles.prices__sub}>
              Рекомендуется записаться на консультацию перед процедурой
            </p>
          )}
        </div>

        {/* Installments inline notice — только для услуг с абонементами */}
        {data.hasInstallments && (
          <Link
            href="/installments/"
            className={styles["installments-inline"]}
          >
            <span className={styles["installments-inline__icon"]} aria-hidden="true">
              ✦
            </span>
            <span className={styles["installments-inline__body"]}>
              <span className={styles["installments-inline__title"]}>
                Курс можно взять <em>в рассрочку</em> — без переплат
              </span>
              <span className={styles["installments-inline__sub"]}>
                Действует на абонементы. 2 или 3 платежа по письменному договору.
              </span>
            </span>
            <span className={styles["installments-inline__link"]}>
              Условия
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        )}

        {/* Trial offer banner */}
        {data.trialOffer && (
          <div className={styles["prices__trial"]}>
            <div className={styles["prices__trial-badge"]}>Первый визит</div>
            <div className={styles["prices__trial-content"]}>
              <div className={styles["prices__trial-info"]}>
                <h3 className={styles["prices__trial-title"]}>{data.trialOffer.title}</h3>
                {data.trialOffer.note && (
                  <p className={styles["prices__trial-note"]}>{data.trialOffer.note}</p>
                )}
              </div>
              <div className={styles["prices__trial-right"]}>
                <span className={styles["prices__trial-price"]}>{data.trialOffer.price}</span>
                <button
                  type="button"
                  className={styles["prices__trial-btn"]}
                  onClick={() => openContactForm(data.title)}
                >
                  Записаться
                </button>
              </div>
            </div>
          </div>
        )}

        {isSingleItemPerTier ? (
          /* All tiers have 1 item — render as complex-style cards without tabs */
          <div className={styles.prices__list}>
            {data.prices.map((tier, i) => (
              <PriceRow
                key={i}
                complex
                badge={ROMAN[i] || `${i + 1}`}
                name={tier.label}
                zones={
                  <>
                    {tier.items[0].name}
                    {tier.note && ` · ${tier.note}`}
                  </>
                }
                price={tier.items[0].price}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Tabs — only show if more than 1 tier */}
            {data.prices.length > 1 && (
              <div className={styles["prices__tabs-wrap"]}>
                <div className={styles.prices__tabs} role="tablist">
                  {data.prices.map((tier, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={activeTab === i}
                      className={`${styles.prices__tab}${activeTab === i ? ` ${styles["prices__tab--active"]}` : ""}`}
                      onClick={() => setActiveTab(i)}
                      type="button"
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Panel */}
            <div className={styles.prices__panel} role="tabpanel">
              {activeTier.note && (
                <div className={styles.prices__disclaimer}>
                  <span
                    className={styles["prices__disclaimer-dot"]}
                    aria-hidden="true"
                  />
                  {activeTier.note}
                </div>
              )}

              {/* 1. Комплексы — всегда сверху */}
              {complexItems.length > 0 && (
                <>
                  {(singleItems.length > 0 || subscriptionItems.length > 0) && (
                    <span className={styles["prices__section-label"]}>
                      {activeTier.complexLabel || "Комплексы — выгодное сочетание зон"}
                    </span>
                  )}
                  <div className={styles.prices__list}>
                    {complexItems.map((item, i) => (
                      <PriceRow
                        key={i}
                        complex
                        badge={ROMAN[i] || `${i + 1}`}
                        name={item.name}
                        zones={item.description}
                        price={item.price}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* 2. Отдельные зоны — посередине */}
              {singleItems.length > 0 && (
                <>
                  {(complexItems.length > 0 || subscriptionItems.length > 0) && (
                    <span className={styles["prices__section-label"]}>
                      {activeTier.singleLabel || "Отдельные зоны"}
                    </span>
                  )}
                  <div className={styles.prices__list}>
                    {singleItems.map((item, i) => (
                      <PriceRow
                        key={i}
                        badge={i + 1}
                        name={item.name}
                        price={item.price}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* 3. Абонементы — всегда снизу */}
              {subscriptionItems.length > 0 && (
                <>
                  <span className={styles["prices__section-label"]}>
                    {activeTier.complexLabel || "Абонементы — выгодное посещение"}
                  </span>
                  <div className={styles.prices__list}>
                    {subscriptionItems.map((item, i) => (
                      <PriceRow
                        key={i}
                        complex
                        badge={ROMAN[i] || `${i + 1}`}
                        name={item.name}
                        zones={item.description}
                        price={item.price}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
