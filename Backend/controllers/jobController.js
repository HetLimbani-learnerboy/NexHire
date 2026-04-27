// ─── Jobs Controller ───────────────────────────────────────────────────────────
// Full CRUD operations for the jobs table.
// Every handler is wrapped in try/catch so the server never crashes on a bad query.

const pool = require("../config/db");

// ── GET  /api/jobs  ──────────────────────────────────────────────────────────
// Returns all jobs, newest first.  Supports optional query-string filters:
//   ?status=Open&priority=High&search=react&page=1&limit=10
const getJobs = async (req, res) => {
    try {
        const { status, priority, search, page = 1, limit = 50 } = req.query;

        let query = "SELECT * FROM jobs WHERE 1=1";
        const values = [];
        let idx = 1;

        if (status && status !== "All") {
            query += ` AND status = $${idx++}`;
            values.push(status);
        }
        if (priority && priority !== "All") {
            query += ` AND priority = $${idx++}`;
            values.push(priority);
        }
        if (search) {
            query += ` AND (title ILIKE $${idx} OR department ILIKE $${idx})`;
            values.push(`%${search}%`);
            idx++;
        }

        // Count for pagination
        const countResult = await pool.query(
            query.replace("SELECT *", "SELECT COUNT(*)"),
            values
        );
        const totalCount = parseInt(countResult.rows[0].count, 10);

        // Add ordering + pagination
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        query += ` ORDER BY id DESC LIMIT $${idx++} OFFSET $${idx++}`;
        values.push(parseInt(limit, 10), offset);

        const data = await pool.query(query, values);

        res.json({
            success: true,
            jobs: data.rows,
            pagination: {
                currentPage: parseInt(page, 10),
                totalPages: Math.ceil(totalCount / parseInt(limit, 10)),
                totalCount,
            },
        });
    } catch (err) {
        console.error("❌ getJobs error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch jobs" });
    }
};

// ── GET  /api/jobs/:id  ──────────────────────────────────────────────────────
// Returns a single job by id.
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);

        if (data.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.json({ success: true, job: data.rows[0] });
    } catch (err) {
        console.error("❌ getJobById error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch job" });
    }
};

// ── POST  /api/jobs  ─────────────────────────────────────────────────────────
// Creates a new job.  Accepts all columns from the schema.
const createJob = async (req, res) => {
    try {
        const {
            title,
            department,
            experience_level,
            skills,
            openings,
            budget,
            location,
            employment_type,
            priority,
            deadline,
            status,
            description,
            created_by,
        } = req.body;

        if (!title) {
            return res
                .status(400)
                .json({ success: false, message: "Job title is required" });
        }

        const result = await pool.query(
            `INSERT INTO jobs
                (title, department, experience_level, skills, openings,
                 budget, location, employment_type, priority, deadline,
                 status, description, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
             RETURNING *`,
            [
                title,
                department || null,
                experience_level || null,
                skills || null,
                openings || 1,
                budget || null,
                location || null,
                employment_type || null,
                priority || "Medium",
                deadline || null,
                status || "Open",
                description || null,
                created_by || null,
            ]
        );

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job: result.rows[0],
        });
    } catch (err) {
        console.error("❌ createJob error:", err);
        res.status(500).json({ success: false, message: "Failed to create job" });
    }
};

// ── PUT  /api/jobs/:id  ──────────────────────────────────────────────────────
// Updates any/all fields of an existing job.  Only provided fields are changed.
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if job exists
        const existing = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        const allowedFields = [
            "title",
            "department",
            "experience_level",
            "skills",
            "openings",
            "budget",
            "location",
            "employment_type",
            "priority",
            "deadline",
            "status",
            "description",
        ];

        const setClauses = [];
        const values = [];
        let idx = 1;

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                setClauses.push(`${field} = $${idx++}`);
                values.push(req.body[field]);
            }
        }

        if (setClauses.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "No fields to update" });
        }

        // Always bump updated_at
        setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const result = await pool.query(
            `UPDATE jobs SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
            values
        );

        res.json({
            success: true,
            message: "Job updated successfully",
            job: result.rows[0],
        });
    } catch (err) {
        console.error("❌ updateJob error:", err);
        res.status(500).json({ success: false, message: "Failed to update job" });
    }
};

// ── PATCH  /api/jobs/:id/status  ─────────────────────────────────────────────
// Quick-action to change only the status (Open / Closed / On Hold / Pending).
const updateJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Open", "Closed", "On Hold", "Pending Approval"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
        }

        const result = await pool.query(
            `UPDATE jobs SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.json({
            success: true,
            message: `Job status changed to ${status}`,
            job: result.rows[0],
        });
    } catch (err) {
        console.error("❌ updateJobStatus error:", err);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

// ── DELETE  /api/jobs/:id  ───────────────────────────────────────────────────
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM jobs WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.json({ success: true, message: "Job deleted successfully" });
    } catch (err) {
        console.error("❌ deleteJob error:", err);
        res.status(500).json({ success: false, message: "Failed to delete job" });
    }
};

// ── GET  /api/jobs/stats  ────────────────────────────────────────────────────
// Summary counts for the dashboard cards.
const getJobStats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*)                                         AS total,
                COUNT(*) FILTER (WHERE status = 'Open')          AS open,
                COUNT(*) FILTER (WHERE status = 'Closed')        AS closed,
                COUNT(*) FILTER (WHERE status = 'On Hold')       AS on_hold,
                COUNT(*) FILTER (WHERE status = 'Pending Approval') AS pending,
                COUNT(*) FILTER (WHERE priority = 'High')        AS high_priority
            FROM jobs
        `);

        res.json({ success: true, stats: result.rows[0] });
    } catch (err) {
        console.error("❌ getJobStats error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
};

module.exports = {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    updateJobStatus,
    deleteJob,
    getJobStats,
};
