# Finance Dashboard

A full-stack financial analytics and transaction management system with role-based access control, real-time dashboard visualizations, and comprehensive financial reporting. Built with modern web technologies including AI-powered chatbot assistance.

## 🌐 Live Applications

- **Frontend**: [https://finance-dashboard-frontend.vercel.app](https://finance-dashboard-frontend.vercel.app)
- **Backend API**: [https://finance-dashboard-aorz.onrender.com](https://finance-dashboard-aorz.onrender.com)

> ⚠️ Note: Render free tier spins down after inactivity. First API request may take 30–60 seconds to respond.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Demo Credentials](#demo-credentials)
- [Features](#features)
- [Role-Based Permissions](#role-based-permissions)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Architecture](#architecture)
- [Design Decisions](#design-decisions)
- [Key Assumptions](#key-assumptions)
- [Available Categories](#available-categories)
- [Scripts & Commands](#scripts--commands)

---

## 🎯 Overview

Finance Dashboard is a comprehensive financial management system that enables users to:

- **Track Transactions**: Create, view, update, and manage income and expense records
- **Visual Analytics**: Real-time charts and graphs with monthly trends, category breakdowns, and health scores
- **Role-Based Access**: Three-tier permission system (Admin, Analyst, Viewer) for secure data access
- **User Management**: Admins can manage users, assign roles, and control account status
- **Dashboard Insights**: Key financial metrics including income, expenses, balance, and health scores
- **AI-Powered Chatbot**: Get intelligent insights and assistance with financial queries using our GenAI chatbot

---

## 🛠️ Tech Stack

### Frontend

| Layer           | Technology       | Version |
|-----------------|------------------|---------|
| Framework       | React + Vite     | 19.2.5  |
| Styling         | Tailwind CSS     | 4.2.4   |
| Animations      | Framer Motion    | 12.38.0 |
| State Management| Redux Toolkit    | 2.11.2  |
| HTTP Client     | Axios            | 1.15.2  |
| Routing         | React Router DOM | 7.14.2  |
| Charts          | Recharts         | 3.8.1   |
| Forms           | React Hook Form  | 7.73.1  |
| Notifications   | React Hot Toast  | 2.6.0   |
| Icons           | Lucide React     | 1.8.0   |

### Backend

| Layer           | Technology             | Version |
|-----------------|------------------------|---------|
| Runtime         | Node.js                | 18+     |
| Framework       | Express.js             | 5.2.1   |
| Database        | MongoDB + Mongoose     | 9.3.3   |
| Authentication  | JWT (JSON Web Tokens)  | 9.0.3   |
| Password Hash   | bcryptjs               | 3.0.3   |
| Validation      | Joi                    | 18.1.2  |
| Security        | Helmet                 | 8.1.0   |
| Rate Limiting   | express-rate-limit     | 8.3.2   |
| CORS            | cors                   | 2.8.6   |
| Logging         | Morgan                 | 1.10.1  |
| AI Integration  | Google GenAI           | 2.4.0   |

---

## 📁 Project Structure

```
finance-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components (Login, Dashboard, etc.)
│   │   ├── store/            # Redux slices and store configuration
│   │   ├── services/         # API services (Axios instances)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # Tailwind and global styles
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── .env.example          # Environment variables template
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js         # MongoDB connection
│   │   │   └── constants.js  # Application constants
│   │   ├── controllers/      # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── transaction.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── middleware/       # Express middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── Transaction.js
│   │   ├── routes/           # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   └── dashboard.routes.js
│   │   ├── services/         # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   ├── transaction.service.js
│   │   │   └── dashboard.service.js
│   │   ├── validators/       # Joi validation schemas
│   │   │   ├── auth.validator.js
│   │   │   ├── user.validator.js
│   │   │   └── transaction.validator.js
│   │   ├── utils/            # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   └── asyncHandler.js
│   │   └── app.js            # Express app setup
│   ├── postman/
│   │   └── Finance-Dashboard.postman_collection.json
│   ├── seed.js               # Database seeding script
│   ├── index.js              # Application entry point
│   ├── package.json
│   ├── .env.example          # Environment variables template
│   ├── .gitignore
│   └── README.md
│
├── .gitignore
└── README.md (this file)
```

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account for cloud database
- **Git** for version control

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aamirk0008/finance-dashboard.git
cd finance-dashboard
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Create Environment File

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/finance-dashboard

# Authentication
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Security
RATE_LIMIT_WINDOW=15       # minutes
RATE_LIMIT_MAX_REQUESTS=100

# Google AI (Optional)
GOOGLE_API_KEY=your_google_api_key
```

#### Seed Database

```bash
npm run seed
```

This will create demo users and sample transactions for testing.

#### Start Development Server

```bash
npm run dev
```

Backend API will be available at `http://localhost:5000`

---

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Create Environment File

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000
# For production:
# VITE_API_BASE_URL=https://finance-dashboard-aorz.onrender.com
```

#### Start Development Server

```bash
npm run dev
```

Frontend application will be available at `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `RATE_LIMIT_WINDOW` | Rate limit window in minutes | `15` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `GOOGLE_API_KEY` | Google API key (optional) | `your-api-key` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

---

## 👤 Demo Credentials

Use these credentials to explore the application:

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@finance.com   | admin123   |
| Analyst | analyst@finance.com | analyst123 |
| Viewer  | viewer@finance.com  | viewer123  |

---

## ✨ Features

### Frontend Features

- **🎨 Dark Glassmorphism UI**: Modern, sleek design with glassmorphism effects and smooth animations
- **🔐 JWT Authentication**: Secure token-based authentication with auto token injection
- **🛡️ Role-Based Route Protection**: Routes protected based on user roles
- **📊 Interactive Dashboards**:
  - Bar charts for income vs expense trends
  - Pie charts for category-wise breakdown
  - Gauge charts for financial health score
  - Key metrics cards (total income, expenses, balance)
- **💳 Transaction Management**:
  - Create, read, update, delete transactions
  - Filter by type (income/expense), category, date range
  - Pagination support
  - Soft delete functionality
- **👥 User Management**:
  - View all users (admin only)
  - Update user roles
  - Toggle user account status
  - User search and filtering
- **🤖 AI-Powered Chatbot**:
  - Intelligent financial insights and assistance
  - Query financial data naturally
  - Get recommendations and analysis
- **🔄 Auto Redirect on Auth Failure**: Automatic redirection to login on token expiry
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Backend Features

- **🔐 Secure Authentication**: JWT-based authentication with password hashing (bcryptjs)
- **🛡️ Role-Based Access Control (RBAC)**: Three-tier permission system (Admin, Analyst, Viewer)
- **📊 Financial Analytics**: Dashboard APIs with aggregated financial data
- **📝 Transaction Management**: Complete CRUD operations with soft delete
- **👥 User Management**: User registration, profile management, role assignment
- **✅ Data Validation**: Joi schema validation for all inputs
- **🚨 Error Handling**: Centralized error handling with consistent response format
- **⚡ Rate Limiting**: Request rate limiting to prevent abuse
- **🔒 Security Headers**: Helmet middleware for security headers
- **📋 CORS Support**: Cross-Origin Resource Sharing enabled
- **📊 MongoDB Aggregation**: Efficient server-side data processing
- **🌱 Database Seeding**: Demo data for quick testing
- **📮 Postman Collection**: Complete API documentation with Postman collection
- **🤖 GenAI Integration**: Google GenAI powered chatbot for intelligent financial assistance

---

## 🔐 Role-Based Permissions

### Permission Matrix

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

## 📡 API Documentation

### Base URL

- **Local**: `http://localhost:5000`
- **Production**: `https://finance-dashboard-aorz.onrender.com`

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | All | Get current user profile |

### User Management Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users?role=admin` | Admin | Filter users by role |
| GET | `/api/users/:id` | Admin | Get user by ID |
| PATCH | `/api/users/:id/role` | Admin | Update user role |
| PATCH | `/api/users/:id/status` | Admin | Toggle user status |
| DELETE | `/api/users/:id` | Admin | Delete user |

### Transaction Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/transactions` | Admin | Create transaction |
| GET | `/api/transactions` | Admin, Analyst | Get all transactions |
| GET | `/api/transactions?type=expense` | Admin, Analyst | Filter transactions |
| GET | `/api/transactions/:id` | Admin, Analyst | Get transaction by ID |
| PUT | `/api/transactions/:id` | Admin | Update transaction |
| DELETE | `/api/transactions/:id` | Admin | Soft delete transaction |

### Dashboard Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | All | Total income, expenses, net balance |
| GET | `/api/dashboard/categories` | Admin, Analyst | Category-wise totals |
| GET | `/api/dashboard/trends` | Admin, Analyst | Monthly income vs expense trends |
| GET | `/api/dashboard/ratio` | All | Income/expense ratio and health score |

### Query Parameters

#### Transactions
- `type` (string): Filter by "income" or "expense"
- `category` (string): Filter by category
- `startDate` (date): Filter from date (YYYY-MM-DD)
- `endDate` (date): Filter to date (YYYY-MM-DD)
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)

#### Users
- `role` (string): Filter by role (admin, analyst, viewer)
- `isActive` (boolean): Filter by active status
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)

#### Dashboard Trends
- `year` (number): Year to fetch trends for

### Response Format

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

---

## 🎨 Frontend Features

### Pages and Routes

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/` | All authenticated users |
| Transactions | `/transactions` | Admin, Analyst |
| Users | `/users` | Admin only |

### Dashboard Components

- **Summary Cards**: Quick overview of financial metrics
- **Income vs Expense Bar Chart**: Monthly comparison visualization
- **Category Pie Chart**: Breakdown of expenses by category
- **Health Score Gauge**: Financial health indicator
- **Recent Transactions**: Latest transaction activity
- **AI Chatbot**: Intelligent assistant for financial queries

---

## 🏗️ Architecture

### Backend Architecture

```
Request Flow
  ↓
Rate Limiter
  ↓
Auth Middleware (verify JWT token)
  ↓
Role Middleware (check permissions)
  ↓
Validate Middleware (Joi schema validation)
  ↓
Controller (handle request/response)
  ↓
Service (business logic + DB queries)
  ↓
Model (Mongoose schema)
  ↓
MongoDB
```

### Frontend Architecture

```
State Management (Redux Toolkit)
  ↓
API Services (Axios with auth interceptors)
  ↓
Components (Reusable React components)
  ↓
Pages (Route-based page components)
  ↓
Styling (Tailwind CSS)
  ↓
Animations (Framer Motion)
```

---

## 💡 Design Decisions

### Backend Design Decisions

1. **MVC Architecture**: Clear separation between routes, controllers, services, and models keeps the codebase maintainable and scalable.

2. **Service Layer**: All business logic and database queries live in services, keeping controllers thin and focused only on request/response handling.

3. **Centralized Error Handling**: A global error handler catches all errors and returns consistent JSON responses with appropriate status codes.

4. **Soft Delete**: Transactions are never hard deleted to preserve the financial audit trail. Deleted records have `isDeleted: true` and are filtered out in all queries.

5. **Joi Validation**: All request bodies are validated before reaching the controller layer using Joi schemas.

6. **Role Middleware as Factory**: `requireRole('admin', 'analyst')` pattern makes route protection reusable and composable across all routes.

7. **MongoDB Aggregation Pipelines**: Dashboard APIs use native MongoDB aggregation for efficient server-side data processing instead of fetching and computing in JavaScript.

8. **GenAI Integration**: Google GenAI is integrated for providing intelligent chatbot assistance with financial queries and insights.

### Frontend Design Decisions

1. **Redux Toolkit for State Management**: Centralized state management using Redux Toolkit for predictable state updates and easier debugging.

2. **Custom Hooks**: Encapsulation of reusable logic into custom React hooks for better code organization.

3. **API Service Layer**: Axios instance with interceptors for automatic token injection and centralized error handling.

4. **Component Composition**: Break down UI into smaller, reusable components following React best practices.

5. **Responsive Tailwind CSS**: Utility-first CSS framework for rapid UI development and responsive design.

6. **Framer Motion**: Smooth animations and transitions for enhanced user experience.

---

## 📌 Key Assumptions

- A user can only be created via the register API. Admins can update roles after creation.
- Transactions are soft deleted — they remain in the database with `isDeleted: true` and are never returned in queries.
- An admin cannot change their own role or deactivate their own account to prevent lockout.
- JWT tokens expire in 7 days. No refresh token mechanism is implemented.
- Date field in transactions defaults to the current date if not provided.
- Rate limiting is set to 100 requests per 15 minutes per IP.
- All monetary amounts are stored in INR (Indian Rupees).
- Users must authenticate to access protected resources.
- Role-based access is enforced at the API level.

---

## 📂 Available Categories

Transactions can be categorized as:

`salary` `freelance` `investment` `rent` `food` `transport` `utilities` `healthcare` `entertainment` `shopping` `education` `other`

---

## 🔧 Scripts & Commands

### Backend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with demo data |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Vite |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## 🧪 Testing with Postman

1. Import `backend/postman/Finance-Dashboard.postman_collection.json` into Postman
2. Select environment configuration
3. Set `baseUrl` to:
   - Local: `http://localhost:5000`
   - Production: `https://finance-dashboard-aorz.onrender.com`
4. Execute requests in this order:
   - **Login** → token saved automatically
   - **Get All Users** → userId saved automatically
   - **Get All Transactions** → transactionId saved automatically
   - Other requests work automatically after these three

---

## 📖 Additional Resources

- **Backend README**: [backend/README.md](backend/README.md)
- **Frontend README**: [frontend/README.md](frontend/README.md)
- **Frontend Live**: [https://finance-dashboard-frontend.vercel.app](https://finance-dashboard-frontend.vercel.app)
- **Backend API**: [https://finance-dashboard-aorz.onrender.com](https://finance-dashboard-aorz.onrender.com)

---

## 📝 License

This project is open source and available under the ISC License.

---

## 👨‍💻 Author

**Sheikh Aamir**

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For support and issues, please open an issue on the GitHub repository.

---

## 🎉 Acknowledgments

Built with ❤️ using modern web technologies and best practices in full-stack development, enhanced with AI-powered features for intelligent financial assistance.

