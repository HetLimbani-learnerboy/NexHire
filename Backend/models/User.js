const pool = require("../config/db");

const createUsersTable = async () => { 
    await pool.query(` 
        CREATE TABLE IF NOT EXISTS users ( 
        id SERIAL PRIMARY KEY, 
        full_name VARCHAR(120) NOT NULL, 
        email VARCHAR(150) UNIQUE NOT NULL, 
        password_hash TEXT NOT NULL, 
        role VARCHAR(30) NOT NULL, 
        phone VARCHAR(20), 
        avatar TEXT, 
        is_active BOOLEAN DEFAULT TRUE, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ) 
    `); 
}; 
module.exports = { createUsersTable };