// ─── Candidates Controller ─────────────────────────────────────────────────────
const pool = require("../config/db");

// GET /api/candidates — list with filters + pagination
const getCandidates = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 50 } = req.query;
        let query = "SELECT * FROM candidates WHERE 1=1";
        const values = [];
        let idx = 1;

        if (status && status !== "All") {
            query += ` AND status = $${idx++}`;
            values.push(status);
        }
        if (search) {
            query += ` AND (full_name ILIKE $${idx} OR job_title ILIKE $${idx} OR vendor_name ILIKE $${idx})`;
            values.push(`%${search}%`);
            idx++;
        }

        const countResult = await pool.query(query.replace("SELECT *", "SELECT COUNT(*)"), values);
        const totalCount = parseInt(countResult.rows[0].count, 10);

        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        query += ` ORDER BY id DESC LIMIT $${idx++} OFFSET $${idx++}`;
        values.push(parseInt(limit, 10), offset);

        const data = await pool.query(query, values);

        res.json({
            success: true,
            candidates: data.rows,
            pagination: {
                currentPage: parseInt(page, 10),
                totalPages: Math.ceil(totalCount / parseInt(limit, 10)),
                totalCount,
            },
        });
    } catch (err) {
        console.error("❌ getCandidates error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch candidates" });
    }
};

// GET /api/candidates/:id
const getCandidateById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await pool.query("SELECT * FROM candidates WHERE id = $1", [id]);
        if (data.rows.length === 0)
            return res.status(404).json({ success: false, message: "Candidate not found" });
        res.json({ success: true, candidate: data.rows[0] });
    } catch (err) {
        console.error("❌ getCandidateById error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch candidate" });
    }
};

// POST /api/candidates
const createCandidate = async (req, res) => {
    try {
        const { full_name, email, phone, job_title, job_id, vendor_name, vendor_id, status, notes, is_duplicate } = req.body;
        if (!full_name)
            return res.status(400).json({ success: false, message: "Candidate name is required" });

        const result = await pool.query(
            `INSERT INTO candidates (full_name, email, phone, job_title, job_id, vendor_name, vendor_id, status, notes, is_duplicate)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [full_name, email || null, phone || null, job_title || null, job_id || null, vendor_name || null, vendor_id || null, status || "Submitted", notes || null, is_duplicate || false]
        );

        // Log the initial status in candidate_status
        await pool.query(
            `INSERT INTO candidate_status (candidate_id, status, remarks) VALUES ($1, $2, $3)`,
            [result.rows[0].id, status || "Submitted", "Initial submission"]
        );

        res.status(201).json({ success: true, message: "Candidate created", candidate: result.rows[0] });
    } catch (err) {
        console.error("❌ createCandidate error:", err);
        res.status(500).json({ success: false, message: "Failed to create candidate" });
    }
};

// PUT /api/candidates/:id
const updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await pool.query("SELECT * FROM candidates WHERE id = $1", [id]);
        if (existing.rows.length === 0)
            return res.status(404).json({ success: false, message: "Candidate not found" });

        const allowedFields = ["full_name", "email", "phone", "job_title", "job_id", "vendor_name", "vendor_id", "status", "notes", "is_duplicate"];
        const setClauses = [];
        const values = [];
        let idx = 1;

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                setClauses.push(`${field} = $${idx++}`);
                values.push(req.body[field]);
            }
        }
        if (setClauses.length === 0)
            return res.status(400).json({ success: false, message: "No fields to update" });

        setClauses.push("updated_at = CURRENT_TIMESTAMP");
        values.push(id);

        const result = await pool.query(
            `UPDATE candidates SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
            values
        );
        res.json({ success: true, message: "Candidate updated", candidate: result.rows[0] });
    } catch (err) {
        console.error("❌ updateCandidate error:", err);
        res.status(500).json({ success: false, message: "Failed to update candidate" });
    }
};

// PATCH /api/candidates/:id/status — quick pipeline stage change
const updateCandidateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ["Submitted", "Screened", "Interview", "Offered", "Hired", "Rejected"];

        if (!validStatuses.includes(status))
            return res.status(400).json({ success: false, message: `Invalid status. Must be: ${validStatuses.join(", ")}` });

        const result = await pool.query(
            "UPDATE candidates SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            [status, id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ success: false, message: "Candidate not found" });

        // Update existing record to maintain exactly one record per candidate, or insert if missing
        const statusCheck = await pool.query("SELECT id FROM candidate_status WHERE candidate_id = $1", [id]);
        if (statusCheck.rows.length > 0) {
            await pool.query(
                "UPDATE candidate_status SET status = $1, remarks = $2, updated_at = CURRENT_TIMESTAMP WHERE candidate_id = $3",
                [status, "Status updated from pipeline UI", id]
            );
        } else {
            await pool.query(
                "INSERT INTO candidate_status (candidate_id, status, remarks) VALUES ($1, $2, $3)",
                [id, status, "Status updated from pipeline UI"]
            );
        }

        res.json({ success: true, message: `Status changed to ${status}`, candidate: result.rows[0] });
    } catch (err) {
        console.error("❌ updateCandidateStatus error:", err);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

// DELETE /api/candidates/:id
const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM candidates WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0)
            return res.status(404).json({ success: false, message: "Candidate not found" });
        res.json({ success: true, message: "Candidate deleted" });
    } catch (err) {
        console.error("❌ deleteCandidate error:", err);
        res.status(500).json({ success: false, message: "Failed to delete candidate" });
    }
};

// GET /api/candidates/stats
const getCandidateStats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*)                                          AS total,
                COUNT(*) FILTER (WHERE status = 'Submitted')      AS submitted,
                COUNT(*) FILTER (WHERE status = 'Screened')       AS screened,
                COUNT(*) FILTER (WHERE status = 'Interview')      AS interview,
                COUNT(*) FILTER (WHERE status = 'Offered')        AS offered,
                COUNT(*) FILTER (WHERE status = 'Hired')          AS hired,
                COUNT(*) FILTER (WHERE status = 'Rejected')       AS rejected
            FROM candidates
        `);
        res.json({ success: true, stats: result.rows[0] });
    } catch (err) {
        console.error("❌ getCandidateStats error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
};

module.exports = { getCandidates, getCandidateById, createCandidate, updateCandidate, updateCandidateStatus, deleteCandidate, getCandidateStats };
