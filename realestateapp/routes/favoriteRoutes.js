
const express = require("express");

const router = express.Router();

const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

const verifyToken = require("../middleware/authMiddleware");

// =====================================================
// Test
// =====================================================

router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Favorite routes are working",
  });
});

// =====================================================
// Add Favorite
// POST /api/favorites
// =====================================================

router.post(
  "/",
  verifyToken,
  addFavorite
);

// =====================================================
// Get My Favorites
// GET /api/favorites
// =====================================================

router.get(
  "/",
  verifyToken,
  getFavorites
);

// =====================================================
// Remove Favorite
// DELETE /api/favorites/:propertyId
// =====================================================

router.delete(
  "/:propertyId",
  verifyToken,
  removeFavorite
);

module.exports = router;

