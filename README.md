# 🚀 Smart Lead Dashboard CRM (AI 2.0)

A full-stack, enterprise-grade Sales & Lead Management CRM designed to solve real-world sales challenges with **Smart AI Lead Scoring (0–100)**, **Interactive Pipeline Stage Tracking**, **Slide-over Activity Timelines**, **Instant WhatsApp / Email Actions**, **CSV Batch Import & Export**, and **Role-Based Access Control (RBAC)**.

Built with **React 19, TypeScript, TailwindCSS, Node.js, Express 5, and Mongoose / Resilient Local Data Engine**.

---

## 🌟 Key Real-Life Problem-Solving Features

1. **Smart AI Lead Scoring Engine (0–100 pts)**:
   - Automatically evaluates deal size ($), priority level, engagement history, and acquisition channels.
   - Assigns **Hot 🔥 (75+)**, **Warm ⚡ (45–74)**, and **Cold ❄️ (<45)** priority badges with transparent AI assessment factors.
2. **One Simple Unified Smart Dashboard**:
   - Clean, bright white UI with colorful dark-contrast typography and interactive widgets.
   - **Real-time KPI Cards**: Total Pipeline Value, Closed Won Revenue, Conversion Rate (%), Hot Leads Count, Average Deal Size.
   - **Interactive Visual Pipeline Stage Tracker**: Click any stage (*New, Contacted, In Progress, Qualified, Proposal Sent, Won, Lost*) to instantly filter deals and view stage values.
3. **Comprehensive Lead Management Table**:
   - Multi-field live search across *Name, Company, Email, Phone, and Custom Tags*.
   - Filter by acquisition channel (*LinkedIn, Referral, Website, Google Ads, Cold Outreach, Events*).
   - Inline stage dropdown to move deals forward in a single click.
   - 1-Click Quick Contact buttons: Direct **mailto:** email, **tel:** call, and **WhatsApp** chat launcher.
4. **Slide-over Lead Activity & Notes Timeline**:
   - Click any lead to inspect full account details, AI score factors, and chronological interaction timeline.
   - Post timestamped **Notes**, **Call Logs**, and **Email Records** with automatic engagement score updates.
5. **Batch CSV Import & Export**:
   - Download pre-formatted sample CSV templates.
   - Upload CSV spreadsheets with automatic column validation and instant bulk AI scoring.
   - Export filtered or entire lead records to formatted CSV files.
6. **Role-Based Access Control (RBAC)**:
   - **ADMIN**: Full CRUD permissions, lead deletion, user role assignment, bulk operations, and full analytics.
   - **SALES**: Lead creation, status updates, timeline notes, contact actions (protected against unauthorized deletions).
7. **Dual-Mode Resilient Database**:
   - Automatically connects to MongoDB Atlas if available.
   - If offline or if MongoDB IP is restricted, seamlessly activates the built-in resilient development engine with **20+ realistic CRM business leads** and demo accounts pre-seeded.

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin Manager** | `rahul@gmail.com` | `123456` | Full Access (Create, View, Update, Delete, Bulk Actions) |
| **Sales Representative** | `priya@sales.com` | `123456` | Sales Access (Create, View, Update Status & Notes) |

> 💡 **Tip**: The login page and top navbar include **1-Click Instant Demo Login** buttons so you can switch between Admin and Sales with one click!

---

## 💻 How to Run the Project in VS Code (Step-by-Step)

