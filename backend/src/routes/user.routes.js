const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {getCurrentUserEmail} = require("../controllers/user.controller");

router.get("/me",authMiddleware(), getCurrentUserEmail);

module.exports = router;