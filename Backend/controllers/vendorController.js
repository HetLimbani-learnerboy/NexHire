const pool = require("../config/db");

/* =====================================================
   Get All Vendors
===================================================== */
const getAllVendors = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        company_name,
        contact_person,
        email,
        phone,
        address,
        agreement_file,
        rating,
        turnaround_score,
        closure_score,
        status,
        created_at
      FROM vendors
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      vendors: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
      error: err.message
    });
  }
};

/* =====================================================
   Create Vendor
===================================================== */
const createVendor = async (req, res) => {
  try {
    const {
      company_name,
      contact_person,
      email,
      phone,
      address,
      agreement_file
    } = req.body;

    if (!company_name || !contact_person || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Company name, contact person and email are required"
      });
    }

    const check = await pool.query(
      `SELECT id FROM vendors WHERE email = $1`,
      [email]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Vendor already exists with this email"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO vendors
      (
        company_name,
        contact_person,
        email,
        phone,
        address,
        agreement_file,
        status,
        rating,
        turnaround_score,
        closure_score
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,'active',0,0,0)
      RETURNING *
      `,
      [
        company_name,
        contact_person,
        email,
        phone || "",
        address || "",
        agreement_file || ""
      ]
    );

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create vendor",
      error: err.message
    });
  }
};

/* =====================================================
   Delete Vendor
===================================================== */
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      `SELECT id FROM vendors WHERE id = $1`,
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    await pool.query(
      `DELETE FROM vendors WHERE id = $1`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
      error: err.message
    });
  }
};

/* =====================================================
   Update Vendor
===================================================== */
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company_name,
      contact_person,
      email,
      phone,
      address,
      agreement_file,
      status
    } = req.body;

    const result = await pool.query(
      `
      UPDATE vendors
      SET
        company_name = $1,
        contact_person = $2,
        email = $3,
        phone = $4,
        address = $5,
        agreement_file = $6,
        status = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        company_name,
        contact_person,
        email,
        phone,
        address,
        agreement_file,
        status,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      vendor: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update vendor",
      error: err.message
    });
  }
};

module.exports = {
  getAllVendors,
  createVendor,
  deleteVendor,
  updateVendor
};