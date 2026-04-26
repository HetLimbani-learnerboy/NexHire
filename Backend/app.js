const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ── Centralized pool (no circular dependency) ─────────────────────────────────
const pool = require("./config/db");

// ── Import table-creation functions ───────────────────────────────────────────
const { createJobsTable } = require("./models/Job");

// ── Import route files ────────────────────────────────────────────────────────
const jobRoutes = require("./routes/jobRoutes");

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Database Initialisation ───────────────────────────────────────────────────
const initDB = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log("✅ Connected to Neon database successfully");

        // Auto-create tables on startup
        await createJobsTable();
        console.log("✅ Jobs table ready");
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

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// Export for any file that still imports from app.js (backwards compat)
module.exports = { app, pool };