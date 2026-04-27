// ─── Interviews Controller ─────────────────────────────────────────────────────
const pool = require("../config/db");

// GET /api/interviews
const getInterviews = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = "SELECT * FROM interviews WHERE 1=1";
        const values = [];
        let idx = 1;

        if (status && status !== "All") {
            query += ` AND status = $${idx++}`;
            values.push(status);
        }
        if (search) {
            query += ` AND (candidate_name ILIKE $${idx} OR role ILIKE $${idx})`;
            values.push(`%${search}%`);
            idx++;
        }

        query += " ORDER BY interview_date DESC, interview_time DESC";
        const data = await pool.query(query, values);

        res.json({ success: true, interviews: data.rows });
    } catch (err) {
        console.error("❌ getInterviews error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch interviews" });
    }
};

// GET /api/interviews/:id
const getInterviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await pool.query("SELECT * FROM interviews WHERE id = $1", [id]);
        if (data.rows.length === 0)
            return res.status(404).json({ success: false, message: "Interview not found" });
        res.json({ success: true, interview: data.rows[0] });
    } catch (err) {
        console.error("❌ getInterviewById error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch interview" });
    }
};

// POST /api/interviews — schedule a new interview
const createInterview = async (req, res) => {
    try {
        const { candidate_id, candidate_name, role, interview_date, interview_time, mode, meeting_link } = req.body;
        if (!candidate_name)
            return res.status(400).json({ success: false, message: "Candidate name is required" });

        const result = await pool.query(
            `INSERT INTO interviews (candidate_id, candidate_name, role, interview_date, interview_time, mode, meeting_link, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,'Scheduled') RETURNING *`,
            [candidate_id || null, candidate_name, role || null, interview_date || null, interview_time || null, mode || "Video", meeting_link || null]
        );

        res.status(201).json({ success: true, message: "Interview scheduled", interview: result.rows[0] });
    } catch (err) {
        console.error("❌ createInterview error:", err);
        res.status(500).json({ success: false, message: "Failed to schedule interview" });
    }
};

// PUT /api/interviews/:id — update interview details
const updateInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await pool.query("SELECT * FROM interviews WHERE id = $1", [id]);
        if (existing.rows.length === 0)
            return res.status(404).json({ success: false, message: "Interview not found" });

        const allowedFields = ["candidate_name", "role", "interview_date", "interview_time", "mode", "meeting_link", "status"];
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
            `UPDATE interviews SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
            values
        );
        res.json({ success: true, message: "Interview updated", interview: result.rows[0] });
    } catch (err) {
        console.error("❌ updateInterview error:", err);
        res.status(500).json({ success: false, message: "Failed to update interview" });
    }
};

// PATCH /api/interviews/:id/feedback — submit or update feedback
const submitFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, remarks, recommendation } = req.body;

        if (!rating || !recommendation)
            return res.status(400).json({ success: false, message: "Rating and recommendation are required" });

        const result = await pool.query(
            `UPDATE interviews
             SET feedback_rating = $1, feedback_remarks = $2, feedback_recommendation = $3,
                 status = 'Completed', updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 RETURNING *`,
            [rating, remarks || null, recommendation, id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ success: false, message: "Interview not found" });

        res.json({ success: true, message: "Feedback submitted", interview: result.rows[0] });
    } catch (err) {
        console.error("❌ submitFeedback error:", err);
        res.status(500).json({ success: false, message: "Failed to submit feedback" });
    }
};

// DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM interviews WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0)
            return res.status(404).json({ success: false, message: "Interview not found" });
        res.json({ success: true, message: "Interview deleted" });
    } catch (err) {
        console.error("❌ deleteInterview error:", err);
        res.status(500).json({ success: false, message: "Failed to delete interview" });
    }
};

module.exports = { getInterviews, getInterviewById, createInterview, updateInterview, submitFeedback, deleteInterview };
