# AdDoctor

AdDoctor is an AI-powered Meta Ads diagnosis system that helps business owners understand why their ad performance changed and gives actionable insights.

## Tech Stack
- **Backend:** Laravel 12 (REST API)
- **Frontend:** React (powered by Vite)
- **Database:** MySQL
- **Authentication:** Laravel Sanctum

## Architecture Overview
This repository uses a monorepo approach for easier management:

```text
AdDoctor/
├── backend/    # Laravel API (Stateless REST API)
└── frontend/   # React Single Page Application (Vite)
```

### Backend Structure
The API is designed to be scalable with distinct folders handling specific responsibilities:
- `app/Http/Controllers/Api/V1`: Versioned API endpoints
- `app/Services`: External API Integrations (Meta, Google Ads, Shopify) and AI Modules
- `app/Jobs`: Async background processing (e.g., syncing ad data)
- `app/Actions`: Reusable business logic classes
- `app/Models`: Eloquent ORM representations

### Frontend Structure
The frontend is cleanly structured for ease of component and service management:
- `src/components`: Reusable UI components
- `src/pages`: Distinct isolated route pages
- `src/services`: API abstraction layers (Axios/fetch wrappers)
- `src/hooks`: Custom React hooks (e.g., `useAuth`, `useAdMetrics`)
- `src/utils`: Helper functions

## Database Schema Highlights
The scalable relational database is designed to handle big data metrics and AI analysis:
- **Users:** Core authentication and dashboard ownership.
- **Ad Hierarchies:** Multi-platform structure connecting `AdAccounts` -> `Campaigns` -> `AdSets` -> `Ads`. Ready to expand beyond Meta.
- **DailyMetrics:** High-precision data layer storing daily performance snapshots (Impressions, Clicks, Spend, CPC, CTR, etc.) at the ad level.
- **Insights:** Logs actionable, AI-generated diagnoses mapped to user data, categorized by severity, root cause, and recommendations.

## Setup Instructions

### Backend (Laravel)
1. `cd backend`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. `php artisan migrate`
6. `php artisan serve`

### Frontend (React)
1. `cd frontend`
2. `npm install`
3. `cp .env.example .env`
4. `npm run dev`
