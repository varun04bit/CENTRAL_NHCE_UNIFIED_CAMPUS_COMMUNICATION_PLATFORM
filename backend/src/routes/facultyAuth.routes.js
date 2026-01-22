const express = require("express");

const {
  facultyLogin,
  updateFacultyPassword,
} = require("../controllers/facultyAuth.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", facultyLogin);
router.post(
  "/update-password",
  authMiddleware("FACULTY"),
  updateFacultyPassword
);

module.exports = router;
