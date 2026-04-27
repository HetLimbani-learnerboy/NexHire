const pool = require("../config/db");
const bcrypt = require("bcryptjs");

/* Get Users */
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, full_name, email, role, is_active
      FROM users
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      users: result.rows
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Create User */
const createUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      role
    } = req.body;

    const hash = await bcrypt.hash("nexhire123", 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (full_name,email,password_hash,role,is_active)
      VALUES ($1,$2,$3,$4,true)
      RETURNING id,full_name,email,role
      `,
      [full_name, email, hash, role]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* Enable / Disable */
const toggleUserStatus = async (req, res) => {
  try {
    await pool.query(`
      UPDATE users
      SET is_active = NOT is_active
      WHERE id = $1
    `,[req.params.id]);

    res.json({
      success: true,
      message: "User status updated"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  toggleUserStatus
};