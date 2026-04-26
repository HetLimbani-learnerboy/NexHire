const express = require('express');
const { getDashboardData, getPendingCandidates, updateCandidateStatus, submitFeedback, getInterviews, getDecisions, submitDecision } = require('../controllers/managerController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard', getDashboardData);
router.get('/candidates/pending', getPendingCandidates);
router.put('/candidates/:id/status', updateCandidateStatus);
router.get('/interviews', getInterviews);
router.post('/interviews/:id/feedback', submitFeedback);
router.get('/decisions', getDecisions);
router.post('/decisions/:id', submitDecision);

module.exports = router;
