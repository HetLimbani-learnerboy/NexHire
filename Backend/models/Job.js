// ─── Job Model ─────────────────────────────────────────────────────────────────
// Creates the `jobs` table in Neon (PostgreSQL).  Schema is aligned with the
// frontend form fields: title, department, skills, budget, deadline, priority,
// status, openings, experience_level, employment_type, location, description.

const pool = require("../config/db");

const createJobsTable = async () => {
    // Create table if it doesn't exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS jobs (
            id              SERIAL PRIMARY KEY,
            title           VARCHAR(150) NOT NULL,
            department      VARCHAR(100),
            experience_level VARCHAR(50),
            skills          TEXT,
            openings        INT DEFAULT 1,
            budget          VARCHAR(50),
            location        VARCHAR(120),
            employment_type VARCHAR(50),
            priority        VARCHAR(20) DEFAULT 'Medium',
            deadline        DATE,
            status          VARCHAR(30) DEFAULT 'Open',
            description     TEXT,
            created_by      INT,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Safely add any columns that may be missing (handles schema migration from old tables)
    const migrations = [
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50)",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type VARCHAR(50)",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location VARCHAR(120)",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'Medium'",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS openings INT DEFAULT 1",
        "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS created_by INT",
    ];

    for (const sql of migrations) {
        try {
            await pool.query(sql);
        } catch (err) {
            // Silently skip if column already exists (older PG versions without IF NOT EXISTS)
            if (err.code !== "42701") throw err;
        }
    }

    // Make budget column wider if it was NUMERIC before (allow text like "₹18-22L")
    try {
        await pool.query(`
            ALTER TABLE jobs ALTER COLUMN budget TYPE VARCHAR(50) USING budget::VARCHAR(50)
        `);
    } catch (err) {
        // Ignore if already the right type
    }
};

module.exports = { createJobsTable };