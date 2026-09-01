const express = require("express");

const router = express.Router();

const {
  getReviews,
  addReview,
} = require("../controllers/reviewController");

const verifyToken = require("../middleware/authMiddleware");

// Get reviews for a property
router.get(
  "/:propertyId",
  getReviews
);

// Submit a review
router.post(
  "/:propertyId",
  verifyToken,
  addReview
);

module.exports = router;