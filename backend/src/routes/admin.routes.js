const express = require("express");
const { createFaculty } = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/faculty", authMiddleware("ADMIN"), createFaculty);

module.exports = router;
