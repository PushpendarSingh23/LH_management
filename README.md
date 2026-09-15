# LH-Management — Lecture Hall Booking & Approval System

LH-Management is a full-stack web platform designed to streamline lecture hall reservation requests, scheduling, and multi-stage administrative sign-offs across university academic departments. Built with Node.js, Express.js, PostgreSQL, and React.js, the system enforces sequential multi-role approval workflows and prevents room double-booking under concurrent traffic.

---

## 🌟 Key Features

### 🔐 5-Role Sequential Approval Workflow
Enforces strict multi-tier sign-off before any lecture hall reservation is confirmed:
1. **Student / Applicant:** Submits room booking request specifying date, time window, hall, and purpose.
2. **Faculty Advisor:** Reviews and verifies academic validity.
3. **Head of Department (HOD):** Authorizes departmental resource allocation.
4. **Dean of Academic Affairs:** Grants institutional approval.
5. **Hall Administrator:** Issues final room booking confirmation.

### 🛡️ Concurrency-Safe Booking Engine
- **Database Row Locking:** Uses PostgreSQL `SELECT ... FOR UPDATE` row locking within database transactions to handle simultaneous booking requests safely.
- **Schema-Level Constraints:** Backed by database `CHECK` constraints that reject overlapping active reservations at the schema level, eliminating race conditions and double-bookings.
- **Normalized Relational Schema:** Designed across 7 normalized PostgreSQL tables tracking users, roles, halls, requests, approval stages, audit logs, and hall availability.

### 🔒 Security & Authentication
- **Cookie-Based JWT Auth:** Cookie-based `httpOnly` JWT authentication preventing XSS token theft.
- **Middleware Authorization:** Shared role-authorization middleware across every portal enforcing endpoint-level permissions.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with `pg` connection pool)
- **Authentication:** JWT (JSON Web Tokens), `httpOnly` Cookies, bcrypt password hashing

---

## 📁 Repository Structure

```
LH_management/
├── LH-Management-Backend-main/      # Express.js & PostgreSQL Backend
│   ├── config/                      # Database Pool & JWT Configs
│   ├── controllers/                 # Booking & Auth Controllers
│   ├── middlewares/                 # JWT & Role Middleware
│   ├── models/                      # PostgreSQL Data Queries
│   ├── routes/                      # API Endpoints
│   ├── README.md                    # Backend Specific Setup Guide
│   └── package.json
├── lh_management-main/              # React.js & Vite Frontend Client
│   ├── src/                         # Dashboards, Booking Forms, Portals
│   ├── public/                      # Static Assets
│   ├── README.md                    # Frontend Specific Setup Guide
│   └── package.json
└── README.md                        # Root Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `v18+`
- **PostgreSQL:** `v14+` running locally or on a cloud instance

---

### Environment Setup

#### Backend Configuration (`LH-Management-Backend-main/.env`)
Create `.env` inside `LH-Management-Backend-main/`:

```env
PORT=5000
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=your_postgres_password
PGDATABASE=lh_management
PGPORT=5432
JWT_SECRET=your_jwt_secret_key
```

#### Frontend Configuration (`lh_management-main/.env`)
Create `.env` inside `lh_management-main/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Installation & Execution

#### 1. Start Database
Ensure PostgreSQL is running, create the `lh_management` database, and execute the table initialization scripts.

#### 2. Start Backend Server
```bash
cd LH-Management-Backend-main
npm install
npm start
```

#### 3. Start Frontend Client
```bash
cd lh_management-main
npm install
npm run dev
```

---

## 📜 License

This project is licensed under the MIT License.
