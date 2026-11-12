const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createNewsletter,
  getNewsletters,
  getMyNewsletters,
  updateNewsletter,
} = require("../controllers/newsletter.controller");

const router = express.Router();

// ============================
// FACULTY ROUTES
// ============================

// Faculty create newsletter
router.post(
  "/newsletters",
  authMiddleware(["FACULTY", "ADMIN"]),
  createNewsletter
);

// Faculty: get own newsletters
router.get(
  "/newsletters/mine",
  authMiddleware("FACULTY"),
  getMyNewsletters
);

// Faculty: update own newsletter
router.put(
  "/newsletters/:id",
  authMiddleware("FACULTY"),
  updateNewsletter
);

// ============================
// STUDENT / COMMON ROUTES
// ============================

// Students (and others) view newsletters
router.get(
  "/newsletters",
  authMiddleware(["STUDENT", "FACULTY", "ADMIN"]),
  getNewsletters
);

module.exports = router;
