# NexHire — Backend Structure Foundation

**Project:** Internal ATS for Vendor Management  
**Prepared for:** Mekanism Technologies  
**Date:** April 2026 | **Version:** 1.0

---

## 1. Technology Decisions

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Runtime | **Node.js v20+** | Non-blocking I/O, large ecosystem, team familiarity |
| Framework | **Express.js v5** | Minimal, flexible, proven at scale |
| Database | **PostgreSQL** (Neon serverless) | ACID compliance, relational integrity for ATS data, `pg` driver |
| ORM/Driver | **`pg` (node-postgres)** | Direct SQL control, no ORM overhead, raw query performance |
| Auth | **JWT** (`jsonwebtoken`) | Stateless authentication, 7-day token expiry |
| Password Hashing | **bcryptjs** | Industry-standard, 10-round salt |
| File Upload | **Multer** | Multipart form handling for resume uploads |
| Environment | **dotenv** | Secure config management via `.env` |
| Dev Tooling | **Nodemon** | Auto-restart on file changes during development |

---

## 2. Project Directory Structure

```
Backend/
├── app.js                    # Express app entry point, middleware, DB init, server start
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables (gitignored)
├── .env.example              # Template for environment setup
├── seed.js                   # Demo user seeder (admin, hr, vendor, manager)
├── seed_hr_data.js           # Sample HR pipeline data seeder
│
├── config/
│   └── db.js                 # Centralized PostgreSQL connection pool (Neon)
│
├── middleware/
│   ├── authMiddleware.js     # JWT token verification middleware
│   └── roleMiddleware.js     # Role-based access control middleware
│
├── models/                   # Table creation & schema migration scripts
│   ├── User.js               # users table
│   ├── Job.js                # jobs table + schema migrations
│   ├── Candidate.js          # candidates table + migrations
│   ├── CandidateStatus.js    # candidate_status audit log table
│   ├── Interview.js          # interviews table (with embedded feedback)
│   ├── Vendor.js             # vendors table
│   ├── JobVendor.js          # job_vendors junction table
│   ├── Review.js             # reviews table (manager candidate reviews)
│   ├── Selection.js          # selections table (final hire decisions)
│   ├── Feedback.js           # feedback table (interview feedback)
│   └── Notification.js       # notifications table
│
├── controllers/              # Business logic handlers
│   ├── authController.js     # Register, Login, Get Current User
│   ├── adminController.js    # Admin dashboard stats, user CRUD
│   ├── jobController.js      # Job CRUD, search, filter, status management
│   ├── candidateController.js# Candidate CRUD, status updates, pipeline queries
│   ├── vendorController.js   # Vendor CRUD, performance metrics
│   ├── interviewController.js# Interview scheduling, feedback, status management
│   ├── managerController.js  # Manager dashboard stats, pending reviews
│   ├── dashboardController.js# Generic dashboard statistics
│   ├── reviewController.js   # Candidate review actions (approve/reject)
│   ├── selectionController.js# Final selection & offer management
│   └── userController.js     # User profile operations
│
└── routes/                   # API route definitions
    ├── authRoutes.js          # POST /login, /register, GET /me
    ├── adminRoutes.js         # /api/admin/*
    ├── jobRoutes.js           # /api/jobs/*
    ├── candidateRoutes.js     # /api/candidates/*
    ├── vendorRoutes.js        # /api/vendors/*
    ├── vendorDataRoutes.js    # /api/vendor/* (vendor-specific data)
    ├── interviewRoutes.js     # /api/interviews/*
    ├── managerRoutes.js       # /api/manager/*
    ├── dashboardRoutes.js     # /api/dashboard/*
    ├── reviewRoutes.js        # /api/reviews/*
    ├── selectionRoutes.js     # /api/selections/*
    └── userRoutes.js          # /api/users/*
```

---

## 3. Database Schema (ERD)

