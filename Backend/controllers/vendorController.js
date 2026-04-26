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

module.exports = {
    getDashboardStats,
    getAssignedJobs,
    submitCandidate,
    getMyCandidates
};
