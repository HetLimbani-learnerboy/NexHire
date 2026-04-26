// ─── Candidate Model ───────────────────────────────────────────────────────────
const pool = require("../config/db");

const createCandidatesTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS candidates (
            id              SERIAL PRIMARY KEY,
            full_name       VARCHAR(120) NOT NULL,
            email           VARCHAR(150),
            phone           VARCHAR(20),
            job_title       VARCHAR(150),
            job_id          INT,
            vendor_name     VARCHAR(150),
            vendor_id       INT,
            status          VARCHAR(40) DEFAULT 'Submitted',
            resume_url      TEXT,
            is_duplicate    BOOLEAN DEFAULT FALSE,
            notes           TEXT,
            submitted_at    DATE DEFAULT CURRENT_DATE,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Safely add missing columns for migration
    const migrations = [
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS job_title VARCHAR(150)",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS vendor_name VARCHAR(150)",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS status VARCHAR(40) DEFAULT 'Submitted'",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT FALSE",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS notes TEXT",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS submitted_at DATE DEFAULT CURRENT_DATE",
        "ALTER TABLE candidates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ];

    for (const sql of migrations) {
        try { await pool.query(sql); } catch (err) {
            if (err.code !== "42701") throw err;
        }
    }
};

module.exports = { createCandidatesTable };