### Prerequisites
- Install **Node.js (v18 or v20+)** from [nodejs.org](https://nodejs.org).
- Open **Visual Studio Code**.

---

### Step 1: Open the Project in VS Code
1. Open VS Code.
2. Go to `File` > `Open Folder...` and select the `lead-dashboard` directory.
3. Open the integrated terminal using `Ctrl + \`` (or `Terminal` > `New Terminal`).

---

### Step 2: Run the Backend Server (Terminal 1)

In your first VS Code terminal, run:

```bash
# Navigate to the backend folder
cd backend

# Install dependencies (if not already installed)
npm install

# Build TypeScript
npm run build

# Start the Backend Server
npm start
```

You should see:
```text
=========================================
🚀 Smart Lead Dashboard CRM Server
📡 URL: http://localhost:5000
🩺 Health: http://localhost:5000/api/health
=========================================
```

---

### Step 3: Run the Frontend Application (Terminal 2)

In VS Code, split your terminal or open a **New Terminal** (`+` icon), then run:

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite Development Server
npm run dev
```

You should see:
```text
  VITE v8.0.13  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://localhost:5173/
```

---

### Step 4: Open and Use the Application

1. Open your browser and navigate to: **`http://localhost:5173/`**
2. Click **"Admin (Rahul)"** or **"Sales (Priya)"** to log in instantly.
3. Explore the dashboard:
   - View top **KPI Metrics** and **Pipeline Stage Breakdown**.
   - Click any lead to open the **Slide-Over Profile Drawer** and add an activity note.
   - Click **"+ Add New Lead"** to test the automatic Smart AI lead score calculation.
   - Click **"Export CSV"** or **"Import CSV"** to test bulk data workflows.
   - Use the **1-Click Role Switcher** in the top navigation to test Admin vs Sales RBAC.

---

## 🐳 Running with Docker (Alternative)

You can run the full-stack application with a single command using Docker Compose:

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🛠️ API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register a new user (`name`, `email`, `password`, `role`).
- `POST /api/auth/login`: Authenticate user and receive JWT token + role.
- `GET /api/auth/me`: Get current authenticated user profile (Protected).

### Leads & Analytics (`/api/leads`)
- `GET /api/leads`: Search, filter by stage/source/priority/score, sort, and paginate leads.
- `POST /api/leads`: Create a new lead with automated AI scoring.
- `PUT /api/leads/:id`: Update lead details and stage progression.
- `DELETE /api/leads/:id`: Delete a lead (Admin only).
- `POST /api/leads/:id/notes`: Append an activity note, call log, or email record.
- `GET /api/leads/analytics`: Retrieve KPI aggregates, pipeline value, win rate, and stage totals.
- `POST /api/leads/import`: Bulk import array of leads from CSV.
- `POST /api/leads/bulk-delete`: Bulk delete selected leads (Admin only).
- `POST /api/leads/bulk-update`: Bulk update stage status for selected leads.

---

## 📁 Project Structure

```text
lead-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Auth & Lead business controllers
│   │   │   ├── authController.ts
│   │   │   └── leadController.ts
│   │   ├── middlewares/       # JWT Auth & RBAC role protection
│   │   │   └── authMiddleware.ts
│   │   ├── models/            # Mongoose Schemas (Lead, User)
│   │   │   ├── Lead.ts
│   │   │   └── User.ts
│   │   ├── routes/            # Express API Routes
│   │   │   ├── authRoutes.ts
│   │   │   └── leadRoutes.ts
│   │   ├── services/          # Smart Lead Scorer & Resilient DB Engine
│   │   │   ├── db.ts
│   │   │   └── leadScorer.ts
│   │   └── index.ts           # Server entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # UI Components
│   │   │   ├── ImportModal.tsx
│   │   │   ├── KPIStats.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── LeadDrawer.tsx
│   │   │   ├── LeadModal.tsx
│   │   │   ├── LeadTable.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Toast.tsx
│   │   ├── context/           # Theme and Toast Contexts
│   │   ├── pages/             # Main Pages
│   │   │   ├── Dashboard.tsx  # Unified Smart CRM Dashboard
│   │   │   └── Login.tsx      # Clean Light Glassmorphism Login
│   │   ├── types/             # TypeScript CRM Interfaces
│   │   ├── api.ts             # Axios client with JWT interceptor
│   │   ├── App.tsx            # Routes & Providers
│   │   └── index.css          # TailwindCSS styles
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

## 👨‍💻 Author
**Sunil**