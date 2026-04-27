// ─── Interview Model ───────────────────────────────────────────────────────────
// Stores interviews with embedded feedback fields (no separate feedback table needed
// for the HR dashboard use-case).
const pool = require("../config/db");

const createInterviewsTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS interviews (
            id              SERIAL PRIMARY KEY,
            candidate_id    INT,
            candidate_name  VARCHAR(120) NOT NULL,
            role            VARCHAR(150),
            interview_date  DATE,
            interview_time  VARCHAR(10),
            mode            VARCHAR(30) DEFAULT 'Video',
            meeting_link    TEXT,
            status          VARCHAR(30) DEFAULT 'Scheduled',
            feedback_rating INT CHECK (feedback_rating BETWEEN 1 AND 5),
            feedback_remarks TEXT,
            feedback_recommendation VARCHAR(30),
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const migrations = [
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS candidate_name VARCHAR(120)",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS role VARCHAR(150)",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS interview_date DATE",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS interview_time VARCHAR(10)",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS mode VARCHAR(30) DEFAULT 'Video'",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS meeting_link TEXT",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Scheduled'",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS feedback_rating INT",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS feedback_remarks TEXT",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS feedback_recommendation VARCHAR(30)",
        "ALTER TABLE interviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ];

    for (const sql of migrations) {
        try { await pool.query(sql); } catch (err) {
            if (err.code !== "42701") throw err;
        }
    }
};

module.exports = { createInterviewsTable };