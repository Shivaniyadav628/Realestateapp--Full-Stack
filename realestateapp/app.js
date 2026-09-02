
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ======================================================
// CORS
// ======================================================

const allowedOrigins = (
    process.env.FRONTEND_URL ||
    "http://localhost:5173,http://127.0.0.1:5173"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin
            // (Postman, Thunder Client, server-to-server, etc.)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ======================================================
// SERVE STATIC FILES (IMAGES)
// ======================================================

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// ======================================================
// ROUTES
// ======================================================

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/inquiries", inquiryRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/reviews", reviewRoutes);

// ======================================================
// ROOT / TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
    res.json({
        message: "EstateHub Backend API is running"
    });
});

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend is healthy"
    });
});

// ======================================================
// API 404 HANDLER
// ======================================================

app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({
            message: "API endpoint not found"
        });
    }

    next();
});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;

