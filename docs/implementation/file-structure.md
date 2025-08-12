# 📁 File Structure Overview

## Root
FUTURA_SOLUTIONS_GovLink/
├── docker-compose.yml
├── .env
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── user_mobile/ # Citizen app
├── user_web/ # Admin panel
├── user_backend/ # API
├── database/ # Migrations
├── shared/ # Shared types
└── docs/ # This documentation


## Mobile App (`user_mobile/`)
- **Navigation**: React Navigation
- **State**: Redux Toolkit
- **Auth**: JWT + OTP
- **Tracking**: QR code display
- **Languages**: Sinhala, Tamil, English

## Web Admin (`user_web/`)
- **UI**: React + Tailwind CSS
- **Charts**: Chart.js
- **Tables**: Filterable, sortable
- **Real-time**: WebSocket

## Backend (`user_backend/`)
- **APIs**: REST + WebSocket
- **Auth**: JWT middleware
- **DB**: PostgreSQL + Redis
- **Security**: Rate limiting, input validation