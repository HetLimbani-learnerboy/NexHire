// ─── Centralized Database Pool ────────────────────────────────────────────────
// Avoids circular dependency (app.js ↔ models) by exporting pool from here.
// Every file that needs the DB should require("../config/db") instead of "../app".

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 10,
});

pool.on("error", (err) => {
    console.error("⚠️  Unexpected error on idle client", err);
});

module.exports = pool;
