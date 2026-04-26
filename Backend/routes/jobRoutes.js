// ─── Job Routes ────────────────────────────────────────────────────────────────
// RESTful routes for the jobs resource.
//   GET    /api/jobs          → list (with filters + pagination)
//   GET    /api/jobs/stats    → dashboard summary counts
//   GET    /api/jobs/:id      → single job
//   POST   /api/jobs          → create
//   PUT    /api/jobs/:id      → full update
//   PATCH  /api/jobs/:id/status → quick status change
//   DELETE /api/jobs/:id      → delete

const express = require("express");
const router = express.Router();

const {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    updateJobStatus,
    deleteJob,
    getJobStats,
} = require("../controllers/jobController");

// ── Stats must be above /:id so it doesn't get swallowed ─────────────────────
router.get("/stats", getJobStats);

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.put("/:id", updateJob);
router.patch("/:id/status", updateJobStatus);
router.delete("/:id", deleteJob);

module.exports = router;
