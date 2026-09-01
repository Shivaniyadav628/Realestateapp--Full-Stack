const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================================================
// REGISTER USER
// ======================================================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone
        } = req.body;

        // Validate fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if email already exists
        const checkQuery = `
            SELECT id
            FROM users
            WHERE email = ?
        `;

        db.query(
            checkQuery,
            [email],
            async (err, result) => {

                if (err) {
                    console.error(
                        "Check User Error:",
                        err
                    );

                    return res.status(500).json({
                        message: err.message
                    });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }

                try {
                    // Hash password
                    const hashedPassword =
                        await bcrypt.hash(
                            password,
                            10
                        );

                    // Insert user
                    const insertQuery = `
                        INSERT INTO users
                        (
                            name,
                            email,
                            password,
                            phone
                        )
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        insertQuery,
                        [
                            name,
                            email,
                            hashedPassword,
                            phone
                        ],
                        (err, result) => {

                            if (err) {
                                console.error(
                                    "Register Error:",
                                    err
                                );

                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            return res.status(201).json({
                                message:
                                    "User Registered Successfully",
                                userId:
                                    result.insertId
                            });
                        }
                    );

                } catch (error) {
                    console.error(
                        "Password Hash Error:",
                        error
                    );

                    return res.status(500).json({
                        message: error.message
                    });
                }
            }
        );

    } catch (error) {
        console.error(
            "Register Controller Error:",
            error
        );

        return res.status(500).json({
            message: error.message
        });
    }
};


// ======================================================
// LOGIN USER
// ======================================================

const loginUser = (req, res) => {

    const {
        email,
        password
    } = req.body;

    // Validate fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }

    const query = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(
        query,
        [email],
        async (err, result) => {

            if (err) {
                console.error(
                    "Login Database Error:",
                    err
                );

                return res.status(500).json({
                    message: err.message
                });
            }

            // User doesn't exist
            if (result.length === 0) {
                return res.status(400).json({
                    message:
                        "Invalid Email or Password"
                });
            }

            const user = result[0];

            try {

                // Compare password
                const isMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!isMatch) {
                    return res.status(400).json({
                        message:
                            "Invalid Email or Password"
                    });
                }

                // Check JWT secret
                if (!process.env.JWT_SECRET) {
                    console.error(
                        "JWT_SECRET is missing in .env"
                    );

                    return res.status(500).json({
                        message:
                            "Server configuration error"
                    });
                }

                // Create JWT
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d"
                    }
                );

                // Send response
                return res.status(200).json({
                    message: "Login Successful",

                    token,

                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role
                    }
                });

            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );

                return res.status(500).json({
                    message: error.message
                });
            }
        }
    );
};


// ======================================================
// GET LOGGED-IN USER PROFILE
// ======================================================

const getProfile = (req, res) => {

    const userId = req.user.id;

    const query = `
        SELECT
            id,
            name,
            email,
            phone,
            role
        FROM users
        WHERE id = ?
    `;

    db.query(
        query,
        [userId],
        (err, result) => {

            if (err) {
                console.error(
                    "Get Profile Error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to fetch profile"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json({
                message:
                    "Profile fetched successfully",

                user: result[0]
            });
        }
    );
};


// ======================================================
// UPDATE LOGGED-IN USER PROFILE
// ======================================================

const updateProfile = (req, res) => {

    const userId = req.user.id;

    const {
        name,
        phone
    } = req.body;

    // Validate
    if (!name || !phone) {
        return res.status(400).json({
            message:
                "Name and phone are required"
        });
    }

    const query = `
        UPDATE users
        SET
            name = ?,
            phone = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [
            name,
            phone,
            userId
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "Update Profile Error:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to update profile"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        "User not found"
                });
            }

            return res.status(200).json({
                message:
                    "Profile updated successfully"
            });
        }
    );
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
};