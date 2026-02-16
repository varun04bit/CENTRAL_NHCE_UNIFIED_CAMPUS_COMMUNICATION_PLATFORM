const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createAnnouncement,
  getStudentAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");

const router = express.Router();

// Faculty creates announcement
router.post("/", authMiddleware("FACULTY"), createAnnouncement);

// Students read announcements
router.get("/", authMiddleware("STUDENT"), getStudentAnnouncements);

router.put(
  "/:id",
  authMiddleware("FACULTY"),
  updateAnnouncement
);

router.delete(
  "/:id",
  authMiddleware("FACULTY"),
  deleteAnnouncement
);


module.exports = router;