### 3.1 Entity Relationship Diagram

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│  users   │       │  job_vendors  │       │  vendors │
│──────────│       │──────────────│       │──────────│
│ id (PK)  │       │ id (PK)      │       │ id (PK)  │
│ full_name│       │ job_id (FK)──│──┐    │ company  │
│ email    │       │ vendor_id(FK)│──│──→ │ contact  │
│ password │       │ assigned_at  │  │    │ email    │
│ role     │       └──────────────┘  │    │ rating   │
│ phone    │                         │    │ scores   │
│ is_active│    ┌────────────────────┘    └──────────┘
│ created  │    │
└────┬─────┘    │    ┌──────────────┐
     │          └──→ │    jobs      │
     │               │──────────────│
     │               │ id (PK)      │
     │               │ title        │
     │               │ department   │
     │               │ skills       │
     │               │ budget       │
     │               │ deadline     │
     │               │ status       │
     │               │ created_by   │
     │               └──────┬───────┘
     │                      │
     │          ┌───────────┘
     │          │
     │    ┌─────▼────────┐     ┌──────────────────┐
     │    │  candidates  │     │ candidate_status  │
     │    │──────────────│     │──────────────────│
     │    │ id (PK)      │←────│ candidate_id(FK) │
     │    │ full_name    │     │ status           │
     │    │ email        │     │ remarks          │
     │    │ job_id (FK)  │     │ updated_by (FK)  │
     │    │ vendor_id    │     │ updated_at       │
     │    │ status       │     └──────────────────┘
     │    │ resume_url   │
     │    │ is_duplicate │
     │    └──────┬───────┘
     │           │
     │    ┌──────▼───────┐     ┌──────────────┐
     │    │  interviews  │     │   feedback   │
     │    │──────────────│     │──────────────│
     │    │ id (PK)      │←────│interview_id  │
     │    │candidate_id  │     │candidate_id  │
     │    │ date / time  │     │reviewer_id   │
     │    │ mode / link  │     │ rating (1-5) │
     │    │ status       │     │ strengths    │
     │    │ fb_rating    │     │ concerns     │
     │    │ fb_remarks   │     │ recommend    │
     │    └──────────────┘     └──────────────┘
     │
     │    ┌──────────────┐     ┌──────────────┐
     │    │   reviews    │     │  selections  │
     │    │──────────────│     │──────────────│
     │    │ id (PK)      │     │ id (PK)      │
     │    │candidate_id  │     │candidate_id  │
     │    │candidate_name│     │candidate_name│
     │    │ role         │     │ role         │
     │    │ experience   │     │ avg_score    │
     │    │ source       │     │ status       │
     │    │ status       │     │ offer_salary │
     │    │reviewer_notes│     │ joining_date │
     │    └──────────────┘     └──────────────┘
     │
     │    ┌──────────────┐
     └──→ │notifications │
          │──────────────│
          │ id (PK)      │
          │ user_id (FK) │
          │ title        │
          │ message      │
          │ is_read      │
          └──────────────┘
```

### 3.2 Table Definitions

| Table | Columns | Purpose |
|-------|---------|---------|
| `users` | id, full_name, email, password_hash, role, phone, avatar, is_active, created_at | All system users across all roles |
| `jobs` | id, title, department, experience_level, skills, openings, budget, location, employment_type, priority, deadline, status, description, created_by, created_at, updated_at | Job requisitions |
| `candidates` | id, full_name, email, phone, job_title, job_id, vendor_name, vendor_id, status, resume_url, is_duplicate, notes, submitted_at, created_at, updated_at | Candidate submissions |
| `candidate_status` | id, candidate_id (FK), status, remarks, updated_by (FK), updated_at | Audit trail of status changes |
| `interviews` | id, candidate_id, candidate_name, role, interview_date, interview_time, mode, meeting_link, status, feedback_rating, feedback_remarks, feedback_recommendation, created_at, updated_at | Interview scheduling & embedded feedback |
| `vendors` | id, company_name, contact_person, email, phone, address, agreement_file, rating, turnaround_score, closure_score, status, created_at | Vendor profiles & performance |
| `job_vendors` | id, job_id (FK), vendor_id (FK), assigned_at | Many-to-many: jobs ↔ vendors |
| `reviews` | id, candidate_id, candidate_name, role, experience, source, status, reviewer_notes, created_at, updated_at | Manager candidate reviews |
| `selections` | id, candidate_id, candidate_name, role, avg_score, recommendation, status, offer_salary, joining_date, offer_notes, created_at, updated_at | Final hire decisions |
| `feedback` | id, interview_id (FK), candidate_id (FK), reviewer_id (FK), rating, strengths, concerns, recommendation, created_at | Detailed interview feedback |
| `notifications` | id, user_id (FK), title, message, is_read, created_at | In-app notifications |

---

## 4. API Route Map

### 4.1 Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create new user account |
| POST | `/api/auth/login` | No | Authenticate & receive JWT |
| GET | `/api/auth/me` | JWT | Get current authenticated user |

### 4.2 Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | JWT+Admin | Dashboard statistics |
| GET | `/api/admin/users` | JWT+Admin | List all users |
| POST | `/api/admin/users` | JWT+Admin | Create user |
| PUT | `/api/admin/users/:id` | JWT+Admin | Update user |
| DELETE | `/api/admin/users/:id` | JWT+Admin | Delete user |

### 4.3 Jobs (`/api/jobs`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | JWT | List all jobs (with filters) |
| GET | `/api/jobs/:id` | JWT | Get job details |
| POST | `/api/jobs` | JWT+Admin/HR | Create job |
| PUT | `/api/jobs/:id` | JWT+Admin/HR | Update job |
| DELETE | `/api/jobs/:id` | JWT+Admin | Delete job |
| PUT | `/api/jobs/:id/status` | JWT | Update job status |

### 4.4 Candidates (`/api/candidates`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/candidates` | JWT | List candidates |
| GET | `/api/candidates/:id` | JWT | Get candidate details |
| POST | `/api/candidates` | JWT | Submit candidate |
| PUT | `/api/candidates/:id` | JWT | Update candidate |
| PUT | `/api/candidates/:id/status` | JWT+HR/Admin | Update status |
| DELETE | `/api/candidates/:id` | JWT+Admin | Delete candidate |

