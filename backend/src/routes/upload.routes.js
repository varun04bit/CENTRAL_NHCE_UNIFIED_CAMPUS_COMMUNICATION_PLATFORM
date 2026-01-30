import express from "express";
import { upload } from "../config/multer.config.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

// POST /api/uploads
router.post("/uploads", upload.single("file"), uploadFile);

export default router;
