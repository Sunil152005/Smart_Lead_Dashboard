# 🚀 Smart Lead Dashboard CRM (Full Stack MERN + TypeScript)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A full-stack, enterprise-grade Lead Management & CRM Dashboard built strictly with **React, TypeScript, TailwindCSS, Node.js, Express.js, TypeScript, and MongoDB + Mongoose**.

Designed with clean architecture, strict type safety, real-world engineering practices, and rich visual aesthetics with **Dark Mode**, **AI Lead Scoring (0–100)**, **Interactive Kanban Pipeline**, **Debounced Search**, **CSV Batch Import & Export**, and **Role-Based Access Control (RBAC)**.

---

## ⚡ Quick Start: How to Run in 2 Steps

### 1️⃣ Start Backend (Terminal 1)
```bash
cd backend
npm install
npm run build
npm start
```
> 📡 Server running at: **`http://localhost:5000`** | Health Check: **`http://localhost:5000/api/health`**

---

### 2️⃣ Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
> 🌐 Open in browser: **`http://localhost:5173`**

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin Manager** | `rahul@gmail.com` | `123456` | Full Access (Create, View, Update, **Delete**, Bulk Actions) |
| **Sales Representative** | `priya@sales.com` | `123456` | Sales Access (Create, View, Update Status & Notes) |

> 💡 **Tip**: Click the **1-Click Instant Demo Login** buttons on the login screen or use the **Switch Role** pill in the top navbar to test Admin vs Sales behavior instantly!

---

