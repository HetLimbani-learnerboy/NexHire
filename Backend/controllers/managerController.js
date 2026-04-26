const { pool } = require('../app');

const getDashboardData = async (req, res) => {
    try {
        // const managerId = req.user.userId;
        // DB queries here
        res.status(200).json({
            success: true,
            actionItems: [
                { id: 1, type: "Review", candidate: "Aditya Patel", role: "Senior React Developer", urgency: "High", time: "Pending 2 days" }
            ],
            upcomingInterviews: [
                { id: 1, name: "Neha Gupta", role: "Data Analyst", time: "11:00 AM Today", mode: "Video Call" }
            ]
        });
    } catch (error) {
        console.error('Error fetching manager dashboard:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getPendingCandidates = async (req, res) => {
    try {
        // DB queries here
        res.status(200).json({
            success: true,
            candidates: [
                { id: "C001", name: "Aditya Patel", role: "Senior React Developer", experience: "5 Years", source: "TechStaff Solutions", status: "Pending Review" }
            ]
        });
    } catch (error) {
        console.error('Error fetching pending candidates:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateCandidateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // await pool.query('UPDATE candidates SET status = $1 WHERE id = $2', [status, id]);
        
        res.status(200).json({
            success: true,
            message: `Candidate ${id} status updated to ${status}`
        });
    } catch (error) {
        console.error('Error updating candidate status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const submitFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;
        // await pool.query('INSERT INTO feedback (interview_id, comments) VALUES ($1, $2)', [id, feedback]);
        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully'
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getDashboardData,
    getPendingCandidates,
    updateCandidateStatus,
    submitFeedback
};
