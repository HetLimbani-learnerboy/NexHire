const pool = require("../config/db");
const createVendorsTable = async () => { 
    await pool.query(` 
        CREATE TABLE IF NOT EXISTS vendors ( 
        id SERIAL PRIMARY KEY, 
        company_name VARCHAR(150) NOT NULL, 
        contact_person VARCHAR(120), 
        email VARCHAR(150), 
        phone VARCHAR(20), 
        address TEXT, 
        agreement_file TEXT, 
        rating NUMERIC(3,2) DEFAULT 0, 
        turnaround_score NUMERIC(5,2) DEFAULT 0, 
        closure_score NUMERIC(5,2) DEFAULT 0, 
        status VARCHAR(20) DEFAULT 'active', 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ) 
    `); 
}; 
module.exports = { createVendorsTable };