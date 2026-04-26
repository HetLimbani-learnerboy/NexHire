const { pool } = require("../app");

const createInterviewsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS interviews (
      id SERIAL PRIMARY KEY,
      candidate_id INT REFERENCES candidates(id) ON DELETE CASCADE,
      interviewer_id INT REFERENCES users(id),
      round_name VARCHAR(80),
      interview_date TIMESTAMP,
      mode VARCHAR(30),
      meeting_link TEXT,
      status VARCHAR(30) DEFAULT 'scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

module.exports = { createInterviewsTable };