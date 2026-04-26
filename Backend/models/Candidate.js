const { pool } = require("../app");

const createCandidatesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS candidates (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(120) NOT NULL,
      email VARCHAR(150),
      phone VARCHAR(20),
      current_company VARCHAR(120),
      experience_years NUMERIC(4,1),
      skills TEXT,
      resume_url TEXT,
      linkedin_url TEXT,
      source VARCHAR(50) DEFAULT 'vendor',
      vendor_id INT REFERENCES vendors(id),
      job_id INT REFERENCES jobs(id),
      duplicate_flag BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = { createCandidatesTable };