const pool = require("../config/db");

const createReviewsTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            candidate_id INT,
            candidate_name VARCHAR(120),
            role VARCHAR(150),
            experience VARCHAR(50),
            source VARCHAR(150),
            status VARCHAR(40) DEFAULT 'Pending Review',
            reviewer_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const migrations = [
        "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS candidate_name VARCHAR(120)",
        "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS role VARCHAR(150)",
        "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS experience VARCHAR(50)",
        "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS source VARCHAR(150)",
        "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status VARCHAR(40) DEFAULT 'Pending Review'",
        "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reviewer_notes TEXT",
        "ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ];

    for (const sql of migrations) {
        try { await pool.query(sql); } catch (err) {
            if (err.code !== "42701") throw err;
        }
    }
};

module.exports = { createReviewsTable };
