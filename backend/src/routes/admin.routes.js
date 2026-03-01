const express = require("express");
const { createFaculty } = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

// router.post("/faculty", authMiddleware("ADMIN"), createFaculty);
router.post("/faculty", authMiddleware, adminOnly, createFaculty);

module.exports = router;
