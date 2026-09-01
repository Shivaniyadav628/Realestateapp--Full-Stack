
const express = require("express");

const router = express.Router();

const {
  sendInquiry,
  getMyInquiries,
  deleteInquiry,
} = require("../controllers/inquiryController");

const verifyToken = require("../middleware/authMiddleware");

// =====================================================
// Send Inquiry
// POST /api/inquiries
// =====================================================

router.post(
  "/",
  verifyToken,
  sendInquiry
);

// =====================================================
// Get My Inquiries
// GET /api/inquiries
// =====================================================

router.get(
  "/",
  verifyToken,
  getMyInquiries
);

// =====================================================
// Delete Inquiry
// DELETE /api/inquiries/:id
// =====================================================

router.delete(
  "/:id",
  verifyToken,
  deleteInquiry
);

module.exports = router;

