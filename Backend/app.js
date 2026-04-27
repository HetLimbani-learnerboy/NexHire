const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Pool } = require("pg");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const managerRoutes = require("./routes/managerRoutes");
require("dotenv").config();

// ── Centralized pool (no circular dependency) ─────────────────────────────────
const pool = require("./config/db");

// ── Import table-creation functions ───────────────────────────────────────────
const { createUsersTable } = require("./models/User");
const { createJobsTable } = require("./models/Job");
const { createCandidatesTable } = require("./models/Candidate");
const { createInterviewsTable } = require("./models/Interview");
const { createCandidateStatusTable } = require("./models/CandidateStatus");
const { createDemoUsers } = require("./seed");

// ── Import route files ────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

<<<<<<< HEAD
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/manager", managerRoutes);
=======
// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
>>>>>>> 9c896c23ed50f1ba724062b4dde8fb5a0531b81d

// ── Database Initialisation ───────────────────────────────────────────────────
const initDB = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log("✅ Connected to Neon database successfully");

<<<<<<< HEAD
        // Conditionally create tables if they do not exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS vendors (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                company_name VARCHAR(150),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                department VARCHAR(100),
                location VARCHAR(100),
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS job_vendors (
                job_id INTEGER REFERENCES jobs(id),
                vendor_id INTEGER REFERENCES vendors(id),
                PRIMARY KEY (job_id, vendor_id)
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                phone VARCHAR(50),
                job_id INTEGER REFERENCES jobs(id),
                vendor_id INTEGER REFERENCES vendors(id),
                status VARCHAR(50) DEFAULT 'Pending Review',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Database tables verified/created");
    } catch (err) {
        console.error("❌ Database connection/setup error:", err);
=======
        // Auto-create tables on startup (order matters for FK deps)
        await createUsersTable();
        console.log("✅ Users table ready");

        await createJobsTable();
        console.log("✅ Jobs table ready");

        await createCandidatesTable();
        console.log("✅ Candidates table ready");

        await createCandidateStatusTable();
        console.log("✅ CandidateStatus table ready");

        await createInterviewsTable();
        console.log("✅ Interviews table ready");

        // Create demo users
        await createDemoUsers();
        console.log("✅ Demo users initialized");
    } catch (err) {
        console.error("❌ Database initialisation error:", err);
>>>>>>> 9c896c23ed50f1ba724062b4dde8fb5a0531b81d
    } finally {
        if (client) client.release();
    }
};

initDB();

// ── Health-check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "NexHire ATS Backend Running Successfully",
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/interviews", interviewRoutes);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// Export for any file that still imports from app.js (backwards compat)
module.exports = { app, pool };