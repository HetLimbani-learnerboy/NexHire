const pool = require("../config/db");

const createCandidateStatusTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS candidate_status (
      id SERIAL PRIMARY KEY,
      candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
      status VARCHAR(40) NOT NULL,
      remarks TEXT,
      updated_by INT REFERENCES users(id),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = { createCandidateStatusTable };