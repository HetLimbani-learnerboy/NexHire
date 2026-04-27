const pool = require("../config/db");

const createFeedbackTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      interview_id INT REFERENCES interviews(id) ON DELETE CASCADE,
      candidate_id INT REFERENCES candidates(id),
      reviewer_id INT REFERENCES users(id),
      rating INT CHECK (rating BETWEEN 1 AND 5),
      strengths TEXT,
      concerns TEXT,
      recommendation VARCHAR(30),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = { createFeedbackTable };