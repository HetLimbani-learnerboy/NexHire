const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  toggleUserStatus
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id/status", toggleUserStatus);

module.exports = router;