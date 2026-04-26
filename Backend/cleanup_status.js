// cleanup_status.js
const pool = require("./config/db");

async function cleanup() {
    try {
        console.log("Cleaning up duplicate candidate_status records...");
        
        // Keep the most recent record for each candidate_id and delete the rest
        await pool.query(`
            DELETE FROM candidate_status 
            WHERE id NOT IN (
                SELECT MAX(id) 
                FROM candidate_status 
                GROUP BY candidate_id
            )
        `);
        console.log("Done!");
    } catch(e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

cleanup();
