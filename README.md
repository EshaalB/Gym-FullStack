# Gym Management System - Full Stack

A secure, scalable full-stack Gym Management System with a modern React/Redux frontend and Node.js/Express backend. Features JWT authentication, role-based access, dashboards, booking, payments, and more.

---

## 🚀 Features (Full Stack)

- Modern, responsive frontend (React + Redux + Tailwind CSS)
- Secure backend API (Node.js + Express + SQL Server)
- JWT authentication & role-based access (Admin, Trainer, Member)
- Modular, scalable codebase
- Accessible UI (ARIA, keyboard, color contrast)
- Real-time feedback (toasts, loaders)
- Booking, payments, attendance, plans, and more

---

## 📦 Project Structure

```
gym-management-system/
├── backend/           # Node.js/Express API
├── frontend/          # React/Redux client
├── README.md          # This file
└── ...
```

---

## 🖥️ Frontend (React/Redux)

### Stack

- React 19+
- Redux Toolkit
- React Router v7
- Tailwind CSS
- Framer Motion (animations)
- React Hot Toast (notifications)
- Chart.js (dashboard stats)

### Structure

```
frontend/src/
  components/
    admin/      # Admin dashboard UI
    trainer/    # Trainer dashboard UI
    user/       # User dashboard UI
    common/     # Shared UI (Navbar, Footer, Button, etc.)
    modals/     # All modal dialogs
  pages/        # Main site pages (Landing, Home, About, etc.)
  store/        # Redux slices, thunks, selectors
  assets/       # Images, icons
  utils/        # Utility functions
  theme.js      # Theme config
  App.jsx       # Main app entry
  main.jsx      # React root
```

### Main Features

- **Landing Page:** Multi-section, scrollable, animated, accessible
- **Dashboards:** Role-based (Admin, Trainer, Member)
- **Booking:** Class booking, trainer assignment
- **Payments:** Membership, class, and plan payments
- **Attendance:** Marking and viewing attendance
- **Workout Plans:** Assignment and tracking
- **Profile:** Edit, view, and support
- **Accessibility:** ARIA roles, keyboard nav, color contrast
- **Feedback:** Toasts, loaders, error messages

### How to Run (Frontend)

```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

### Connecting to Backend

- The frontend expects the backend API at `http://localhost:3500` (configurable in `.env`)
- All API calls use JWT tokens for authentication
- Redux thunks handle async API logic

### Redux Usage

- Slices for auth, bookings, dashboard, etc.
- Thunks for async actions (fetch, update, etc.)
- Selectors for efficient state access
- All dashboard data is Redux-driven

### Accessibility

- Navbar, sidebars, tables, and modals use ARIA roles/labels
- Keyboard navigation supported
- Color contrast and focus states
- Toasts and loaders are screen-reader friendly

---

## 🛠️ Backend (Node.js/Express)

(Keep all existing backend content here)

---

## 🏗️ System Architecture

- **Frontend:** SPA (React) served by Vite, communicates with backend via REST API
- **Backend:** Express API, SQL Server DB, JWT auth, role-based access
- **Auth Flow:**
  - User logs in/signup → receives JWT
  - JWT sent with each API request
  - Role-based routes (Admin, Trainer, Member)
- **Dashboards:**
  - Admin: Users, trainers, plans, classes, payments, stats
  - Trainer: Assigned classes, attendance, members, plans
  - Member: Book classes, view plans, payments, attendance
- **Booking Flow:**
  - Member books class → Trainer assigned → Attendance tracked
- **Payments:**
  - Membership, class, and plan payments tracked and managed
- **Error Handling:**
  - Consistent error format, toasts in frontend, error middleware in backend

---

## 🧭 How Everything Works (User Journey)

### 1. **Landing & Signup**

- User visits landing page, scrolls through sections
- Can sign up as Member (default), or login as Trainer/Admin

### 2. **Authentication**

- JWT-based login/signup
- Role-based dashboard redirect

### 3. **Member Dashboard**

- Book classes, view assigned classes
- View/renew membership, make payments
- Track attendance, workout plans
- Edit profile, contact support

### 4. **Trainer Dashboard**

- View assigned classes, mark attendance
- Assign workout plans
- Track member progress

### 5. **Admin Dashboard**

- Manage users, trainers, plans, classes
- View system stats, revenue, reports
- Assign trainers, manage payments

### 6. **Accessibility & Feedback**

- All actions provide real-time feedback (toasts, loaders)
- Accessible navigation and forms

---

## 📞 Support & Contribution

- For issues, open a GitHub issue or contact the maintainer
- PRs welcome! Please follow code style and add tests if possible

---

(Backend API details continue below)
