const express = require("express");
const router = express.Router();
const {
    getInterviews, getInterviewById, createInterview,
    updateInterview, submitFeedback, deleteInterview,
} = require("../controllers/interviewController");

router.get("/", getInterviews);
router.get("/:id", getInterviewById);
router.post("/", createInterview);
router.put("/:id", updateInterview);
router.patch("/:id/feedback", submitFeedback);
router.delete("/:id", deleteInterview);

module.exports = router;
