# 🏥 MedCare HMS — Hospital Management System

A complete **enterprise-level Hospital Management System** built with React + Node.js + PostgreSQL.  
Designed for both **production deployment** and **Database Systems Lab Mini Project** requirements.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TailwindCSS 3 |
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + RBAC |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Rule-based symptom checker + chatbot |

---

## 📁 Project Structure

```
project/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI (Sidebar, Navbar, ChatbotWidget, etc.)
│   │   ├── context/         # Auth context (login, register, session)
│   │   ├── pages/           # All pages organized by role
│   │   │   ├── admin/       # 12 admin pages (Dashboard, Doctors, Nurses, etc.)
│   │   │   ├── doctor/      # 5 doctor pages (Dashboard, Patients, Prescriptions, etc.)
│   │   │   ├── nurse/       # 3 nurse pages (Dashboard, Ward Patients, Vitals)
│   │   │   ├── patient/     # 6 patient pages (Dashboard, Book Appt, Symptoms, etc.)
│   │   │   ├── auth/        # Login, Register
│   │   │   └── public/      # Landing Page, FAQ
│   │   ├── services/        # API service layer (axios)
│   │   └── index.css        # Design system (TailwindCSS)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                  # Node.js Backend
│   ├── prisma/
│   │   ├── schema.prisma    # 37 database tables
│   │   └── seed.js          # Database seeding (roles, depts, FAQ, AI mappings)
│   ├── src/
│   │   ├── routes/          # 16 route modules
│   │   ├── middleware/      # JWT auth + error handling
│   │   ├── config/          # Database config
│   │   └── utils/           # Token utilities
│   ├── sql/                 # Academic documentation
│   │   ├── ddl.sql          # CREATE TABLE statements
│   │   ├── plsql.sql        # PL/pgSQL procedures & triggers
│   │   ├── normalization.md # 1NF → 2NF → 3NF documentation
│   │   └── er_diagram.md    # Complete ER diagram (Mermaid)
│   └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18+ (https://nodejs.org)
- **PostgreSQL** 14+ (https://www.postgresql.org/download/)

### 1. Clone & Install

```bash
# Install server dependencies
cd project/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/hospital_db"
JWT_SECRET="your-super-secret-key"
PORT=5000
```

### 3. Setup Database

```bash
# Create the database (in psql)
psql -U postgres -c "CREATE DATABASE hospital_db;"

# Run migrations
cd server
npx prisma migrate dev --name init

# Seed initial data (roles, departments, FAQ, AI mappings)
node prisma/seed.js
```

### 4. Run the Application

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 👥 User Roles & Features

### 🔑 Default Admin Account
```
Email: admin@hospital.com
Password: Admin@123
```

### Admin Dashboard
- 📊 Dashboard with stats, revenue charts, appointment pie chart
- 👨‍⚕️ Manage Doctors (add, search, delete)
- 👩‍⚕️ Manage Nurses (add, shift assignment)
- 🧑 Manage Patients (view, search, details)
- 🏢 Manage Departments (CRUD with card grid)
- 🛏️ Manage Rooms & Beds (visual bed grid)
- 💊 Pharmacy (medications + inventory tabs)
- 📅 Manage Appointments (filter, status updates)
- 💳 Billing Management (view all bills)
- 🚨 Emergency Cases (active/resolved)
- 🔧 Equipment Management
- ❓ FAQ Management (CRUD)

### Doctor Dashboard
- 📅 Today's appointments list
- 🧑‍🤝‍🧑 My Patients (with medical history modal)
- 📝 Write Prescriptions (multi-medicine form)
- 🕐 Schedule Management
- 🔬 Lab Results viewer

### Nurse Dashboard
- 🏥 Ward Patients list
- ❤️ Record Vitals (BP, HR, Temp, O₂, etc.)

### Patient Dashboard
- 📅 Book Appointment (3-step wizard with doctor cards)
- 💊 My Prescriptions (with detail modal)
- 📋 My Reports (lab test results)
- 💳 My Billing (view bills + make payments)
- 🔍 AI Symptom Checker (symptom selection → analysis → doctor recommendation)
- 🤖 Chatbot Widget (floating assistant)

---

## 🧠 AI Features (No External APIs Needed)

| Feature | Description |
|---------|------------|
| **Symptom Checker** | Select symptoms → matches against disease database → recommends specializations |
| **Doctor Recommendation** | AI scoring based on specialization match, rating, experience |
| **Chatbot** | Keyword intent detection + FAQ lookup, floating widget for patients |

---

## 📚 Academic Documentation (server/sql/)

| File | Purpose |
|------|---------|
| `ddl.sql` | Complete DDL for all 37 tables |
| `plsql.sql` | 6 PL/pgSQL stored procedures + 2 triggers |
| `normalization.md` | Step-by-step 1NF → 2NF → 3NF with examples |
| `er_diagram.md` | Full ER diagram in Mermaid format |

---

## 🗄️ Database: 37 Normalized Tables

1. roles, users
2. patients, doctors, nurses, staff
3. departments, doctor_schedules
4. appointments, prescriptions, prescription_items
5. medications, pharmacy_orders, inventory
6. lab_tests, lab_orders, lab_reports
7. medical_records, vitals, diagnoses, treatment_plans
8. rooms, beds, room_assignments, admissions, discharges
9. billing, billing_items, payments, insurance
10. equipment, feedback, faq
11. notifications, audit_log
12. symptom_disease_map, emergency_cases

All tables are in **Third Normal Form (3NF)**.

---

## 📄 License

MIT License — Built for academic and production use.
