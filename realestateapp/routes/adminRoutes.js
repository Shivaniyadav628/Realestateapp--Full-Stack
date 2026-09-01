const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    deleteUser,
    getAllProperties,
    deleteProperty,
    getAllBookings,
    updateBookingStatus,
    getAllInquiries
} = require("../controllers/adminController");

const verifyToken =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


// ======================================================
// USERS
// ======================================================

router.get(
    "/users",
    verifyToken,
    adminMiddleware,
    getAllUsers
);

router.delete(
    "/users/:id",
    verifyToken,
    adminMiddleware,
    deleteUser
);


// ======================================================
// PROPERTIES
// ======================================================

router.get(
    "/properties",
    verifyToken,
    adminMiddleware,
    getAllProperties
);

router.delete(
    "/properties/:id",
    verifyToken,
    adminMiddleware,
    deleteProperty
);


// ======================================================
// BOOKINGS
// ======================================================

router.get(
    "/bookings",
    verifyToken,
    adminMiddleware,
    getAllBookings
);

router.patch(
    "/bookings/:id",
    verifyToken,
    adminMiddleware,
    updateBookingStatus
);


// ======================================================
// INQUIRIES
// ======================================================

router.get(
    "/inquiries",
    verifyToken,
    adminMiddleware,
    getAllInquiries
);


module.exports = router;