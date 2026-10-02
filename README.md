# Info Map — SPA для управления организациями

SPA-приложение для просмотра и управления справочником **Организаций**,
**Зданий** и **Видов деятельности**, работающее с REST API на FastAPI.

Проект выполнен в рамках тестового задания на позицию Frontend Developer
(middle/senior). Стек: Next.js 16 (App Router), TypeScript, FSD,
TanStack Query, Zustand, React Hook Form + Zod, shadcn/ui, Tailwind CSS.

---

## Быстрый старт

Если у вас уже поднят бэкенд **с инициализированной БД**, фронт
запускается тремя командами:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Открыть: **http://localhost:3000**

Если бэкенд ещё не готов — см. раздел
[«Разворот проекта с нуля»](#разворот-проекта-с-нуля) ниже.

---

## Стек технологий

| Категория | Технология |
|---|---|
| Фреймворк | **Next.js 16** (App Router, Turbopack) |
| Язык | **TypeScript** (strict mode) |
| Архитектура | **Feature-Sliced Design (FSD)** |
| Серверное состояние | **TanStack Query v5** |
| Клиентское состояние | **Zustand** |
| Формы и валидация | **React Hook Form** + **Zod** |
| UI-компоненты | **shadcn/ui** (Base UI primitives) |
| Стилизация | **Tailwind CSS v4** |
| HTTP-клиент | **Axios** |
| Иконки | **Lucide React** |
| Уведомления | **Sonner** |
| Карта | **react-leaflet** + OpenStreetMap |
| Контейнеризация | **Docker** + **Docker Compose** |

---

## Архитектура

Проект следует методологии **Feature-Sliced Design**.

Слои расположены от наиболее абстрактного к наиболее конкретному:

```
app → views → widgets → features → entities → shared
```

### Особенность интеграции с Next.js

Next.js требует, чтобы директория `app/` с роутингом находилась в корне
проекта. Чтобы не нарушать FSD (где `pages` — это отдельный слой),
маршруты в `app/` оставлены **тонкими** — они только импортируют
страницы из слоя `views`. Вся логика живёт в `src/`.

### Структура проекта

```
.
├── app/                              # Next.js App Router (только маршрутизация)
│   ├── api/backend/[...path]/
│   │   └── route.ts                  # Server-side прокси до FastAPI
│   ├── layout.tsx                    # Корневой layout с провайдерами
│   ├── page.tsx                      # → OrganizationListPage
│   ├── organizations/
│   │   ├── [id]/
│   │   │   ├── page.tsx              # → OrganizationDetailPage
│   │   │   └── edit/page.tsx         # → OrganizationFormPage (edit)
│   │   └── create/page.tsx           # → OrganizationFormPage (create)
│   ├── map/page.tsx                  # → MapPage
│   └── globals.css
│
├── src/
│   ├── app/
│   │   └── providers/                # Глобальные провайдеры
│   │       ├── index.tsx
│   │       └── query-provider.tsx
│   │
│   ├── views/                        # Страницы
│   │   ├── organization-list/
│   │   ├── organization-detail/
│   │   ├── organization-form/
│   │   └── map/
│   │
│   ├── widgets/                      # Композитные блоки
│   │   ├── organization-table/
│   │   └── organization-filters/
│   │
│   ├── features/                     # Пользовательские сценарии
│   │   ├── activity-select/
│   │   ├── organization-filter/
│   │   └── organization-form/
│   │
│   ├── entities/                     # Бизнес-сущности
│   │   ├── organization/
│   │   ├── building/
│   │   └── activity/
│   │
│   └── shared/                       # Переиспользуемый код
│       ├── api/                      # axios client, endpoints
│       ├── ui/                       # shadcn/ui компоненты
│       ├── lib/                      # утилиты, стор, tree
│       └── config/                   # мок-данные
│
├── public/                           # Статика (favicon, .gitkeep)
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

### Правила импортов FSD

- Слои импортируют только из **нижележащих** слоёв.
- Между слайсами одного слоя — только через **public API** (`index.ts`).
- Кросс-импорты внутри одного слайса запрещены.

---

## Требования

- **Node.js** ≥ 20.0
- **npm** ≥ 10.0
- **Docker** ≥ 24.0 (для бэкенда и опционально для фронта)
- **Docker Compose** ≥ 2.0

---

## Разворот проекта с нуля

Проект состоит из **двух частей**: фронтенд (этот репозиторий) и бэкенд
(FastAPI + PostgreSQL, отдельный репозиторий). Фронт без бэкенда не
заработает — сначала поднимаем бэкенд, потом фронт.

### Шаг 1 — Клонирование репозиториев

```bash
# Бэкенд
git clone https://github.com/VaDKo61/17.-info_map
cd 17.-info_map

# Фронтенд (в соседней директории)
cd ..
git clone <URL_РЕПОЗИТОРИЯ_ФРОНТА>
cd info-map-frontend
```

Ожидаемая структура директорий:

```
<ваша_рабочая_папка>/
├── 17.-info_map/          # бэкенд
└── info-map-frontend/     # фронтенд
```

### Шаг 2 — Запуск бэкенда

```bash
cd 17.-info_map
docker-compose up --build -d
```

Дождитесь, пока оба контейнера будут в статусе `Up`:

```bash
docker ps
# info_map_backend   ...   Up   ...   0.0.0.0:8000->8000/tcp
# info_map_db        ...   Up   ...   0.0.0.0:5432->5432/tcp
```

Swagger бэкенда: http://localhost:8000/docs

### Шаг 3 — Инициализация базы данных ⚠️

**Обязательный шаг.** После первого запуска бэкенда таблицы ещё
не созданы, а БД пуста. Выполните **один раз** из корня репозитория
бэкенда:

```bash
docker exec -it info_map_backend alembic upgrade head
docker exec -it info_map_backend python seed.py
```

Что делает каждая команда:

- `alembic upgrade head` — создаёт таблицы `buildings`, `organizations`,
  `activities` и связующие.
- `python seed.py` — заполняет БД тестовыми данными: 3 здания,
  3 организации, 8 видов деятельности.

**Проверьте, что всё прошло успешно:**

```bash
docker exec -it info_map_db psql -U postgres -d info_map -c "SELECT COUNT(*) FROM buildings;"
# Ожидаемый результат: count = 3
```

Возможные проблемы:

| Симптом | Причина | Решение |
|---|---|---|
| `ERROR: relation "buildings" does not exist` | Миграции не применились | Выполните `alembic upgrade head` ещё раз |
| `count = 0` | Сиды не запустились | Выполните `python seed.py` ещё раз |
| `docker: Error response from daemon` | Контейнер `info_map_backend` не запущен | Подождите 10–20 секунд, проверьте `docker ps`, затем повторите |

> 💡 **Данные сохраняются в Docker volume `pgdata`.** При обычном
> перезапуске (`docker-compose down && docker-compose up`) повторять
> инициализацию **не нужно**.
>
> Данные теряются только при удалении volume — например, через
> `docker-compose down -v` или Docker Desktop → «Delete» контейнера
> вместо «Stop». В этом случае повторите шаг 3.

### Шаг 4 — Настройка фронтенда

Вернитесь в директорию фронта и создайте `.env.local`:

```bash
cd ../info-map-frontend
cp .env.example .env.local
```

Содержимое `.env.example`:

```env
# Адрес бэкенда (используется server-side прокси в app/api/backend/[...path]/route.ts)
BACKEND_URL=http://localhost:8000

# API-ключ бэкенда (из app/.env_template бэкенда)
API_KEY=1
```

- `BACKEND_URL` — адрес бэкенда.
- `API_KEY` — API-ключ (дефолт `1`, указан в
  `app/.env_template` бэкенда).

> ⚠️ Переменные **без префикса `NEXT_PUBLIC_`** — они читаются только
> на сервере (в route handler). В клиентский бандл они не попадают,
> что защищает API-ключ от утечки в браузер.

### Шаг 5 — Установка зависимостей и запуск

```bash
npm install
npm run dev
```

Фронт доступен на **http://localhost:3000**.

Если всё сделано правильно, на главной странице появится список
организаций, загруженный с бэкенда.

---

## Запуск фронта через Docker

Если не хочется ставить Node.js — можно запустить фронт в контейнере.

### Требования

- **Docker** ≥ 24.0
- **Docker Compose** ≥ 2.0
- Запущенный бэкенд (см. раздел [«Разворот проекта с нуля»](#разворот-проекта-с-нуля))

### Запуск

```bash
docker compose up --build
```

Фронт: **http://localhost:3000**

### Как это работает

Фронт в контейнере обращается к бэкенду через `host.docker.internal:8000`.
Это специальный DNS-хост Docker, который резолвится в IP хостовой машины,
где запущен бэкенд.

- **Windows и macOS** — работает из коробки.
- **Linux** — нужен `extra_hosts` в `docker-compose.yml`. Он **уже
  включён** в репозитории, так что дополнительных действий не требуется.

### Переменные окружения

В `docker-compose.yml` для сервиса `frontend` заданы:

| Переменная | Значение | Назначение |
|---|---|---|
| `BACKEND_URL` | `http://host.docker.internal:8000` | Адрес бэкенда для server-side прокси |
| `API_KEY` | `1` | API-ключ бэкенда |

Обе переменные читаются **в рантайме** (не вшиваются в бандл), поэтому
их можно менять без пересборки образа:

```bash
# отредактируйте docker-compose.yml, затем
docker compose up -d
```

### Остановка

```bash
docker compose down
```

### Если что-то не работает

**Фронт не видит бэкенд** — проверь логи:

```bash
docker logs info_map_frontend
```

Если видишь `ECONNREFUSED host.docker.internal:8000`:

1. Убедись, что бэкенд запущен и слушает порт 8000: `docker ps`.
2. Убедись, что в `.env` бэкенда разрешены запросы с сервера
   (по умолчанию FastAPI принимает любые запросы на этом порту).
3. На Linux проверь, что `extra_hosts` активен в `docker-compose.yml`.

**Ошибка `COPY /app/public ./public`** — значит, папка `public/` не
попала в git (git не хранит пустые директории). Добавь файл-заглушку:

```bash
touch public/.gitkeep
git add public/.gitkeep
```

---

## Переменные окружения

| Переменная | Где читается | Значение по умолчанию | Назначение |
|---|---|---|---|
| `BACKEND_URL` | server (route handler) | `http://localhost:8000` | Адрес бэкенда |
| `API_KEY` | server (route handler) | `1` | API-ключ бэкенда |

Обе переменные используются только на сервере Next.js, в клиентский
бандл они не попадают. Это осознанное решение: API-ключ не должен
быть доступен из JavaScript браузера.

---

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Dev-сервер на `localhost:3000` (Turbopack) |
| `npm run build` | Production-сборка (`output: standalone`) |
| `npm run start` | Запуск production-сборки |
| `npm run lint` | ESLint (flat config, Next.js 16) |
| `npm run typecheck` | Проверка типов (`tsc --noEmit`) |
| `npm run format` | Prettier — форматирует код |

---

## Реализованный функционал

### Главная страница (`/`)

- [x] Список всех организаций с **пагинацией**
- [x] **Поиск** по названию
- [x] **Фильтр по зданию**
- [x] **Фильтр по виду деятельности** (дерево)
- [x] Переход на страницу организации по клику
- [x] Кнопка «Создать организацию»
- [x] Кнопка «Сбросить демо-данные»

### Страница организации (`/organizations/[id]`)

- [x] Полная информация об организации
- [x] Список телефонов
- [x] Адрес здания + координаты
- [x] Список видов деятельности
- [x] Кнопка «Редактировать»

### Форма создания / редактирования

- [x] Поле «Название»
- [x] **Динамические поля телефонов** (`useFieldArray`)
- [x] Select здания
- [x] Multiselect видов деятельности (дерево)
- [x] **Валидация через Zod**
- [x] Возврат на список после сохранения

### Дерево видов деятельности

- [x] Разворачивание/сворачивание узлов
- [x] Выбор до 3 уровней вложенности
- [x] Используется в фильтре (single) и в форме (multiple)

### Карта (`/map`)

- [x] Отображение зданий на OpenStreetMap
- [x] Popup с адресом и списком организаций
- [x] Динамический импорт с `ssr: false`

---

## Работа с неполным бэкендом

Бэкенд предоставляет только часть эндпоинтов, необходимых для полной
реализации ТЗ. Чтобы продемонстрировать весь функционал, применён
**гибридный подход**: реальные данные + мок-слой поверх.

| Функция | Источник |
|---|---|
| Список организаций | Реальный API + мок-организации |
| Детали организации | Реальный API + override |
| Поиск по названию | Клиентская фильтрация |
| Фильтр по зданию | Клиентская фильтрация |
| Фильтр по виду деятельности | Мок-дерево |
| Создание организации | Мок (localStorage) |
| Редактирование организации | Мок-override (localStorage) |
| Дерево видов деятельности | Статический мок `MOCK_ACTIVITIES` |
| Список зданий | Реальный API `GET /buildings/search_area` |
| Карта | Реальный API + Leaflet |

Мок-данные хранятся в `localStorage` под ключом `info-map:mock-db:v1`.
Кнопка **«Сбросить демо-данные»** в футере списка их очищает.

### Чего не хватает на бэкенде

1. `GET /activities` — плоский список видов деятельности с `parent_id`.
2. `POST /organizations` и `PATCH /organizations/{id}` — создание и обновление.
3. `parent_id` в схеме `ActivityRead`.
4. `building_id` в схеме `OrganizationRead`.

Когда эти эндпоинты появятся, достаточно заменить реализацию в:

- `src/entities/organization/api/organization.api.ts` — методы `create`, `update`;
- `src/entities/activity/api/queries.ts` — вернуть реальный запрос.

Остальная часть приложения (UI, формы, фильтры, роутинг) не потребует
изменений.

### Баг в сид-данных бэкенда

В `app/seed.py` бэкенда координаты зданий не соответствуют адресам:

| Адрес | Широта | Долгота | Фактически |
|---|---|---|---|
| ул. Блюхера, 32/1 | 55.7522 | 37.6156 | Москва |
| г. Ростов-на-Дону, ул. Ленина 1 | 55.76 | 37.62 | Москва |
| г. Ростов-на-Дону, ул. Текучева 15 | 75.76 | 57.62 | Северный Ледовитый океан |

Из-за этого запрос
`GET /buildings/search_area?lat=47.2357&lng=39.7015&radius=100`
(центр Ростова) возвращает `404`.

Фронт обходит это: запрашивает `/buildings/search_area` **без
параметров**, получает все здания. Когда сиды починят — можно
включить фильтр по радиусу в `src/entities/building/api/building.api.ts`.

---

## Используемые эндпоинты бэкенда

### Организации

| Метод | Путь | Назначение |
|---|---|---|
| `GET` | `/api/v1/organizations/?skip=&limit=` | Постраничный список |
| `GET` | `/api/v1/organizations/{id}` | Детали со зданием |
| `GET` | `/api/v1/organizations/search?name=` | Поиск по названию |
| `GET` | `/api/v1/organizations/by-building/{id}` | Организации в здании |
| `GET` | `/api/v1/organizations/by-activity/{id}` | По activity |
| `GET` | `/api/v1/organizations/by-activity/search?name=` | Поиск по activity |

### Здания

| Метод | Путь | Назначение |
|---|---|---|
| `GET` | `/api/v1/buildings/search_area` | Здания и организации в области |

Все запросы идут через прокси `/api/backend/api/v1/...`, который
добавляет заголовок `X-API-Key`.

---

## Ключевые архитектурные решения

### 1. Разделение серверного и клиентского состояния

- **TanStack Query** — данные с бэкенда: кэш, ревалидация, инвалидация.
- **Zustand** — UI-состояние: активные фильтры, номер страницы.

Это исключает дублирование источника правды: серверные данные не живут
в Zustand, клиентские — не уходят в кэш Query.

### 2. Пагинация без мерцания

В `useOrganizations` используется `placeholderData: (prev) => prev` —
при переходе между страницами таблица не «прыгает» в skeleton, старые
данные остаются видимыми до загрузки новых.

### 3. Server-side прокси через route handler

`app/api/backend/[...path]/route.ts` — полноценный прокси: принимает
запрос от браузера, добавляет заголовок `X-API-Key`, форвардит на
FastAPI. Решает три проблемы:

1. **CORS** — для браузера все запросы гомогенные (один origin).
2. **Preflight** — нет кастомных заголовков у браузера, значит нет
   OPTIONS-запроса.
3. **Безопасность** — API-ключ не светится в клиентском JavaScript.

### 4. Переменные окружения без `NEXT_PUBLIC_`

`BACKEND_URL` и `API_KEY` читаются только на сервере (в route handler).
Это позволяет:

- переопределять их в Docker без пересборки образа;
- не утекать API-ключу в бандл браузера.

### 5. Zod-схема с `refine`

Валидация телефонов происходит на уровне схемы через `refine` (не
`transform`), чтобы не сломать типы `useFieldArray` в React Hook Form.

### 6. FSD + Next.js App Router

`app/` содержит только роутинг. Всё, что можно протестировать в
изоляции от Next, находится в `src/`. Это позволяет юнит-тестировать
views/widgets/features без поднятия Next и переиспользовать компоненты.

### 7. Динамический импорт Leaflet

`react-leaflet` обращается к `window` при инициализации, что ломает
SSR. Компонент карты загружается через `next/dynamic` с `ssr: false`.

### 8. Multi-stage Docker build

`Dockerfile` использует три стадии (`deps` → `builder` → `runner`).
Финальный образ содержит только standalone-сборку Next.js (~150 МБ),
без исходников и dev-зависимостей. Приложение запускается от
непривилегированного пользователя `nextjs` (uid 1001).

### 9. Оптимизация запросов

- Дерево активностей имеет `staleTime: Infinity` — мок-данные не
  меняются.
- Список организаций — `staleTime: 60_000`, чтобы не дёргать бэкенд
  при каждом возврате на страницу.
- `refetchOnWindowFocus: false` — отключено глобально.

---

## Roadmap

- [ ] Покрытие unit-тестами (`tree.ts`, формы) — Vitest + Testing Library
- [ ] E2E-тесты — Playwright
- [ ] Оптимистичные обновления при редактировании
- [ ] Виртуализация таблицы (`@tanstack/react-virtual`)
- [ ] Синхронизация фильтров с URL query-параметрами (shareable links)
- [ ] CI/CD — GitHub Actions (lint → typecheck → build → docker)

---