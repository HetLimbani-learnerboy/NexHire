const { pool } = require("../app"); 
const createJobVendorsTable = async () => { 
    await pool.query(` 
        CREATE TABLE IF NOT EXISTS job_vendors ( 
        id SERIAL PRIMARY KEY, 
        job_id INT REFERENCES jobs(id) ON DELETE CASCADE, 
        vendor_id INT REFERENCES vendors(id) ON DELETE CASCADE, 
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ) 
    `); 
};

module.exports = { createJobVendorsTable };