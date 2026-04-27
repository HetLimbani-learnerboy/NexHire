const pool = require("../config/db");

const getSelections = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM selections ORDER BY created_at DESC");
        res.json({ success: true, selections: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching selections" });
    }
};

const createSelection = async (req, res) => {
    try {
        const { candidate_id, candidate_name, role, avg_score, recommendation, status } = req.body;
        const result = await pool.query(
            `INSERT INTO selections (candidate_id, candidate_name, role, avg_score, recommendation, status)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [candidate_id || null, candidate_name, role, avg_score, recommendation, status || 'Pending Decision']
        );
        res.status(201).json({ success: true, selection: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error creating selection" });
    }
};

const updateSelection = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, offer_salary, joining_date, offer_notes } = req.body;
        const result = await pool.query(
            `UPDATE selections 
             SET status = COALESCE($1, status), 
                 offer_salary = COALESCE($2, offer_salary), 
                 joining_date = COALESCE($3, joining_date), 
                 offer_notes = COALESCE($4, offer_notes), 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = $5 RETURNING *`,
            [status, offer_salary || null, joining_date || null, offer_notes || null, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Selection not found" });
        res.json({ success: true, selection: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating selection" });
    }
};

const deleteSelection = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM selections WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Selection not found" });
        res.json({ success: true, message: "Selection deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error deleting selection" });
    }
};

module.exports = { getSelections, createSelection, updateSelection, deleteSelection };
