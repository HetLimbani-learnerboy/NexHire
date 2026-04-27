const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

// ── Centralized pool (no circular dependency) ─────────────────────────────────
const pool = require("./config/db");

// ── Import table-creation functions ───────────────────────────────────────────
const { createJobsTable } = require("./models/Job");
const { createCandidatesTable } = require("./models/Candidate");
const { createInterviewsTable } = require("./models/Interview");
const { createCandidateStatusTable } = require("./models/CandidateStatus");

// ── Import route files ────────────────────────────────────────────────────────
const jobRoutes = require("./routes/jobRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/admin", adminRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ── Database Initialisation ───────────────────────────────────────────────────
const initDB = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log("✅ Connected to Neon database successfully");

        // // Auto-create tables on startup (order matters for FK deps)
        // await createJobsTable();
        // console.log("✅ Jobs table ready");

        // await createCandidatesTable();
        // console.log("✅ Candidates table ready");

        // await createCandidateStatusTable();
        // console.log("✅ CandidateStatus table ready");

        // await createInterviewsTable();
        // console.log("✅ Interviews table ready");
    } catch (err) {
        console.error("❌ Database initialisation error:", err);
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