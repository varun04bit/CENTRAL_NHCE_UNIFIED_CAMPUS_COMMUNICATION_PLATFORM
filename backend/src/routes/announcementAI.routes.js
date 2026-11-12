const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { generateAnnouncementDraft } = require("../controllers/announcementAI.controller");

router.post(
  "/ai-draft",
  authMiddleware(["FACULTY", "ADMIN"]),
  generateAnnouncementDraft
);

module.exports = router;

