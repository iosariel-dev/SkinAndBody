# Skin&Body — сайт студии эстетики + интернет-магазин

Продакшен-сайт студии эстетики лица и тела **Skin&Body** (Ульяновск) с интернет-магазином профессиональной косметики и онлайн-оплатой. Живая версия — [skinandbody.ru](https://skinandbody.ru).

> Коммерческий проект реального клиента. Код открыт для ознакомления и портфолио; условия использования — см. [LICENSE](./LICENSE).

## Стек

- **Next.js 16** — App Router, `output: 'export'` (статический экспорт)
- **React 19** · **TypeScript**
- **SCSS-модули**, архитектура **Feature-Sliced Design** (`app / widgets / features / entities / shared`)
- Деплой статики из `out/` на Apache-хостинг

## Возможности

- **9 страниц услуг** из единого источника данных (`entities/service`) — общий `ServicePage` + динамический прайс с табами, комплексами и абонементами
- **Интернет-магазин**: каталог по 8 брендам, карточки-серверные компоненты, корзина в `localStorage`, шаринг корзины ссылкой
- **Онлайн-оплата** (Т-эквайринг, redirect-flow) с пересчётом сумм на стороне сервера
- Заявки с форм и нотификации об оплате уходят в **Telegram**
- **SEO**: per-page metadata, JSON-LD (Organization / LocalBusiness / Service / Product), sitemap с динамическим `lastmod`, robots
- Адаптив, a11y, cookie-consent с отложенной загрузкой аналитики

## Запуск

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # статический экспорт в out/
```

Переменные окружения — скопируйте `.env.example` → `.env.local` (нужны только для dev-режима форм; в проде заявки идут через серверный эндпоинт).

## Структура

```
src/
├── app/        # роуты (App Router), sitemap/robots, стили и токены
├── widgets/    # Header, Footer, страницы (Pages/*), ServicePage, Shop/*
├── features/   # contact-form, cart, checkout
├── entities/   # service, product — данные + типы
└── shared/     # config, ui (Form/Modal/icons), lib (hooks/helpers), seo (JSON-LD)
```

Серверная часть (PHP-эндпоинты приёма заявок и платёжных вебхуков) лежит в `public/`. Токены и конфиги платёжной системы хранятся **вне репозитория** — в коде их нет.

## Лицензия

Proprietary — все права защищены. См. [LICENSE](./LICENSE).
