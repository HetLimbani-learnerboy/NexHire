const pool = require("../config/db");

const getReviews = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM reviews ORDER BY created_at DESC");
        res.json({ success: true, reviews: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching reviews" });
    }
};

const createReview = async (req, res) => {
    try {
        const { candidate_id, candidate_name, role, experience, source, status } = req.body;
        const result = await pool.query(
            `INSERT INTO reviews (candidate_id, candidate_name, role, experience, source, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [candidate_id || null, candidate_name, role, experience, source, status || 'Pending Review']
        );
        res.status(201).json({ success: true, review: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error creating review" });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewer_notes } = req.body;
        const result = await pool.query(
            "UPDATE reviews SET status = $1, reviewer_notes = COALESCE($2, reviewer_notes), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
            [status, reviewer_notes || null, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Review not found" });
        res.json({ success: true, review: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating review" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM reviews WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Review not found" });
        res.json({ success: true, message: "Review deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error deleting review" });
    }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
