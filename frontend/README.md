# Finance Dashboard Frontend

A modern React frontend for the Finance Dashboard backend built with Vite, Tailwind CSS, Redux Toolkit, and Framer Motion.

## Live App

URL: `https://finance-dashboard-frontend.vercel.app`

## Backend API

Base URL: `https://finance-dashboard-aorz.onrender.com`

## Tech Stack

| Layer           | Technology       |
|-----------------|------------------|
| Framework       | React + Vite     |
| Styling         | Tailwind CSS     |
| Animations      | Framer Motion    |
| State           | Redux Toolkit    |
| API Calls       | Axios            |
| Routing         | React Router DOM |
| Charts          | Recharts         |
| Forms           | React Hook Form  |
| Notifications   | React Hot Toast  |

## Getting Started

```bash
git clone https://github.com/yourusername/finance-dashboard-frontend.git
cd finance-dashboard-frontend
npm install
```

Create `.env`:
```env
VITE_API_BASE_URL=https://finance-dashboard-aorz.onrender.com
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

## Demo Credentials

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@finance.com   | admin123   |
| Analyst | analyst@finance.com | analyst123 |
| Viewer  | viewer@finance.com  | viewer123  |

## Pages

| Page         | Route          | Access          |
|--------------|----------------|-----------------|
| Login        | /login         | Public          |
| Register     | /register      | Public          |
| Dashboard    | /              | All roles       |
| Transactions | /transactions  | Admin, Analyst  |
| Users        | /users         | Admin only      |

## Features

- Dark glassmorphism UI with Framer Motion animations
- JWT auth with auto token injection on every request
- Role based route protection
- Dashboard with bar chart, pie chart, health score gauge
- Transaction CRUD with filters and pagination
- User management with role updates and status toggle
- Auto redirect on 401 — token expiry handled globally