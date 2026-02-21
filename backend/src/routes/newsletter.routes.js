const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createNewsletter,
  getNewsletters
} = require("../controllers/newsletter.controller");

const router = express.Router();

// Faculty/Admin create
router.post(
  "/newsletters",
  authMiddleware(["FACULTY", "ADMIN"]),
  createNewsletter
);

// Students view
router.get(
  "/newsletters",
  authMiddleware(["STUDENT", "FACULTY", "ADMIN"]),
  getNewsletters
);

module.exports = router;
