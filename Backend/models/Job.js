const { pool } = require("../app"); 
const createJobsTable = async () => { 
    await pool.query(` 
        CREATE TABLE IF NOT EXISTS jobs ( 
        id SERIAL PRIMARY KEY, 
        title VARCHAR(150) NOT NULL, 
        department VARCHAR(100), 
        experience_level VARCHAR(50), 
        skills TEXT, 
        openings INT DEFAULT 1, 
        budget NUMERIC(12,2), 
        location VARCHAR(120), 
        employment_type VARCHAR(50), 
        priority VARCHAR(20), 
        deadline DATE, 
        status VARCHAR(30) DEFAULT 'open', 
        created_by INT REFERENCES users(id), 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ) 
    `); 
}; 
module.exports = { createJobsTable };