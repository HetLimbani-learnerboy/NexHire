<<<<<<< HEAD
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // This is a temporary mock authentication.
        // In a real scenario, you would verify the user in the database.
        
        let role = '';
        let userId = '';

        if (email === 'vendor@example.com' && password === 'password123') {
            role = 'vendor';
            userId = 'V001';
        } else if (email === 'manager@example.com' && password === 'password123') {
            role = 'manager';
            userId = 'M001';
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT
        // JWT_SECRET should be defined in .env
        const token = jwt.sign(
            { userId, role, email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1h' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: { userId, role, email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = { login, logout };
=======
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Register New User */
const register = async (req, res) => {
  try {
    const { full_name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: full_name, email, password, role"
      });
    }

    // Check if user already exists
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, phone, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, full_name, email, role, phone, is_active`,
      [full_name, email, passwordHash, role, phone || null]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_super_secret_key_here",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Registration failed"
    });
  }
};

/* Login User */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role, phone, is_active
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive"
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_super_secret_key_here",
      { expiresIn: "7d" }
    );

    // Return user without password hash
    const userResponse = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      is_active: user.is_active
    };

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Login failed"
    });
  }
};

/* Get Current User */
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = await pool.query(
      `SELECT id, full_name, email, role, phone, is_active, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to get user"
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
>>>>>>> 9c896c23ed50f1ba724062b4dde8fb5a0531b81d
