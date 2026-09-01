const express = require("express");

const router = express.Router();

const {
    addProperty,
    getAllProperties,
    getPropertyById,
    getMyProperties,
    updateProperty,
    deleteProperty,
    searchProperties,
} = require("../controllers/propertyController");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ======================
// PUBLIC
// ======================

// Get all properties
router.get("/", getAllProperties);

// Search properties
router.get("/search", searchProperties);

// Get single property
// MUST come after /search and /my
router.get("/:id", getPropertyById);

// ======================
// LOGGED-IN USER
// ======================

// Get user's own properties
// Kept protected, but frontend should not show this to normal users.
router.get(
    "/my",
    verifyToken,
    adminMiddleware,
    getMyProperties
);

// ======================
// ADMIN ONLY
// ======================

// Add property
router.post(
    "/",
    verifyToken,
    adminMiddleware,
    upload.single("image"),
    addProperty
);

// Update property
router.put(
    "/:id",
    verifyToken,
    adminMiddleware,
    upload.single("image"),
    updateProperty
);

// Delete property
router.delete(
    "/:id",
    verifyToken,
    adminMiddleware,
    deleteProperty
);

module.exports = router;