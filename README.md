# ProjectTS — Backend

Федоров А.Д.

## Запуск проекта

Запустить базу данных (PostgreSQL в Docker):  
`docker run --name project-ts-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres`

Установить зависимости:  
`npm install`

Запустить сервер:  
`npm run dev`

После запуска приложение доступно по адресу: http://localhost:3000

## Переменные окружения (.env)

Переименовать `.env.example` в `.env` (либо копию с таким названием)

## Основные эндпоинты

**Авторизация:**
- `POST /api/auth/register` — Регистрация
- `POST /api/auth/confirm` — Подтверждение почты (код `000000`)
- `POST /api/auth/login` — Вход (выдаёт JWT)

**Профиль (требуется JWT-токен):**
- `GET /api/profile` — Получение данных
- `PATCH /api/profile` — Обновление данных
- `POST /api/profile/change-password` — Смена пароля