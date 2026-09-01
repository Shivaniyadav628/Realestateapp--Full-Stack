const db = require("../config/db");

// ======================
// Get All Users
// ======================
const getAllUsers = (req, res) => {
    const query = `
        SELECT
            id,
            name,
            email,
            phone,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(results);
    });
};

// ======================
// Delete User
// ======================
const deleteUser = (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM users
        WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });
    });
};

// ======================
// Get All Properties
// ======================
const getAllProperties = (req, res) => {
    const query = `
        SELECT
            p.*,
            u.name AS owner_name,
            u.email AS owner_email
        FROM properties p
        JOIN users u
            ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(results);
    });
};

// ======================
// Delete Property
// ======================
const deleteProperty = (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM properties
        WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        res.status(200).json({
            message: "Property deleted successfully"
        });
    });
};

// ======================
// Get All Bookings
// ======================
const getAllBookings = (req, res) => {
    const query = `
        SELECT
            b.id AS booking_id,
            b.visit_date,
            b.visit_time,
            b.status,
            b.created_at,

            buyer.id AS user_id,
            buyer.name AS customer_name,
            buyer.email AS customer_email,

            p.id AS property_id,
            p.title,
            p.property_type,
            p.purpose,
            p.price,
            p.location,

            owner.name AS owner_name,
            owner.email AS owner_email

        FROM bookings b

        JOIN users buyer
            ON b.user_id = buyer.id

        JOIN properties p
            ON b.property_id = p.id

        JOIN users owner
            ON p.user_id = owner.id

        ORDER BY b.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(results);
    });
};

// ======================
// Update Booking Status
// ======================
const updateBookingStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Match the database ENUM values
    const allowedStatuses = [
        "Pending",
        "Approved",
        "Rejected"
    ];

    if (!status) {
        return res.status(400).json({
            message: "Booking status is required"
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message:
                "Invalid status. Use 'Pending', 'Approved', or 'Rejected'."
        });
    }

    const query = `
        UPDATE bookings
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [status, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Booking not found"
                });
            }

            res.status(200).json({
                message: "Booking status updated successfully",
                status: status
            });
        }
    );
};

// ======================
// Get All Inquiries
// ======================
const getAllInquiries = (req, res) => {
    const query = `
        SELECT
            i.id AS inquiry_id,
            i.message,
            i.created_at,

            buyer.id AS user_id,
            buyer.name AS customer_name,
            buyer.email AS customer_email,

            p.id AS property_id,
            p.title,
            p.property_type,
            p.purpose,
            p.price,
            p.location,

            owner.name AS owner_name,
            owner.email AS owner_email

        FROM inquiries i

        JOIN users buyer
            ON i.user_id = buyer.id

        JOIN properties p
            ON i.property_id = p.id

        JOIN users owner
            ON p.user_id = owner.id

        ORDER BY i.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(results);
    });
};

// ======================
// Dashboard Statistics
// ======================
const getDashboard = (req, res) => {
    const query = `
        SELECT
            (SELECT COUNT(*) FROM users) AS totalUsers,
            (SELECT COUNT(*) FROM properties) AS totalProperties,
            (SELECT COUNT(*) FROM bookings) AS totalBookings,
            (SELECT COUNT(*) FROM favorites) AS totalFavorites,
            (SELECT COUNT(*) FROM inquiries) AS totalInquiries
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(results[0]);
    });
};

// ======================
// Export Functions
// ======================
module.exports = {
    getAllUsers,
    deleteUser,
    getAllProperties,
    deleteProperty,
    getAllBookings,
    updateBookingStatus,
    getAllInquiries,
    getDashboard
};