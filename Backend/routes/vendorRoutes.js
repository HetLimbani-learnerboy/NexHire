const express = require('express');
const { getDashboardStats, getAssignedJobs, submitCandidate, getMyCandidates } = require('../controllers/vendorController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all vendor routes
router.use(authMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/jobs', getAssignedJobs);
router.post('/candidates', submitCandidate);
router.get('/candidates', getMyCandidates);

module.exports = router;
