# Finance Dashboard Backend

A RESTful API backend for a finance dashboard system built with Node.js, Express.js, and MongoDB. Supports role-based access control, financial records management, and dashboard-level analytics.

## Live API

Base URL: `https://finance-dashboard-aorz.onrender.com`

> Note: Render free tier spins down after inactivity. First request may take 30–60 seconds to respond.

---

## Tech Stack

| Layer          | Technology             |
|----------------|------------------------|
| Runtime        | Node.js                |
| Framework      | Express.js             |
| Database       | MongoDB (Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens)  |
| Validation     | Joi                    |
| Security       | Helmet, CORS, Rate Limit |

---

## Project Structure
```
finance-dashboard-backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── constants.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── transaction.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── transaction.routes.js
│   │   └── dashboard.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── transaction.service.js
│   │   └── dashboard.service.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   └── transaction.validator.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   └── app.js
├── postman/
│   ├── Finance-Dashboard.postman_collection.json
├── seed.js
├── index.js
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### Installation

1. Clone the repository
```bash
git clone https://github.com/aamirk0008/finance-dashboard.git
cd Finance-Dashboard
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in root directory
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/finance-dashboard
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. Seed the database with demo users and transactions
```bash
npm run seed
```

5. Start the development server
```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## Demo Credentials

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@finance.com   | admin123   |
| Analyst | analyst@finance.com | analyst123 |
| Viewer  | viewer@finance.com  | viewer123  |

---

## Roles and Permissions

| Action               | Admin | Analyst | Viewer |
|----------------------|-------|---------|--------|
| Register / Login     | ✅    | ✅      | ✅     |
| View own profile     | ✅    | ✅      | ✅     |
| Manage users         | ✅    | ❌      | ❌     |
| Create transactions  | ✅    | ❌      | ❌     |
| View transactions    | ✅    | ✅      | ❌     |
| Dashboard summary    | ✅    | ✅      | ✅     |
| Category breakdown   | ✅    | ✅      | ❌     |
| Monthly trends       | ✅    | ✅      | ❌     |
| Income expense ratio | ✅    | ✅      | ✅     |

---

## API Endpoints

### Auth

| Method | Endpoint           | Access | Description      |
|--------|--------------------|--------|------------------|
| POST   | /api/auth/register | Public | Register a user  |
| POST   | /api/auth/login    | Public | Login a user     |
| GET    | /api/auth/me       | All    | Get current user |

### Users

| Method | Endpoint                  | Access | Description        |
|--------|---------------------------|--------|--------------------|
| GET    | /api/users                | Admin  | Get all users      |
| GET    | /api/users?role=admin     | Admin  | Filter users       |
| GET    | /api/users/:id            | Admin  | Get user by ID     |
| PATCH  | /api/users/:id/role       | Admin  | Update user role   |
| PATCH  | /api/users/:id/status     | Admin  | Toggle user status |
| DELETE | /api/users/:id            | Admin  | Delete user        |

### Transactions

| Method | Endpoint                  | Access         | Description             |
|--------|---------------------------|----------------|-------------------------|
| POST   | /api/transactions         | Admin          | Create transaction      |
| GET    | /api/transactions         | Admin, Analyst | Get all transactions    |
| GET    | /api/transactions?type=expense | Admin, Analyst | Filter transactions |
| GET    | /api/transactions/:id     | Admin, Analyst | Get transaction by ID   |
| PUT    | /api/transactions/:id     | Admin          | Update transaction      |
| DELETE | /api/transactions/:id     | Admin          | Soft delete transaction |

### Dashboard

| Method | Endpoint                  | Access         | Description                          |
|--------|---------------------------|----------------|--------------------------------------|
| GET    | /api/dashboard/summary    | All            | Total income, expenses, net balance  |
| GET    | /api/dashboard/categories | Admin, Analyst | Category wise totals                 |
| GET    | /api/dashboard/trends     | Admin, Analyst | Monthly income vs expense trends     |
| GET    | /api/dashboard/ratio      | All            | Income expense ratio and health score|

---

## Query Parameters

### Transactions

| Param     | Type   | Description                    |
|-----------|--------|--------------------------------|
| type      | string | Filter by income or expense    |
| category  | string | Filter by category             |
| startDate | date   | Filter from date               |
| endDate   | date   | Filter to date                 |
| page      | number | Page number (default: 1)       |
| limit     | number | Results per page (default: 10) |

### Users

| Param    | Type   | Description               |
|----------|--------|---------------------------|
| role     | string | Filter by role            |
| isActive | boolean| Filter by active status   |
| page     | number | Page number (default: 1)  |
| limit    | number | Results per page          |

### Dashboard Trends

| Param | Type   | Description               |
|-------|--------|---------------------------|
| year  | number | Year to fetch trends for  |

---

## Response Format

All API responses follow a consistent structure.

**Success:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

---

## Testing with Postman

1. Import `postman/Finance-Dashboard.postman_collection.json` into Postman
2. Select `Finance Dashboard` environment from the dropdown
3. Set `baseUrl` in environment to:
   - Local: `http://localhost:5000`
   - Live: `https://finance-dashboard-aorz.onrender.com`
4. Run requests in this order:
   - **Login** → token saved automatically
   - **Get All Users** → userId saved automatically
   - **Get All Transactions** → transactionId saved automatically
   - All other requests work automatically after these three

---

## Architecture
```
Request
  → Rate Limiter
  → Auth Middleware     (verify JWT token)
  → Role Middleware     (check role permissions)
  → Validate Middleware (Joi schema validation)
  → Controller          (handle request/response)
  → Service             (business logic + DB queries)
  → Model               (Mongoose schema)
  → MongoDB
```

---

## Design Decisions

- **MVC Architecture** — clear separation between routes, controllers, services, and models keeps the codebase maintainable and scalable.
- **Service Layer** — all business logic and database queries live in services, keeping controllers thin and focused only on request/response handling.
- **Centralized Error Handling** — a global error handler catches all errors and returns consistent JSON responses with appropriate status codes.
- **Soft Delete** — transactions are never hard deleted to preserve the financial audit trail. Deleted records have `isDeleted: true` and are filtered out in all queries.
- **Joi Validation** — all request bodies are validated before reaching the controller layer.
- **Role Middleware as Factory** — `requireRole('admin', 'analyst')` pattern makes route protection reusable and composable across all routes.
- **MongoDB Aggregation Pipelines** — dashboard APIs use native MongoDB aggregation for efficient server-side data processing instead of fetching and computing in JavaScript.

---

## Assumptions Made

- A user can only be created via the register API. Admins can update roles after creation.
- Transactions are soft deleted — they remain in the database with `isDeleted: true` and are never returned in queries.
- An admin cannot change their own role or deactivate their own account to prevent lockout.
- JWT tokens expire in 7 days. No refresh token mechanism is implemented.
- Date field in transactions defaults to the current date if not provided.
- Rate limiting is set to 100 requests per 15 minutes per IP.
- All monetary amounts are stored in INR (Indian Rupees).

---

## Available Categories

`salary` `freelance` `investment` `rent` `food` `transport` `utilities` `healthcare` `entertainment` `shopping` `education` `other`

---

## Scripts

| Command         | Description                         |
|-----------------|-------------------------------------|
| `npm run dev`   | Start development server (nodemon)  |
| `npm run start` | Start production server             |
| `npm run seed`  | Seed database with demo data        |