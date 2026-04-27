const express = require("express");
const router = express.Router();

const {
  getAllVendors,
  createVendor,
  deleteVendor
} = require("../controllers/vendorController");

router.get("/", getAllVendors);
router.post("/", createVendor);
router.delete("/:id", deleteVendor);

module.exports = router;
