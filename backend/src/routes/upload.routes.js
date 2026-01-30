const express = require("express");
const { upload } = require("../config/multer.config");
const { uploadFile } = require("../controllers/upload.controller");

const router = express.Router();

// POST /api/uploads
router.post("/uploads", upload.single("file"), uploadFile);

module.exports = router;
