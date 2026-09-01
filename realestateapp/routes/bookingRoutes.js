
const express = require("express");

const router = express.Router();

const {
  bookVisit,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const verifyToken = require("../middleware/authMiddleware");

// =====================================================
// Book Property Visit
// POST /api/bookings
// =====================================================

router.post(
  "/",
  verifyToken,
  bookVisit
);

// =====================================================
// Get My Bookings
// GET /api/bookings
// =====================================================

router.get(
  "/",
  verifyToken,
  getMyBookings
);

// =====================================================
// Cancel Booking
// DELETE /api/bookings/:id
// =====================================================

router.delete(
  "/:id",
  verifyToken,
  cancelBooking
);

module.exports = router;

