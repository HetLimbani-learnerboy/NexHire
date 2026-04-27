<<<<<<< HEAD
const express = require('express');
const { login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
=======
const express = require("express");
const router = express.Router();
const { register, login, getCurrentUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);
>>>>>>> 9c896c23ed50f1ba724062b4dde8fb5a0531b81d

module.exports = router;
