const pool = require("../config/db");

const createSelectionsTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS selections (
            id SERIAL PRIMARY KEY,
            candidate_id INT,
            candidate_name VARCHAR(120),
            role VARCHAR(150),
            avg_score NUMERIC(3,1),
            recommendation VARCHAR(50),
            status VARCHAR(40) DEFAULT 'Pending Decision',
            offer_salary VARCHAR(50),
            joining_date DATE,
            offer_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const migrations = [
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS candidate_name VARCHAR(120)",
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS role VARCHAR(150)",
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS avg_score NUMERIC(3,1)",
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS recommendation VARCHAR(50)",
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS status VARCHAR(40) DEFAULT 'Pending Decision'",
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS offer_salary VARCHAR(50)",
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS joining_date DATE",
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS offer_notes TEXT",
        "ALTER TABLE selections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ];

    for (const sql of migrations) {
        try { await pool.query(sql); } catch (err) {
            if (err.code !== "42701") throw err;
        }
    }
};

module.exports = { createSelectionsTable };
