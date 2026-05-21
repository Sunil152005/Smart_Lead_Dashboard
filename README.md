# Smart Lead Dashboard CRM

A full-stack MERN CRM application built for managing sales leads with secure authentication, role-based access control, lead management, filtering, search, pagination, CSV export, Docker support, and responsive modern UI.

---

# Live Demo

Frontend:
https://smart-lead-dashboard-mocha.vercel.app

Backend API:
https://lead-dashboard-backend-edjs.onrender.com

---

# Demo Credentials

## Admin Access

Email:
rahul@gmail.com

Password:
123456

---

# Project Overview

This project is a production-style Lead Management CRM Dashboard developed using the MERN stack.

The application allows organizations to:
- manage leads
- track lead status
- filter/search leads
- control access using roles
- securely authenticate users
- export data
- deploy using Docker

The project follows modern full-stack architecture with separate frontend and backend services.

---

## Tech Stack

Frontend:
- React
- TypeScript
- TailwindCSS

Backend:
- Node.js
- Express
- MongoDB

---

# Features Implemented

## Authentication & Security

- JWT Authentication
- Protected APIs
- Password Hashing using bcrypt
- Persistent Login using localStorage
- Role Based Access Control (RBAC)

---

## Role Based Access

### ADMIN
- Create Leads
- View Leads
- Update Leads
- Delete Leads

### SALES
- Create Leads
- View Leads

---

# Lead Management Features

- Create Lead
- Read/View Leads
- Update Lead
- Delete Lead

Each lead contains:
- Name
- Email
- Status
- Source

---

# Advanced Features

- Search Leads
- Filter by Status
- Filter by Source
- Pagination
- CSV Export
- Loading State
- Empty State Handling

---

# UI/UX Features

- Modern Responsive UI
- TailwindCSS Styling
- Dashboard Layout
- Responsive Tables
- Styled Forms & Buttons

---

# Docker Support

Dockerized full-stack application using:
- Dockerfile
- Docker Compose

Single command startup:
```bash
docker compose up


Author

Sunil