## 📑 Table of Contents
- [Tech Stack](#-mandatory-tech-stack)
- [Core Features & Assignment Checklist](#-core-features--assignment-checklist)
- [Innovative & Bonus Features](#-innovative--bonus-features)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Project Architecture](#-project-architecture)
- [Running with Docker](#-running-with-docker)
- [API Documentation](#-api-documentation)
- [Evaluation Criteria Alignment](#-evaluation-criteria-alignment)

---

## 🛠 Mandatory Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript (Strict, 0 plain JS), TailwindCSS, Lucide Icons, Axios, React CSV |
| **Backend** | Node.js, Express.js 5, TypeScript (Strict, 0 plain JS), MongoDB + Mongoose |
| **Auth & Security** | JWT (JSON Web Tokens), bcryptjs Password Hashing, RBAC Middleware |
| **DevOps** | Docker, Docker Compose, ts-node-dev, Vite |

---

## ✅ Core Features & Assignment Checklist

### 1. Authentication System (JWT-based)
- ✅ **User Registration** with role selection (`Admin` or `Sales User`).
- ✅ **User Login** with secure JWT token generation and storage handling.
- ✅ **Password Hashing** using `bcryptjs` with salt rounds.
- ✅ **Auth Middleware** (`protect`) for validating tokens and extracting user roles (`req.user`).
- ✅ **Protected Routes** on frontend (`<ProtectedRoute>`) and backend.

### 2. Leads Management (CRUD)
- ✅ **Lead Fields**: `Name`, `Email`, `Status` (New, Contacted, Qualified, Lost, etc.), `Source` (Website, Instagram, Referral, etc.), `Deal Value`, `Created At`.
- ✅ **Create Lead**: Add prospects with input validation and instant AI lead scoring.
- ✅ **Update Lead**: Inline status changer and full modal editor.
- ✅ **Delete Lead**: Role-guarded deletion (Admins only).
- ✅ **View Leads List**: Paginated data grid with sorting and status indicators.
- ✅ **View Single Lead Details**: Slide-over Drawer (`GET /api/leads/:id`) showing full account details, contact info, and activity log.

### 3. Advanced Filtering & Search
- ✅ **Filter by Status**: `New`, `Contacted`, `Qualified`, `Lost`, `In Progress`, `Proposal Sent`, `Won`.
- ✅ **Filter by Source**: `Website`, `Instagram`, `Referral`, `LinkedIn`, `Google Ads`, `Cold Outreach`, `Event`.
- ✅ **Search**: Full-text search matching `Name`, `Email`, `Company`, `Phone`, and custom `Tags`.
- ✅ **Sorting**: `Latest` (newest first), `Oldest` (oldest first), `Deal Value`, `AI Score`, `Name`.
- ✅ **Multi-Filter Synergy**: All filters (Status + Source + Search + Sorting) work simultaneously together.
- ✅ **Debounced Search**: 350ms input debounce prevents server spam while typing.

### 4. Backend Pagination
- ✅ **Mandatory Backend Pagination**: Using MongoDB `skip()` and `limit()`.
- ✅ **Standard Limit**: 10 records per page.
- ✅ **Pagination Response Metadata**: `currentPage`, `totalPages`, `totalLeads`, `limit`, `hasNextPage`, `hasPrevPage`.

### 5. Frontend UI & UX Excellence
- ✅ **Responsive Design**: Mobile, tablet, and desktop layouts.
- ✅ **Reusable Components**: `LeadTable`, `KanbanBoard`, `AnalyticsView`, `KPIStats`, `LeadDrawer`, `LeadModal`, `ImportModal`, `Navbar`.
- ✅ **Loading States**: Animated spinners and skeleton loaders.
- ✅ **Empty States**: Helpful illustrations and clear call-to-action to reset filters.
- ✅ **Error Handling UI**: Toast notifications, inline form validation, error banners.

### 6. API Standards & Error Handling
- ✅ **RESTful Design**: Predictable URIs and standard HTTP methods.
- ✅ **HTTP Status Codes**: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Error`.
- ✅ **Centralized Error Middleware**: Global error interceptor catching exceptions with structured response format.

---

## 🌟 Innovative & Bonus Features

1. **Dark Mode Support (PDF Bonus Feature)**:
   - Modern, sleek high-contrast Dark Mode with 1-click switcher in the navigation bar.
   - Persistent theme setting in `localStorage`.
2. **Interactive Kanban Pipeline Board**:
   - Visual board view categorized into 7 deal stages (*New ➔ Contacted ➔ In Progress ➔ Qualified ➔ Proposal Sent ➔ Won ➔ Lost*).
   - 1-click stage advancement and retreat buttons.
3. **Smart AI Lead Scoring (0–100 pts)**:
   - Evaluates deal size ($), engagement history, priority, and acquisition channel.
   - Classifies leads into **Hot 🔥 (75+)**, **Warm ⚡ (45–74)**, and **Cold ❄️ (<45)** with transparent assessment factors.
4. **Interactive Lead Activity & Notes Timeline**:
   - Post timestamped **Notes**, **Call Logs**, and **Email interactions**.
   - Automatic audit logs when deal stages change.
5. **Batch CSV Import & Export**:
   - 1-Click CSV export for filtered or all leads.
   - Drag & drop CSV batch importer with column auto-mapping and downloadable template.
6. **1-Click Role Switcher**:
   - Seamlessly switch between **Admin (Rahul)** and **Sales Rep (Priya)** directly from the top navigation to test permissions instantly.
7. **Keyboard Shortcuts**:
   - Press `/` or `Ctrl + K` to jump to search.
   - Press `N` to open the New Lead modal.
   - Press `Esc` to close any open modal or drawer.
8. **Dual-Mode Resilient Database Engine**:
   - Connects to MongoDB Atlas when online, with fallback to an in-memory store pre-seeded with 20+ realistic CRM business leads.

---

## 🔒 Role-Based Access Control (RBAC)

| Feature / Action | Admin Manager (`ADMIN`) | Sales User (`SALES`) |
| :--- | :---: | :---: |
| View Leads & Search | ✅ | ✅ |
| Create New Lead | ✅ | ✅ |
| Update Lead & Stage | ✅ | ✅ |
| Add Notes & Call Logs | ✅ | ✅ |
| Export & Import CSV | ✅ | ✅ |
| View Analytics & Kanban | ✅ | ✅ |
| **Delete Single Lead** | ✅ | ❌ *(Forbidden)* |
| **Bulk Delete Leads** | ✅ | ❌ *(Forbidden)* |

---

## 📁 Project Architecture

```text
lead-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts     # User registration, login, profile
│   │   │   └── leadController.ts     # CRUD, pagination, filtering, analytics, import
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.ts     # JWT authentication & role authorization
│   │   │   └── errorHandler.ts       # Centralized API error & 404 handler
│   │   ├── models/
│   │   │   ├── Lead.ts               # Mongoose Lead Schema & Types
│   │   │   └── User.ts               # Mongoose User Schema & Types
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         # /api/auth routes
│   │   │   └── leadRoutes.ts         # /api/leads routes
│   │   ├── services/
│   │   │   ├── db.ts                 # Database initialization & seed data
│   │   │   └── leadScorer.ts         # AI lead scoring algorithm
│   │   └── index.ts                  # Server entry & CORS configuration
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsView.tsx     # Visual pipeline funnel & channel charts
│   │   │   ├── ImportModal.tsx       # CSV file upload & validator
│   │   │   ├── KPIStats.tsx          # Real-time summary metric cards
│   │   │   ├── KanbanBoard.tsx       # Visual drag/click stage pipeline
│   │   │   ├── LeadDrawer.tsx        # Slide-over profile & activity timeline
│   │   │   ├── LeadModal.tsx         # Create / Edit lead form modal
│   │   │   ├── LeadTable.tsx         # Data grid with sorting & pagination
│   │   │   └── Navbar.tsx            # Navigation, views, dark mode, role switch
│   │   ├── context/
│   │   │   ├── ThemeContext.tsx      # Dark / Light mode provider
│   │   │   └── ToastContext.tsx      # Notification banner system
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Main CRM single-page workspace
│   │   │   └── Login.tsx             # Authentication & demo login screen
│   │   ├── types/
│   │   │   └── index.ts              # Strict TypeScript interfaces
│   │   ├── api.ts                    # Axios instance with JWT interceptor
│   │   ├── App.tsx                   # Routing & protected route guards
│   │   └── index.css                 # TailwindCSS base styles
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

## 🐳 Running with Docker

Run the entire full-stack application with a single command using Docker Compose:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 📡 API Documentation

### Auth Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user (`name`, `email`, `password`, `role`) | No |
| `POST` | `/api/auth/login` | Login and receive JWT token + user object | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### Leads Endpoints (`/api/leads`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/leads` | List leads with search, filters, sorting & pagination | Yes |
| `GET` | `/api/leads/:id` | View single lead details | Yes |
| `POST` | `/api/leads` | Create new lead with automated AI scoring | Yes |
| `PUT` | `/api/leads/:id` | Update lead fields or stage progression | Yes |
| `DELETE` | `/api/leads/:id` | Delete lead (`ADMIN` role only) | Yes (`ADMIN`) |
| `POST` | `/api/leads/:id/notes` | Add note, call log, or email record | Yes |
| `GET` | `/api/leads/analytics` | Aggregate metrics, funnel data & KPI summaries | Yes |
| `POST` | `/api/leads/import` | Bulk import leads from CSV | Yes |
| `POST` | `/api/leads/bulk-delete` | Delete multiple leads (`ADMIN` role only) | Yes (`ADMIN`) |
| `POST` | `/api/leads/bulk-update` | Bulk update stage status for selected leads | Yes |

---

## 🎯 Evaluation Criteria Alignment

| Evaluation Criteria | Implementation Detail |
| :--- | :--- |
| **Code Quality & Architecture** | Modular MVC backend, controller-service pattern, reusable React components, decoupled hooks |
| **TypeScript Usage** | 100% strict TypeScript types and interfaces across backend and frontend; zero plain JS |
| **API Design** | Clean RESTful endpoints, proper HTTP status codes, centralized error handler |
| **UI / UX Quality** | Modern aesthetics, Dark Mode, glassmorphism, glowing badges, responsive layouts, micro-animations |
| **Error Handling** | Toast notifications, inline form validation, graceful fallbacks, structured backend error format |
| **Real-World Engineering** | Debounced search, CSV import/export, role-based security, Docker orchestration, resilient database |

---

## 📧 Submission Info
- **Project**: Smart Leads Dashboard
- **Submission Email**: `ritik.yadav@servicehive.tech`
- **Subject Format**: `MERN Internship Assignment Submission - Sunil`