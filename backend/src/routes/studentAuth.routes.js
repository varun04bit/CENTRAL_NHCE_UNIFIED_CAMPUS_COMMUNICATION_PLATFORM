const express = require("express");
const {
  studentSignup,
  studentLogin,
} = require("../controllers/studentAuth.controller");

const router = express.Router();

// POST /auth/student/signup
router.post("/signup", studentSignup);

// POST /auth/student/login
router.post("/login", studentLogin);

module.exports = router;
