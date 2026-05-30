<div align="center">
  <img src="https://via.placeholder.com/150/2563eb/ffffff?text=AdDoctor" alt="AdDoctor Logo" width="120" />
  <h1>AdDoctor</h1>
  <p><strong>AI-Powered Meta Ads Diagnosis SaaS</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 🚀 Overview

**AdDoctor** is an intelligent, automated diagnostics platform designed to help digital marketers and business owners decode their Meta Ads performance. Instead of manually sifting through rows of complex metrics, AdDoctor automatically syncs your daily campaign data, detects anomalies (like sudden CPC spikes or CTR drops), and uses OpenAI's GPT-4o-mini to translate technical issues into plain-English, actionable business insights.

Stop guessing why your ads underperform. Let AdDoctor tell you exactly what went wrong and how to fix it.

## ✨ Features

- **🤖 AI-Driven Diagnostics:** Automated detection of ad performance anomalies using a robust rules engine, powered by OpenAI to guarantee human-readable recommendations.
- **🔄 Automated Meta Sync:** Seamless background synchronization of Meta Ad Accounts, Campaigns, and Daily Metrics using Laravel Queues and scheduled jobs.
- **📊 SaaS-Grade Dashboard:** React-powered intuitive UI to instantly view account health scores, active anomalies, and synced ad accounts.
- **🔐 Secure & Scalable:** Protected via Laravel Sanctum (token-based auth) with a multi-tenant database architecture.
- **⚠️ Actionable Insights Feed:** A categorized diagnostic feed that isolates critical issues, warnings, and system notifications—with clear root causes and recommended actions.

## 🛠 Tech Stack

AdDoctor connects a robust stateless backend with a modern, reactive frontend.

### Frontend
- **Framework:** React 19 (via Vite 5)
- **Styling:** Tailwind CSS v3, `clsx`, `tailwind-merge`
- **Routing:** React Router v7
- **UI Components:** Custom primitive design system inspired by Radix (Buttons, Cards, Badges) + Lucide React Icons
- **State/HTTP:** React Context API & Axios

### Backend
- **Framework:** Laravel 12 (REST API Only)
- **Database:** SQLite (Local Dev) / MySQL (Production)
- **Authentication:** Laravel Sanctum
- **Integrations:** Meta Graph API (OAuth & Metrics), OpenAI API (`gpt-4o-mini`)
- **Queue/Jobs:** Laravel database queues for async syncing and Insight generation.

---

## 🏗 Architecture & Data Flow

AdDoctor uses a structured monorepo approach for streamlined development:

```text
AdDoctor/
├── backend/    # Laravel REST API (Provides data, handles AI & queues)
└── frontend/   # React SPA (Consumes API, visualizes data)
```

### The Insight Pipeline
1. **Data Ingestion (`SyncMetaAdsData`):** Scheduled Laravel connection securely pulls daily snapshots of impressions, spend, CPC, and CTR from Meta's Graph API.
2. **Rule Evaluation (`InsightEngine`):** Technical conditions evaluate the synced metrics (e.g., *Is CPC > 20% higher than yesterday?*).
3. **AI Translation (`OpenAIService`):** Flagged technical anomalies are piped to OpenAI, which reconstructs the error into a business-safe format (Severity, Root Cause, Recommendation).
4. **Delivery:** Processed insights are instantly available on the user's React Dashboard.

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- PHP 8.2+
- Composer
- A Meta Developer App (for Graph API Credentials)
- OpenAI API Key

### Backend Setup (Laravel)
Navigate to the `backend` directory and run:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure your database in .env (SQLite by default for local)
php artisan migrate

# Start the server (runs on localhost:8000)
php artisan serve

# In a separate terminal, run the queue worker for Meta Syncing
php artisan queue:work
```

*(Ensure you add your `META_APP_ID`, `META_APP_SECRET`, and `OPENAI_API_KEY` to the `.env` file!)*

### Frontend Setup (React/Vite)
Navigate to the `frontend` directory and run:

```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env

# Start the Vite development server (runs on localhost:5173)
npm run dev
```

---

<div align="center">
  <i>Designed & developed for the modern performance marketer.</i>
</div>
