/* ==========================================================
   BACKEND FULL CODE FOR ADMIN DASHBOARD
   File Structure:

   controllers/dashboardController.js
   routes/dashboardRoutes.js
   app.js add route

========================================================== */


/* ==========================================================
   controllers/dashboardController.js
========================================================== */

const pool = require("../config/db");

/* ==========================================
   GET COMPLETE DASHBOARD DATA
========================================== */
const getDashboardData = async (req, res) => {
  try {
    /* ---------------------------
       TOP CARDS
    --------------------------- */

    const totalJobs = await pool.query(
      `SELECT COUNT(*) FROM jobs`
    );

    const activeVendors = await pool.query(
      `SELECT COUNT(*) FROM vendors WHERE status='active'`
    );

    const totalCandidates = await pool.query(
      `SELECT COUNT(*) FROM candidates`
    );

    const hiredThisMonth = await pool.query(`
      SELECT COUNT(*)
      FROM candidate_status
      WHERE status='Hired'
      AND DATE_TRUNC('month', updated_at)=DATE_TRUNC('month', CURRENT_DATE)
    `);

    /* ---------------------------
       PIPELINE COUNTS
    --------------------------- */

    const pipeline = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM candidate_status
      GROUP BY status
    `);

    /* ---------------------------
       RECENT ACTIVITY
    --------------------------- */

    const activities = await pool.query(`
      SELECT
        remarks,
        status,
        updated_at
      FROM candidate_status
      ORDER BY updated_at DESC
      LIMIT 8
    `);

    /* ---------------------------
       TOP VENDORS
    --------------------------- */

    const vendors = await pool.query(`
      SELECT
        company_name,
        rating,
        LEFT(company_name,2) AS initials
      FROM vendors
      ORDER BY rating DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,

      cards: {
        totalJobs:
          Number(totalJobs.rows[0].count),

        activeVendors:
          Number(
            activeVendors.rows[0].count
          ),

        totalCandidates:
          Number(
            totalCandidates.rows[0].count
          ),

        hiredThisMonth:
          Number(
            hiredThisMonth.rows[0].count
          )
      },

      pipeline:
        pipeline.rows,

      activities:
        activities.rows,

      topVendors:
        vendors.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        "Dashboard fetch failed",
      error: err.message
    });
  }
};

module.exports = {
  getDashboardData
};