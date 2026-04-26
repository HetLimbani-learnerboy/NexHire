const express = require("express");
const router = express.Router();
const {
    getCandidates, getCandidateById, createCandidate,
    updateCandidate, updateCandidateStatus, deleteCandidate, getCandidateStats,
} = require("../controllers/candidateController");

router.get("/stats", getCandidateStats);
router.get("/", getCandidates);
router.get("/:id", getCandidateById);
router.post("/", createCandidate);
router.put("/:id", updateCandidate);
router.patch("/:id/status", updateCandidateStatus);
router.delete("/:id", deleteCandidate);

module.exports = router;
