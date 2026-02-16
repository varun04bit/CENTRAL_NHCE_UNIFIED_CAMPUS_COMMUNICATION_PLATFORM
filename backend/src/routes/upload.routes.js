const express = require("express");
const { upload } = require("../config/multer.config");
const { uploadFile } = require("../controllers/upload.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// POST /api/uploads
// router.post("/uploads", upload.single("file"), uploadFile);
router.post(
  "/uploads",
  authMiddleware(["FACULTY", "ADMIN"]),
  upload.array("files", 5), // allow up to 5 files
  uploadFile
);
module.exports = router;
