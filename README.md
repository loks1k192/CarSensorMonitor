# CarSensor Monitor

Система мониторинга объявлений с сайта [CarSensor.net](https://carsensor.net/) — автоматический сбор данных, REST API и веб-интерфейс для просмотра.

## Архитектура

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Next.js    │────>│   FastAPI     │────>│ PostgreSQL │
│  Frontend   │     │   Backend     │     │  Database   │
│  :3000      │     │   :8000       │     │  :5432      │
└─────────────┘     └──────┬───────┘     └────────────┘
                           │
                    ┌──────┴───────┐
                    │  Playwright  │
                    │  Scraper     │
                    │  (hourly)    │
                    └──────────────┘
```

### Стек технологий

| Компонент | Технологии |
|-----------|-----------|
| **Backend** | Python 3.11, FastAPI, SQLAlchemy (async), Pydantic, PyJWT |
| **Scraper** | Playwright (Chromium), BeautifulSoup, APScheduler |
| **Database** | PostgreSQL 16, Alembic (миграции) |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Lucide React |
| **Deploy** | Docker, Docker Compose |

## Быстрый старт

### Требования

- Docker и Docker Compose

### Запуск

```bash
# Клонировать и перейти в директорию
git clone <repo-url>
cd fullstack

# Скопировать конфигурацию
cp .env.example .env

# Запуск всех сервисов
docker-compose up --build
```

Приложение будет доступно:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs

### Вход

- **Логин**: `admin`
- **Пароль**: `admin123`

## API Endpoints

### Авторизация

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/login` | Авторизация, получение JWT токена |

### Автомобили (требуют JWT)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/cars` | Список с фильтрами, сортировкой и пагинацией |
| GET | `/api/cars/{id}` | Детальная информация с историей цен |
| GET | `/api/cars/makers` | Список всех марок |
| GET | `/api/cars/stats` | Статистика (всего авто, средняя цена, кол-во марок) |

### Параметры фильтрации `GET /api/cars`

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | int | Номер страницы (default: 1) |
| `per_page` | int | Элементов на странице (default: 20, max: 100) |
| `sort_by` | string | Поле сортировки: `created_at`, `total_price_yen`, `year`, `mileage_km` |
| `sort_order` | string | `asc` или `desc` |
| `maker` | string | Фильтр по марке |
| `year_min` / `year_max` | int | Диапазон годов |
| `price_min` / `price_max` | int | Диапазон цен (в иенах) |
| `mileage_max` | int | Максимальный пробег (км) |
| `transmission` | string | Тип КПП: `AT`, `MT`, `CVT` |
| `search` | string | Поиск по марке, модели, комплектации |

## Архитектурные решения

### Скрапер

- **Playwright** используется вместо простых HTTP-запросов для обхода возможного JS-рендеринга
- **APScheduler** запускает сбор данных каждый час (настраивается через `SCRAPE_INTERVAL_MINUTES`)
- Первый скрейп запускается автоматически при старте приложения
- Rate limiting: задержка 2-3 секунды между запросами страниц
- Retry-логика: до 3 попыток с экспоненциальной задержкой
- Ошибка на одной странице не прерывает весь процесс сбора

### Нормализация данных

Данные на CarSensor представлены на японском языке. Модуль `translator.py` содержит словари для перевода:
- Марки (トヨタ → Toyota)
- Типы кузова (セダン → Sedan)
- Цвета (白 → White)
- КПП (CVT, AT, MT)
- Виды топлива (ガソリン → Gasoline)

Неизвестные значения сохраняются в оригинале.

### База данных

- **Upsert-логика**: при повторном обнаружении авто обновляются данные, при изменении цены создаётся запись в `price_history`
- **is_active**: пометка неактивных объявлений (снятых с продажи)
- Цены хранятся в иенах (целое число), конвертация из формата «万円» (10,000 иен) происходит при парсинге

### Frontend

- Адаптивная верстка (mobile-first)
- Скелетоны при загрузке данных
- Клиентская авторизация через localStorage + автоматический redirect
- Zustand для управления состоянием фильтров
- Прямые API-запросы из браузера к бэкенду

## Структура проекта

```
fullstack/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic/              # Миграции БД
│   └── app/
│       ├── main.py           # FastAPI entry point
│       ├── api/              # Роуты (auth, cars)
│       ├── core/             # Config, DB, Security
│       ├── models/           # SQLAlchemy модели
│       ├── schemas/          # Pydantic схемы
│       ├── scraper/          # Playwright скрапер
│       │   ├── translator.py # JP→EN словарь
│       │   ├── parser.py     # HTML парсинг
│       │   ├── spider.py     # Навигация по страницам
│       │   └── worker.py     # APScheduler
│       └── services/         # Бизнес-логика
└── frontend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app/              # Next.js App Router
        │   ├── login/        # Страница входа
        │   ├── dashboard/    # Дашборд
        │   └── cars/         # Список и детали авто
        ├── components/       # UI компоненты
        └── lib/              # API клиент, типы, store
```

## Переменные окружения

| Переменная | Описание | Default |
|-----------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `SECRET_KEY` | JWT secret key | - |
| `JWT_ALGORITHM` | Алгоритм подписи | HS256 |
| `JWT_EXPIRE_MINUTES` | Время жизни токена | 1440 |
| `SCRAPE_INTERVAL_MINUTES` | Интервал скрапинга | 60 |
| `SCRAPE_MAX_PAGES_PER_MAKER` | Макс. страниц на марку | 3 |
| `NEXT_PUBLIC_API_URL` | URL бэкенда для фронта | http://localhost:8000 |

## Деплой (бесплатно)

### 1. База данных — Neon.tech

1. Зарегистрироваться на [neon.tech](https://neon.tech)
2. Создать проект → скопировать `DATABASE_URL` (формат `postgresql://user:pass@host/db?sslmode=require`)

### 2. Backend — Render.com

1. Зарегистрироваться на [render.com](https://render.com)
2. New → Web Service → подключить GitHub-репозиторий
3. Настройки:
   - **Root Directory**: `backend`
   - **Runtime**: Docker
   - **Plan**: Free
4. Environment Variables:
   - `DATABASE_URL` = строка из Neon
   - `SECRET_KEY` = сгенерировать длинный ключ
   - `JWT_ALGORITHM` = `HS256`
   - `JWT_EXPIRE_MINUTES` = `1440`
   - `SCRAPE_INTERVAL_MINUTES` = `60`
   - `SCRAPE_MAX_PAGES_PER_MAKER` = `3`

### 3. Frontend — Vercel

1. Зарегистрироваться на [vercel.com](https://vercel.com)
2. Import Project → подключить GitHub-репозиторий
3. Настройки:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = URL бэкенда с Render (например `https://carsensor-backend.onrender.com`)
