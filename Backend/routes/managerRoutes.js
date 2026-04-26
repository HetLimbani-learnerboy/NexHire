const express = require('express');
const { getDashboardData, getPendingCandidates, updateCandidateStatus, submitFeedback } = require('../controllers/managerController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard', getDashboardData);
router.get('/candidates/pending', getPendingCandidates);
router.put('/candidates/:id/status', updateCandidateStatus);
router.post('/interviews/:id/feedback', submitFeedback);

module.exports = router;
