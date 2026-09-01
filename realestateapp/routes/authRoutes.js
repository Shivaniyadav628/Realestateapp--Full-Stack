const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
} = require("../controllers/authController");

const verifyToken =
    require("../middleware/authMiddleware");


// ======================
// Register
// ======================

router.post(
    "/register",
    registerUser
);


// ======================
// Login
// ======================

router.post(
    "/login",
    loginUser
);


// ======================
// Get Profile
// ======================

router.get(
    "/profile",
    verifyToken,
    getProfile
);


// ======================
// Update Profile
// ======================

router.put(
    "/profile",
    verifyToken,
    updateProfile
);


module.exports = router;
