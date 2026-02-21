const express = require("express");
const {
  getPrograms,
  getDepartmentsByProgram,
} = require("../controllers/meta.controller");

const router = express.Router();

router.get("/programs", getPrograms);
router.get("/departments/:programId", getDepartmentsByProgram);

module.exports = router;
