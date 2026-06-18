"use client";

import { useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import styles from "./CookieBanner.module.scss";
import { CookieIcon } from "@/shared/ui/icons/CookieIcon";

const STORAGE_KEY = "skinandbody:cookie-consent";
type ConsentValue = "accepted" | "rejected";

function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

function writeConsent(v: ConsentValue): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, v);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: v }));
  } catch {
    // ignore
  }
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function CookieBanner(): ReactElement | null {
  // SSR: возвращаем null (баннер не виден) → во время hydration читаем localStorage
  const decision = useSyncExternalStore<ConsentValue | null>(
    subscribe,
    readConsent,
    () => null,
  );

  const accept = (): void => writeConsent("accepted");
  const reject = (): void => writeConsent("rejected");

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  var key = "${STORAGE_KEY}";
  function hide(){
    var banner = document.querySelector("[data-cookie-banner]");
    if (banner) banner.style.display = "none";
  }
  function loadYandex(){
    if (window.__skinBodyMetrikaLoaded) return;
    window.__skinBodyMetrikaLoaded = true;
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
    ym(00000000,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
    var yclients = document.createElement("script");
    yclients.src = "https://w000000.yclients.com/widgetJS";
    yclients.async = true;
    document.body.appendChild(yclients);
  }
  // Помечаем <html> до того, как баннер появится в DOM — CSS прячет его
  // мгновенно, без мелькания при загрузке/навигации (особенно на мобильном).
  function markDone(){ document.documentElement.setAttribute("data-cookie", "done"); }
  try {
    var saved = localStorage.getItem(key);
    if (saved === "accepted" || saved === "rejected") {
      markDone();
      hide();
    }
    if (saved === "accepted") loadYandex();
  } catch (e) {}
  document.addEventListener("click", function(e){
    var target = e.target && e.target.closest && e.target.closest("[data-cookie-choice]");
    if (!target) return;
    var value = target.getAttribute("data-cookie-choice");
    if (value !== "accepted" && value !== "rejected") return;
    try { localStorage.setItem(key, value); } catch (e) {}
    markDone();
    hide();
    if (value === "accepted") loadYandex();
  });
})();`,
        }}
      />

      {/* Yandex.Metrika и yclients грузит inline-скрипт выше (после согласия).
          Отдельные <Script> убраны — они дублировали загрузку (двойная кнопка yclients). */}

      {decision === null && (
        <div className={styles.banner} role="dialog" aria-label="Использование cookie" data-cookie-banner>
          <div className={styles.banner__inner}>
            <span className={styles.banner__icon} aria-hidden="true">
              <CookieIcon size={22} />
            </span>
            <p className={styles.banner__text}>
              Сайт использует <b>cookies</b> и сервис аналитики <b>Яндекс.Метрика</b> для улучшения работы.{" "}
              Подробнее в{" "}
              <Link href="/privacy/" className={styles.banner__link}>
                политике конфиденциальности
              </Link>
              .
            </p>
            <div className={styles.banner__actions}>
              <button
                type="button"
                className={`${styles.banner__btn} ${styles["banner__btn--ghost"]}`}
                onClick={reject}
                data-cookie-choice="rejected"
              >
                Отклонить
              </button>
              <button
                type="button"
                className={`${styles.banner__btn} ${styles["banner__btn--primary"]}`}
                onClick={accept}
                data-cookie-choice="accepted"
              >
                Принять
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
