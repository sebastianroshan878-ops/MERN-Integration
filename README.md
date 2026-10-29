# NexusCRM - Customer Relationship Management (MERN Integration)

> **Entri Full Stack Development V8 — Assignment 14: "MERN Integration"**  
> Complete Full-Stack CRM application built with MongoDB, Express.js, React.js, and Node.js.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture & Folder Structure](#-project-architecture--folder-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [RESTful API Documentation](#-restful-api-documentation)
- [Postman Testing Guide](#-postman-testing-guide)
- [Frontend Form Validation & Error Handling](#-frontend-form-validation--error-handling)
- [Video Demonstration Guide](#-video-demonstration-guide)
- [Evaluation Rubric Self-Check](#-evaluation-rubric-self-check)

---

## 🚀 Project Overview

**NexusCRM** is a modern, responsive Customer Relationship Management application designed for sales teams and business administrators to manage prospects, track lead conversions, and maintain accurate customer accounts. 

The application is split into two cleanly decoupled services:
- **`server/`**: A RESTful Node.js + Express backend connected to MongoDB via Mongoose, secured with JWT authentication and bcrypt password hashing.
- **`client/`**: A React frontend bundled with Vite, styled with Tailwind CSS, and powered by React Router for client-side routing and protected routes.

---

## ✨ Key Features

### 1. User Authentication & Authorization
- **Registration**: Allows new sales agents or administrators to register with full name, email, role, and password. Passwords are salted and hashed using `bcryptjs` before persisting to MongoDB.
- **Login**: Authenticates user credentials and generates a secure JSON Web Token (`jsonwebtoken` / JWT).
- **Protected Routes**: Protected API endpoints and frontend views requiring a valid `Bearer <token>` in the `Authorization` header.
- **Session Persistence**: Maintains session state in `localStorage` and automatically syncs user profile info with the backend.

### 2. CRM Customer Data Management (CRUD)
- **Create**: Add new customer leads with name, email, phone, company, pipeline status, lead source, and contextual notes.
- **Read (Fetch All)**: Display customer accounts in a responsive desktop data table or mobile-friendly card layout.
- **Search & Filter**: Real-time debounce search across names, emails, and company names, plus a dropdown filter by pipeline stage.
- **Update**: Edit existing customer information with pre-populated form fields and instantaneous UI synchronization.
- **Delete**: Safely delete customer records with a double-check confirmation modal to prevent accidental data loss.

### 3. Middleware & Validation
- **Request Validation Middleware**: Validates incoming request payloads for registration, login, and customer creation prior to controller execution.
- **Centralized Error Handling**: Express middleware that returns consistent JSON error envelopes and appropriate HTTP status codes (`400`, `401`, `404`, `500`).
- **Client-Side Form Validation**: Real-time error feedback on empty inputs, invalid email patterns, and short passwords.

---

## 🛠 Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React Icons, Axios, React Router DOM |
| **Backend** | Node.js, Express.js, Mongoose ODM, JSON Web Token (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv |
| **Database** | MongoDB (Local MongoDB Server or MongoDB Atlas) |
| **Tooling & VCS** | Git, GitHub, Postman, npm |

---

## 📂 Project Architecture & Folder Structure

The project strictly follows the recommended modular architecture specified in the assignment guide:

```text
MERN Integration/
│
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js          # Axios client with JWT request/response interceptors
│   │   ├── components/
│   │   │   ├── CustomerModal.jsx   # Add / Edit customer modal form with validation
│   │   │   ├── Navbar.jsx          # Responsive navigation bar with user profile badge
│   │   │   └── ProtectedRoute.jsx  # Route guard for authenticated pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user auth state and login/register methods
│   │   ├── pages/
│   │   │   ├── Login.jsx       # User authentication / sign in page
│   │   │   ├── Register.jsx    # User registration page
│   │   │   └── Userdata.jsx    # CRM Customer dashboard (Table, search, filters, CRUD)
│   │   ├── App.jsx             # React Router route definitions
│   │   ├── index.css           # Tailwind CSS imports & global styles
│   │   ├── index.jsx           # Application entry point
│   │   └── main.jsx            # Vite fallback entry
│   ├── index.html              # HTML shell
│   ├── package.json            # Client scripts & dependencies
│   └── vite.config.js          # Vite config with Tailwind plugin & API proxy
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── CustomerController.js # getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer
│   │   └── UserController.js     # registerUser, loginUser, getUserProfile
│   ├── middleware/
│   │   ├── Auth.js             # JWT Bearer token authentication middleware
│   │   └── validation.js       # Input validation middleware for auth & customers
│   ├── models/
│   │   ├── CustomerModel.js    # Customer Mongoose schema & indexes
│   │   └── UserModel.js        # User Mongoose schema & password compare helper
│   ├── routes/
│   │   ├── CustomerRoutes.js   # /api/customers CRUD routes
│   │   └── UserRoutes.js       # /api/users auth routes
│   ├── app.js                  # Express app, CORS, routes & global error handler
│   └── package.json            # Server scripts & dependencies
│
├── .env                        # Local environment variables (git-ignored)
├── .env.example                # Template of required environment variables
├── .gitignore                  # Git ignore rules for node_modules, build, and secrets
├── package.json                # Root scripts to orchestrate client and server
└── README.md                   # Complete assignment documentation
```

---

## ⚙️ Prerequisites

Make sure the following software is installed on your workstation:
1. **Node.js** (v18.0.0 or higher recommended)
2. **npm** (v9.0.0 or higher)
3. **MongoDB** (Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` or a free MongoDB Atlas cluster connection URI)
4. **Git**
5. **Postman** (for API testing)

---

## 📦 Installation & Setup

### 1. Clone or Open the Repository
```bash
git clone <your-repository-url>
cd "MERN Integration"
```

### 2. Configure Environment Variables
Create a `.env` file in the project root (or verify the provided `.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/crm_database
JWT_SECRET=supersecret_mern_crm_jwt_key_2026
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/crm_database?retryWrites=true&w=majority`).*

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

---

## 🚀 Running the Application

You can run both services independently or together:

### Option A: Running from Root (Recommended)
Open two terminal windows in the project root:

**Terminal 1 (Backend Server):**
```bash
npm run server
```
*Output: `Server running in development mode on port 5000` & `MongoDB Connected: 127.0.0.1`*

**Terminal 2 (Frontend Client):**
```bash
npm run client
```
*Output: `VITE ready in ... ➜ Local: http://localhost:3000/`*

---

### Option B: Running from Respective Directories
**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm start
# or: npm run dev
```

Open your browser and navigate to: **`http://localhost:3000`**.

---

## 📡 RESTful API Documentation

Base URL: `http://localhost:5000/api`

### 1. Authentication Endpoints

#### Register a New User
- **Method:** `POST`
- **Endpoint:** `/users/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Sebastian Roshan",
    "email": "sebastian@example.com",
    "password": "password123",
    "role": "Sales Agent"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "_id": "6720db1...",
      "name": "Sebastian Roshan",
      "email": "sebastian@example.com",
      "role": "Sales Agent"
    }
  }
  ```

#### Authenticate / Login User
- **Method:** `POST`
- **Endpoint:** `/users/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "sebastian@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged in successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": {
      "_id": "6720db1...",
      "name": "Sebastian Roshan",
      "email": "sebastian@example.com",
      "role": "Sales Agent"
    }
  }
  ```

#### Get Current User Profile
- **Method:** `GET`
- **Endpoint:** `/users/profile` (or `/users/me`)
- **Access:** Private (`Authorization: Bearer <token>`)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "_id": "6720db1...",
      "name": "Sebastian Roshan",
      "email": "sebastian@example.com",
      "role": "Sales Agent",
      "createdAt": "2026-10-29T08:00:00.000Z"
    }
  }
  ```

---

### 2. CRM Customer Endpoints (All Protected)

#### Fetch All Customers (with optional search and filter)
- **Method:** `GET`
- **Endpoint:** `/customers?search=Acme&status=Qualified`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "customers": [
      {
        "_id": "6720dc2...",
        "name": "Acme Corp",
        "email": "contact@acme.com",
        "phone": "+1 555-123-4567",
        "company": "Acme Corporation",
        "status": "Qualified",
        "source": "LinkedIn",
        "notes": "Discussed Q4 expansion.",
        "createdBy": {
          "_id": "6720db1...",
          "name": "Sebastian Roshan",
          "email": "sebastian@example.com"
        },
        "createdAt": "2026-10-29T08:05:00.000Z"
      }
    ]
  }
  ```

#### Create New Customer
- **Method:** `POST`
- **Endpoint:** `/customers`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "+1 555-123-4567",
    "company": "Acme Corporation",
    "status": "Lead",
    "source": "Website",
    "notes": "Initial inquiry from contact form"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Customer added successfully!",
    "customer": { ... }
  }
  ```

#### Get Customer By ID
- **Method:** `GET`
- **Endpoint:** `/customers/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK)**

#### Update Customer
- **Method:** `PUT`
- **Endpoint:** `/customers/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Fields to modify
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Customer updated successfully!",
    "customer": { ... }
  }
  ```

#### Delete Customer
- **Method:** `DELETE`
- **Endpoint:** `/customers/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Customer deleted successfully!"
  }
  ```

---

## 🧪 Postman Testing Guide

1. **Register User**:
   - URL: `POST http://localhost:5000/api/users/register`
   - Body -> raw (JSON): Name, email, password.
   - Click **Send**. Copy the `token` from the response.

2. **Login User**:
   - URL: `POST http://localhost:5000/api/users/login`
   - Body -> raw (JSON): email, password.
   - Verify token returned with status `200 OK`.

3. **Get Protected Profile**:
   - URL: `GET http://localhost:5000/api/users/profile`
   - Auth tab -> Type: **Bearer Token** -> paste `token`.
   - Click **Send** -> Expect user JSON.

4. **Add Customer**:
   - URL: `POST http://localhost:5000/api/customers`
   - Auth tab -> Bearer Token.
   - Body -> raw (JSON): Customer fields (`name`, `email`, `phone`, `company`).
   - Click **Send** -> Expect `201 Created`. Copy `_id`.

5. **Fetch All Customers**:
   - URL: `GET http://localhost:5000/api/customers`
   - Auth tab -> Bearer Token.
   - Click **Send** -> Expect customer array.

6. **Update Customer**:
   - URL: `PUT http://localhost:5000/api/customers/<id>`
   - Body -> raw (JSON): Updated fields.
   - Click **Send** -> Expect `200 OK`.

7. **Delete Customer**:
   - URL: `DELETE http://localhost:5000/api/customers/<id>`
   - Click **Send** -> Expect `Customer deleted successfully!`.

---

## 🎯 Video Demonstration Guide (1-2 Minutes)

Follow this step-by-step checklist when recording your screen to earn full marks for the **Video Submission** criterion:

1. **Terminal / Server Startup**:
   - Show the backend running on port 5000 connected to MongoDB.
   - Show Vite dev server running on `http://localhost:3000`.

2. **User Registration & Validation**:
   - Open browser at `http://localhost:3000/register`.
   - Try submitting with empty fields to demonstrate **instant client-side validation errors**.
   - Fill valid credentials (Name, Email, Password, Role) and click **Register**.
   - Notice the automatic redirect to the Customer Dashboard (`/userdata`).

3. **Customer Management (CRUD)**:
   - **Create**: Click **"Add Customer"**. Fill the form (Name, Email, Phone, Company, Status, Source, Notes) and click **"Add Customer"**. Notice the green success alert and the customer appearing in the table/cards.
   - **Search & Filter**: Type into the search input to filter by name/company. Select a pipeline status from the dropdown to demonstrate dynamic filtering.
   - **Update**: Click **"Edit"** on a customer. Change the pipeline status to **"Closed Won"** or edit their phone number. Click **"Save Changes"**. Observe the updated badge instantly reflecting the change.
   - **Delete**: Click **"Delete"**. Show the confirmation modal. Click **"Yes, Delete"**. Notice the item removed and the success toast.

4. **Logout & Protected Route Test**:
   - Click **"Logout"** in the navigation bar.
   - Try typing `http://localhost:3000/userdata` directly in the address bar.
   - Show that it automatically redirects back to `/login` because the session is protected.

5. **Login**:
   - Sign in with your registered credentials.
   - Show successful login and access back to the customer workspace.

---

## 📊 Evaluation Rubric Self-Check

| # | Skill / Component | Criteria | Status |
|---|---|---|:---:|
| 1 | **Backend CRUD & Auth** | All CRUD endpoints, bcrypt hashing, JWT generation | ✅ Complete |
| 2 | **Database Connectivity** | MongoDB connection via Mongoose with clean schemas | ✅ Complete |
| 3 | **Validation & Error Handling** | Validation middleware with status codes & clear errors | ✅ Complete |
| 4 | **Modular Backend Structure** | Controllers, Routes, Models, Middleware separated | ✅ Complete |
| 5 | **Frontend Folder Structure** | Components, Pages, and Routes cleanly organized | ✅ Complete |
| 6 | **UI Design & Styling** | Tailwind CSS with responsive layout across all screens | ✅ Complete |
| 7 | **Frontend CRUD & Auth** | Functional Register, Login, and Customer forms | ✅ Complete |
| 8 | **Frontend Form Validation** | Real-time input checking with React components | ✅ Complete |
| 9 | **Video Submission** | Step-by-step demo instructions prepared | ✅ Complete |
| 10| **GitHub Usage & Documentation** | Meaningful commits, clean repo, comprehensive README | ✅ Complete |

---

*Developed by Sebastian Roshan for Entri Full Stack Development V8 Assignment 14.*
