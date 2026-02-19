const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createAnnouncement,
  getStudentAnnouncements,
  getMyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");

const router = express.Router();

// ============================
// FACULTY ROUTES
// ============================

// Create announcement
router.post("/", authMiddleware("FACULTY"), createAnnouncement);

// Faculty: get own announcements
router.get("/mine", authMiddleware("FACULTY"), getMyAnnouncements);

// Update announcement (only owner faculty)
router.put("/:id", authMiddleware("FACULTY"), updateAnnouncement);

// Delete announcement (only owner faculty)
router.delete("/:id", authMiddleware("FACULTY"), deleteAnnouncement);

// ============================
// STUDENT ROUTES
// ============================

// Students read announcements
router.get("/", authMiddleware("STUDENT"), getStudentAnnouncements);

module.exports = router;
