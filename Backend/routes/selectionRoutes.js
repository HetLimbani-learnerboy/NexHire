const express = require("express");
const router = express.Router();
const { getSelections, createSelection, updateSelection, deleteSelection } = require("../controllers/selectionController");

router.get("/", getSelections);
router.post("/", createSelection);
router.put("/:id", updateSelection);
router.delete("/:id", deleteSelection);

module.exports = router;
