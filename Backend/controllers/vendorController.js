<<<<<<< HEAD
const { pool } = require('../app');

const getDashboardStats = async (req, res) => {
    try {
        // We will fetch stats from DB. For now, returning mock-like structure with DB query placeholders.
        // Assuming user ID is extracted from JWT token via middleware
        const vendorId = req.user.userId;
        
        // Example logic:
        // const { rows: submitted } = await pool.query('SELECT COUNT(*) FROM candidates WHERE vendor_id = $1', [vendorId]);
        
        res.status(200).json({
            success: true,
            stats: {
                totalSubmitted: 48, // parseInt(submitted[0].count)
                shortlisted: 14,
                interviews: 6,
                hired: 3
            },
            recentUpdates: [
                { text: "Your candidate Aditya Patel was moved to Interview stage.", time: "1 hour ago", color: "orange" }
            ]
        });
    } catch (error) {
        console.error('Error fetching vendor stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAssignedJobs = async (req, res) => {
    try {
        // const vendorId = req.user.userId;
        // const { rows } = await pool.query('SELECT * FROM jobs JOIN job_vendors ON jobs.id = job_vendors.job_id WHERE job_vendors.vendor_id = $1 AND jobs.status = $2', [vendorId, 'Active']);
        
        res.status(200).json({
            success: true,
            jobs: [
                { id: "J001", title: "Senior React Developer", department: "Engineering", location: "Bangalore", status: "Active" },
                { id: "J002", title: "Full Stack Developer", department: "Engineering", location: "Remote", status: "Active" },
                { id: "J003", title: "UI/UX Designer", department: "Product", location: "Mumbai", status: "Active" }
            ]
        });
    } catch (error) {
        console.error('Error fetching assigned jobs:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const submitCandidate = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, jobId } = req.body;
        // const vendorId = req.user.userId;

        // Skip actual file upload, just save details in DB
        // const result = await pool.query(
        //     'INSERT INTO candidates (first_name, last_name, email, phone, job_id, vendor_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        //     [firstName, lastName, email, phone, jobId, vendorId, 'Pending Review']
        // );

        res.status(201).json({
            success: true,
            message: `Candidate ${firstName} ${lastName} submitted successfully for Job ${jobId}!`
        });
    } catch (error) {
        console.error('Error submitting candidate:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getMyCandidates = async (req, res) => {
    try {
        // const vendorId = req.user.userId;
        // const { rows } = await pool.query('SELECT * FROM candidates WHERE vendor_id = $1', [vendorId]);
        
        res.status(200).json({
            success: true,
            candidates: []
        });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        profile: {
            companyName: "TechStaff Solutions",
            contactPerson: "Rajesh Kumar",
            email: "rajesh@techstaff.in",
            phone: "+91 98765 43210",
            website: "https://techstaff.in",
            address: "123 Tech Park, Bangalore"
        }
    });
};

const updateProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile updated successfully"
    });
};

module.exports = {
    getDashboardStats,
    getAssignedJobs,
    submitCandidate,
    getMyCandidates,
    getProfile,
    updateProfile
};
=======
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
>>>>>>> 9c896c23ed50f1ba724062b4dde8fb5a0531b81d
