const express = require("express");
const router = express.Router();
const { getReviews, createReview, updateReview, deleteReview } = require("../controllers/reviewController");

router.get("/", getReviews);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