### 4.5 Interviews (`/api/interviews`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/interviews` | JWT | List interviews |
| POST | `/api/interviews` | JWT+HR | Schedule interview |
| PUT | `/api/interviews/:id` | JWT | Update interview |
| PUT | `/api/interviews/:id/feedback` | JWT+Manager | Submit feedback |

### 4.6 Vendors (`/api/vendors`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/vendors` | JWT | List vendors |
| POST | `/api/vendors` | JWT+Admin | Create vendor |
| PUT | `/api/vendors/:id` | JWT | Update vendor |

### 4.7 Vendor Data (`/api/vendor`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/vendor/dashboard` | JWT+Vendor | Vendor dashboard stats |
| GET | `/api/vendor/jobs` | JWT+Vendor | Vendor's assigned jobs |
| GET | `/api/vendor/candidates` | JWT+Vendor | Vendor's submitted candidates |
| GET | `/api/vendor/profile` | JWT+Vendor | Vendor profile & metrics |

### 4.8 Manager (`/api/manager`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/manager/stats` | JWT+Manager | Dashboard statistics |
| GET | `/api/manager/candidates` | JWT+Manager | Candidates to review |

### 4.9 Reviews & Selections
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reviews` | JWT | List reviews |
| POST | `/api/reviews` | JWT+Manager | Submit review |
| GET | `/api/selections` | JWT | List selections |
| POST | `/api/selections` | JWT+Manager | Create selection |

---

## 5. Middleware & Security Architecture

### 5.1 Authentication Flow
```
Client Request → authMiddleware → Route Handler → Response
    │                   │
    │  1. Extract       │  2. jwt.verify(token, secret)
    │     Bearer token  │  3. Attach req.user = decoded
    │  from header      │  4. Call next() or 401 error
```

### 5.2 Role-Based Access Control
```
authMiddleware → roleMiddleware("admin","hr") → Controller
                       │
                 Check req.headers.role
                 against allowedRoles array
                 → 403 if not authorized
```

### 5.3 Security Measures
| Measure | Implementation |
|---------|----------------|
| Password hashing | bcryptjs with 10-round salt |
| JWT tokens | 7-day expiry, secret from env |
| CORS | Enabled via `cors()` middleware |
| Input parsing | `express.json()` + `express.urlencoded()` |
| SSL/TLS | Database connection via SSL (`rejectUnauthorized: false`) |
| Connection pooling | Max 10 connections, 10s connect timeout, 30s idle timeout |

---

## 6. Database Initialization Flow

```
app.js startup
    │
    ├── 1. Connect to Neon PostgreSQL (pool.connect())
    ├── 2. Create tables in FK-dependency order:
    │       users → jobs → candidates → candidate_status → interviews
    ├── 3. Run schema migrations (ADD COLUMN IF NOT EXISTS)
    ├── 4. Seed demo users (admin, hr, vendor, manager)
    └── 5. Start Express server on PORT 5001
```

---

## 7. Environment Configuration

```env
# .env.example
DATABASE_URL=postgresql://user:pass@host/neondb?sslmode=require
JWT_SECRET=your_super_secret_key_here
PORT=5001
```

---

*Document End — NexHire Backend Structure Foundation v1.0*
