# 🩺 Electronic Medical Cards (EMC) System

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb)

A modern, full-stack Web Application for managing Electronic Medical Records.
Provides separate workspaces for **Patients**, **Doctors**, and **Administrators** to streamline healthcare interactions, from booking appointments to reviewing diagnostic files.

## ✨ Features

### 👤 For Patients
- **Profile Management**: Update personal info and upload an Avatar (Cloudinary integrated).
- **Online Booking**: View available doctors, check their free slots, and book an appointment fast.
- **Medical History**: View past appointments, track statuses, and download attached Lab Results securely.

### 👨‍⚕️ For Doctors
- **Schedule Management**: Create and manage customizable time slots for patients to book.
- **Reception Workspace**: View patient records, assign statuses (Scheduled, Completed, Cancelled).
- **Diagnostics**: Upload scan results, protocols, and conclusion files.

### 🛡️ For Administrators
- **Staff Management**: Create certified Doctor profiles dynamically.
- **Global Settings**: Enforce Email Authentication / account verification for new patients.
- **System Oversight**: Oversee and manage all appointments in the system safely.

### 🌐 Global / UI
- **i18n Translation**: Seamless language switching (English & Russian).
- **Beautiful UI/UX**: Sleek Medical Theme built with pure CSS, custom loaders, Recharts graphs, Lucide icons, and highly optimized 60fps native CSS micro-animations.
- **Bulletproof Security**: JWT tokens stored entirely in `HttpOnly` cookies strictly mitigating XSS attacks.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) Cluster or local instance
- [Cloudinary](https://cloudinary.com/) Account (for file uploads)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repo-url>
   cd emc
   ```
2. Install dependencies (covers both frontend and backend):
   ```bash
   npm install && cd src && npm install && cd ..
   ```
3. Set up your **Backend Environment Variables**:
   Create `src/backend/.env` with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=super_secret_jwt_key
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=http://localhost:5173
   
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Configure test data:
   Run `node dummy-data.js` to seed the database with test doctors, patients, and previous appointments.

### Running the App Locally
- **Backend**: `npm start` in `src/backend` (runs on standard port 3000)
- **Frontend**: `npm run dev` in `src` (runs Vite on 5173)

---

## 🛤️ Deployment Guide

This project is perfectly optimized for a **Full-Stack Monolithic Deployment entirely on Render.com**. The configured Express server automatically serves the compiled static Vite frontend!

### Deploying to Render
1. Push your code to GitHub.
2. In Render, create a new **Web Service**.
3. Connect your repository.
4. **Environment**: `Node`
5. **Build Command**: `npm install && cd src && npm install && npm run build`
6. **Start Command**: `npm start`
7. **Environment Variables**: Add all `.env` keys from your `src/backend/.env`. (Note: You can leave `FRONTEND_URL` empty or point it to your Render domain, as the backend directly serves the frontend).

Once spawned, the entire platform (Front + Back) runs robustly behind a singular Render URL without CORS bridging issues.

---

## 🛠️ Tech Stack & Architecture
- **Frontend Engine**: Vite + React 19
- **Routing**: React Router DOM (v6)
- **Visuals**: Recharts (Graphs), Lucide-React (Icons), Pure Vanilla CSS (State-of-the-Art CSS animations bypassing JS bottlenecks)
- **Backend Engine**: Express.js 5
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT token traversing inside strict `HttpOnly` Cookies.
- **Storage**: Multi-part upload stream piped directly to `Cloudinary` preventing local persistent storage bottlenecks on serverless deployment.

---
---

# 🩺 Система Электронных Медицинских Карт (EMC)

Современное Full-Stack веб-приложение для управления электронными медицинскими записями.
Предоставляет отдельные рабочие пространства для **Пациентов**, **Врачей** и **Администраторов** для оптимизации взаимодействия в сфере здравоохранения: от записи на прием до просмотра диагностических файлов.

## ✨ Функционал

### 👤 Для Пациентов
- **Управление профилем**: Обновление личной информации и загрузка аватара (интеграция с Cloudinary).
- **Онлайн-запись**: Просмотр доступных врачей, проверка их свободных слотов и быстрая запись на прием.
- **История болезни**: Просмотр прошлых приемов, отслеживание статусов и безопасное скачивание прикрепленных результатов анализов.

### 👨‍⚕️ Для Врачей
- **Управление расписанием**: Создание и управление настраиваемыми временными слотами для записи пациентов.
- **Рабочее место врача**: Просмотр записей пациентов, назначение статусов (Запланирован, Завершен, Отменен).
- **Диагностика**: Загрузка результатов сканирования, протоколов и заключений.

### 🛡️ Для Администраторов
- **Управление персоналом**: Динамическое создание сертифицированных профилей Врачей.
- **Глобальные настройки**: Обязательная email-аутентификация / верификация аккаунтов для новых пациентов.
- **Системный контроль**: Безопасный контроль и управление всеми приемами в системе.

### 🌐 Глобально / UI
- **i18n Локализация**: Бесшовное переключение языков (Английский и Русский).
- **Красивый UI/UX**: Стильная медицинская тема, созданная на чистом CSS, кастомные загрузчики, графики Recharts, иконки Lucide и высокооптимизированные нативные CSS микро-анимации на 60fps.
- **Надежная безопасность**: JWT токены хранятся исключительно в `HttpOnly` файлах cookie, что строго предотвращает XSS атаки.

---

## 🚀 Быстрый старт (Локальная установка)

### Требования
- [Node.js](https://nodejs.org/) (v16+)
- Кластер [MongoDB Atlas](https://www.mongodb.com/atlas) или локальный инстанс
- Аккаунт [Cloudinary](https://cloudinary.com/) (для загрузки файлов)

### Установка
1. Склонируйте репозиторий и перейдите в папку проекта:
   ```bash
   git clone <repo-url>
   cd emc
   ```
2. Установите зависимости (сразу для фронтенда и бэкенда):
   ```bash
   npm install && cd src && npm install && cd ..
   ```
3. Настройте **Переменные окружения Бэкенда**:
   Создайте файл `src/backend/.env` со следующими переменными:
   ```env
   PORT=3000
   MONGODB_URI=ваша_строка_подключения_mongodb
   JWT_SECRET=секретный_ключ_jwt
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=пароль_приложения_вашего_gmail
   FRONTEND_URL=http://localhost:5173
   
   CLOUDINARY_CLOUD_NAME=имя_вашего_облака
   CLOUDINARY_API_KEY=ваш_api_ключ
   CLOUDINARY_API_SECRET=ваш_api_секрет
   ```
4. Настройте тестовые данные:
   Выполните `node dummy-data.js` для заполнения базы данных тестовыми врачами, пациентами и прошлыми приемами.

### Запуск приложения локально
- **Бэкенд**: `npm start` в папке `src/backend` (запускается на стандартном порту 3000)
- **Фронтенд**: `npm run dev` в папке `src` (Vite запускается на порту 5173)

---

## 🛤️ Руководство по Деплою

Этот проект идеально оптимизирован для **Full-Stack монолитного деплоя полностью на Render.com**. Настроенный сервер Express автоматически раздает скомпилированный статический фронтенд Vite!

### Деплой на Render
1. Запушьте ваш код на GitHub.
2. На Render создайте новый **Web Service**.
3. Подключите ваш репозиторий.
4. **Environment**: `Node`
5. **Build Command**: `npm install && cd src && npm install && npm run build`
6. **Start Command**: `npm start`
7. **Environment Variables**: Добавьте все ключи из вашего `src/backend/.env`. (Примечание: вы можете оставить `FRONTEND_URL` пустым или указать ваш домен Render, так как бэкенд напрямую раздает фронтенд).

После запуска вся платформа (Фронт + Бэк) будет стабильно работать под единым URL-адресом Render без проблем с маршрутизацией CORS.

---

## 🛠️ Стек Технологий и Архитектура
- **Фронтенд Движок**: Vite + React 19
- **Роутинг**: React Router DOM (v6)
- **Визуал**: Recharts (Графики), Lucide-React (Иконки), Чистый Vanilla CSS (Современные CSS анимации в обход багов JS-движков)
- **Бэкенд Движок**: Express.js 5
- **База Данных**: MongoDB (Mongoose ORM)
- **Аутентификация**: JWT токен, передающийся внутри строгих `HttpOnly` Cookies.
- **Хранилище**: Multi-part upload stream, напрямую перенаправляющий файлы в `Cloudinary`, предотвращая ошибки локального хранилища при бессерверном деплое.
