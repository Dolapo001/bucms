# BUCMS — Bowen University Chapel Management System

> A full-stack institutional platform for managing chapel operations at Bowen University — built with Django REST Framework and Next.js 14.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [User Roles](#user-roles)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

BUCMS is a modular, production-ready chapel management system designed for Bowen University. It provides a secure, role-based platform for chapel administrators to manage sermons, announcements, programs, and member registrations — and for students (members) to access chapel content, upcoming events, and spiritual notices.

---

## Features

### For Members
- 🔐 Email-based authentication with JWT (access + refresh tokens)
- 📢 Browse published chapel announcements
- 🎵 Access sermon audio recordings and documents
- 📅 View upcoming chapel programs and events
- 🔔 Receive in-app notifications
- 👤 Manage personal profile and password

### For Admins
- 📊 Analytics dashboard (user counts, sermon metrics, event stats, recent activity)
- 👥 Full user management (view, activate/deactivate members)
- 📣 Create, pin, and publish announcements
- 🎤 Upload and manage sermon audio, documents, and video links
- 🗓️ Create and manage chapel program/event calendar
- 🔔 Broadcast notifications to all members

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Django 4.2, Django REST Framework, SimpleJWT |
| **Database** | PostgreSQL (SQLite fallback for tests) |
| **API Docs** | drf-spectacular (Swagger UI + ReDoc) |
| **Media Storage** | Cloudinary (optional) / local filesystem |
| **Frontend** | Next.js 14 (App Router), TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Validation** | Zod |
| **Production Server** | Gunicorn + WhiteNoise |

---

## Project Structure

```
bucms/
├── backend/                        # Django monolithic backend
│   ├── apps/
│   │   ├── analytics/              # Dashboard stats & activity feed
│   │   ├── announcements/          # Chapel announcements CRUD
│   │   ├── authentication/         # Login, register, token refresh
│   │   ├── common/                 # Base models, shared utilities, seed command
│   │   ├── notifications/          # In-app notification system
│   │   ├── programs/               # Chapel events & program calendar
│   │   ├── sermons/                # Sermon audio, documents & metadata
│   │   └── users/                  # Custom user model & profile management
│   ├── config/
│   │   ├── settings.py             # Django settings (env-driven)
│   │   ├── urls.py                 # Root URL config (versioned API)
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── manage.py
│   ├── requirements.txt
│   └── Procfile                    # Render/Heroku deploy config
│
└── frontend/                       # Next.js 14 frontend
    ├── app/
    │   ├── (auth)/                 # Login, register, password reset pages
    │   ├── (public)/               # Landing, sermons, events, announcements
    │   ├── dashboard/              # Member dashboard (protected)
    │   └── admin/                  # Admin console (protected, admin-only)
    ├── components/
    │   ├── ui/                     # Design system components (Button, Card, Modal, etc.)
    │   ├── layout/                 # Header, Footer
    │   └── dashboard/              # Shared dashboard layout
    ├── services/                   # Axios API service modules
    ├── store/                      # React Context (auth, theme)
    ├── types/                      # TypeScript type definitions
    └── styles/                     # Global CSS
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ (running locally)
- A Cloudinary account (optional, for media uploads)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your local environment file
cp .env.example .env              # or create .env manually (see below)

# 5. Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE bucms_db;"
psql -U postgres -c "CREATE USER bucms_user WITH PASSWORD 'bucms_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE bucms_db TO bucms_user;"

# 6. Run migrations
python manage.py migrate

# 7. (Optional) Seed sample data
python manage.py seed_data

# 8. Create a superuser (admin account)
python manage.py createsuperuser

# 9. Start the development server
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create your local environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 4. Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

> ⚠️ Never commit this file. It is listed in `.gitignore`.

```env
# Core Django
SECRET_KEY=your-50-char-random-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgres://bucms_user:bucms_password@localhost:5432/bucms_db

# JWT
JWT_SECRET_KEY=your-64-char-random-jwt-key
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Cloudinary (optional — leave blank to use local media storage)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# CORS (production only)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (`frontend/.env.local`)

> ⚠️ Never commit this file. It is listed in `.gitignore`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## API Reference

The backend exposes a fully documented REST API under `/api/v1/`.

| Module | Base Endpoint |
|---|---|
| Authentication | `/api/v1/auth/` |
| Users & Profiles | `/api/v1/users/` |
| Announcements | `/api/v1/announcements/` |
| Programs / Events | `/api/v1/programs/` |
| Sermons | `/api/v1/sermons/` |
| Notifications | `/api/v1/notifications/` |
| Analytics | `/api/v1/analytics/` |
| Common Utilities | `/api/v1/common/` |

### Interactive Documentation

Once the backend is running:

| Tool | URL |
|---|---|
| **Swagger UI** | `http://localhost:8000/api/docs/swagger/` |
| **ReDoc** | `http://localhost:8000/api/docs/redoc/` |
| **Django Admin** | `http://localhost:8000/admin/` |

### Authentication Flow

```
POST /api/v1/auth/register/   → Create account (returns tokens)
POST /api/v1/auth/login/      → Login (returns access + refresh tokens)
POST /api/v1/auth/token/refresh/ → Refresh access token
POST /api/v1/auth/logout/     → Blacklist refresh token
```

All protected endpoints require the header:
```
Authorization: Bearer <access_token>
```

---

## User Roles

| Role | Access |
|---|---|
| `MEMBER` | Public pages, personal dashboard, own profile, sermon library, events, announcements |
| `ADMIN` | Everything above + admin console, user management, content creation, analytics |

Roles are set at registration and can be updated by an admin via the Django admin panel or the user management API.

---

## Deployment

The recommended production stack is:

| Service | Provider | Free Tier |
|---|---|---|
| Django Backend | [Render](https://render.com) | ✅ |
| PostgreSQL Database | Render Managed Postgres | ✅ (90 days) |
| Next.js Frontend | [Vercel](https://vercel.com) | ✅ |
| Media / Audio Storage | [Cloudinary](https://cloudinary.com) | ✅ (25 GB) |

For a step-by-step guide, see [BUCMS Deployment Guide](./DEPLOYMENT.md).

### Quick Deploy Checklist

- [ ] Set `DEBUG=False` in production env
- [ ] Generate strong `SECRET_KEY` and `JWT_SECRET_KEY`
- [ ] Set `ALLOWED_HOSTS` to your Render domain
- [ ] Set `CORS_ALLOWED_ORIGINS` to your Vercel domain
- [ ] Configure Cloudinary credentials for media uploads
- [ ] Add `whitenoise` for static file serving
- [ ] Create a `Procfile` with `gunicorn` start command
- [ ] Set `NEXT_PUBLIC_API_URL` to your Render backend URL on Vercel

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feat/your-feature-name`
5. Open a pull request against `main`

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

<p align="center">Built for Bowen University Chapel — Iwo, Osun State, Nigeria</p>
