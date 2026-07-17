# SaaSify CRM | Workspace Member Directory

SaaSify CRM is a production-ready, full-stack web application designed as a premium SaaS dashboard for managing workspace team members. It features complete database integration, JWT-based user authentication, role-based access control (RBAC), advanced paginated search/filter/sorting, dark & light visual modes, interactive graphs, and smooth 60 FPS animations.

---

## 🚀 Key Features

* **Complete CRM CRUD System**: Add, view, search, filter, paginate, update, and delete member profiles.
* **Role-Based Access Control (RBAC)**:
  * `Admin`: Full CRUD management access (Create, Read, Update, Delete).
  * `User`: Read-only access to statistics, tables, and search/filter. Actions are visually locked and disabled.
* **Premium Glassmorphism Design**: Sleek layout resembling Notion, Stripe, and Vercel dashboards. Fully responsive across desktop, tablet, and mobile ports.
* **Interactive Statistics & Charts**: Aggregated visual graphs using Recharts representing member age distributions, city locations, and role charts.
* **Audit Logs / Real-time Activity Feed**: Automatic system logging of user actions (signups, logins, and member modifications) displayed in a dashboard timeline.
* **Custom Search & Filters**: Debounced search query indexing and dropdown filters on status, role, and city to optimize performance.
* **Robust Security Implementations**: Password hashing via `bcryptjs`, secure authorization via JSON Web Tokens (JWT), endpoint rate limit protection via `express-rate-limit`, and secure headers via `helmet`.
* **State Management & Transitions**: Dark/Light mode caching (localStorage), global auth contexts, and custom loading skeletons with animated shimmers.

---

## 🛠 Tech Stack

### Frontend
* **Core**: React.js (Vite compiler)
* **Routing**: React Router DOM (v6)
* **Styling**: Tailwind CSS (v3) + Glassmorphism panels
* **Animations**: Framer Motion
* **API Client**: Axios (with global auth interceptors)
* **Validation**: React Hook Form
* **Charts**: Recharts
* **Icons**: React Icons (Radix icons)
* **Toasts**: React Hot Toast

### Backend
* **Runtime**: Node.js + Express.js
* **Database**: MongoDB (Local or Atlas)
* **ODM**: Mongoose
* **Auth**: JSON Web Tokens (JWT) + Password hashing (bcryptjs)
* **Security**: Helmet, CORS, and Express Rate Limiters

---

## 📂 Project Structure

```
workspace/
├── README.md            # Project documentation
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI (Table, Modal, StatsCard, Skeletons)
│   │   ├── pages/       # Dashboard, Directory, Login, Signup, NotFound
│   │   ├── layouts/     # DashboardLayout shell
│   │   ├── hooks/       # useAuth, useTheme, useDebounce
│   │   ├── services/    # api.js Axios configuration
│   │   ├── context/     # AuthContext, ThemeContext providers
│   │   └── App.jsx      # Router & main rendering tree
│   └── tailwind.config.js
└── server/              # Node + Express Backend
    ├── config/          # db.js connection file
    ├── controllers/     # authController, memberController business logic
    ├── middleware/      # authMiddleware, errorMiddleware, rateLimiter
    ├── models/          # User, Member, Activity Mongoose schemas
    ├── routes/          # authRoutes, memberRoutes routers
    ├── server.js        # Boot loader entrypoint
    └── app.js           # Express app configuring middlewares
```

---

## ⚙️ Environment Variables

### Backend Configuration (`server/.env`)
Create a `.env` file inside the `/server` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/saas_crm
JWT_SECRET=super_secret_jwt_key_9911_saas_crm
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## ⚡ Quick Start & Installation

### Prerequisites
* [Node.js](https://nodejs.org) installed (v16+ recommended).
* [MongoDB](https://www.mongodb.com) running locally on port 27017 or a MongoDB Atlas URI connection string.

### 1. Run Backend Server
```bash
cd server
npm install
npm run dev
```
The server will boot on `http://localhost:5000` and automatically connect to MongoDB.

### 2. Run Frontend Client
Open a second terminal window:
```bash
cd client
npm install
npm run dev
```
The client will boot on `http://localhost:5173`. Open your browser to access the SaaS CRM.

---

## 📡 API Documentation

All routes require a `Bearer <JWT_TOKEN>` in the `Authorization` header, except signup and login.

### 🔐 Authentication (`/api/auth`)
* `POST /signup` - Register a new account.
  * Body: `{ name, email, password, role }` (Role: `User` or `Admin`).
* `POST /login` - Log in to get JWT token.
  * Body: `{ email, password }`
* `GET /me` - Retrieve authenticated user credentials.

### 👥 Workspace Members CRUD (`/api/users`)
* `POST /` - Add a new workspace member. **(Admin only)**
  * Body: `{ name, email, phone, age, city, role, status }`
* `GET /` - Fetch members list (supports pagination, search, sort, filters).
  * Queries: `?page=1&limit=5&search=john&role=Admin&status=Active&sortBy=name:asc`
* `GET /:id` - Retrieve individual member profile details.
* `PUT /:id` - Update member information. **(Admin only)**
  * Body: `{ name, email, phone, age, city, role, status }`
* `DELETE /:id` - Permanently remove member record. **(Admin only)**
* `GET /dashboard/stats` - Fetch aggregate stats, Recharts chart details, unique city listings, and recent system activities logs.

---

## ☁️ Deployment Guidelines

### Database
* Set up a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
* Update `MONGO_URI` in your production environments to point to the Atlas connection string.

### Backend (Render / Heroku)
* Connect your repository to [Render](https://render.com).
* Deploy as a **Web Service**.
* Add all variables in the `Environment` settings tab. Set `NODE_ENV=production`.

### Frontend (Vercel / Netlify)
* Import your frontend repository folder (`/client`).
* Set Build Command to `npm run build` and Output Directory to `dist`.
* Add `VITE_API_URL` pointing to your hosted Express Backend API domain (e.g. `https://your-api.onrender.com/api`).
