const express = require("express");
const { studentSignup } = require("../controllers/studentAuth.controller");

const router = express.Router();

router.post("/signup", studentSignup);

module.exports = router;

