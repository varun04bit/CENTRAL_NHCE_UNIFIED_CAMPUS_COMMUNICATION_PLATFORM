const express = require("express");
const { updateFacultyPassword } = require("../controllers/facultyAuth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/update-password",
  authMiddleware("FACULTY"),
  updateFacultyPassword
);

module.exports = router;
