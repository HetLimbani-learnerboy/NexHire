<<<<<<< HEAD
const express = require('express');
const { getDashboardStats, getAssignedJobs, submitCandidate, getMyCandidates, getProfile, updateProfile } = require('../controllers/vendorController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all vendor routes
router.use(authMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/jobs', getAssignedJobs);
router.post('/candidates', submitCandidate);
router.get('/candidates', getMyCandidates);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
=======
const express = require("express");
const router = express.Router();

const {
  getAllVendors,
  createVendor,
  deleteVendor
} = require("../controllers/vendorController");

router.get("/", getAllVendors);
router.post("/", createVendor);
router.delete("/:id", deleteVendor);

module.exports = router;
>>>>>>> 9c896c23ed50f1ba724062b4dde8fb5a0531b81d
