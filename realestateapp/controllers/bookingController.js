const db = require("../config/db");

// ======================================================
// BOOK PROPERTY VISIT
// ======================================================

const bookVisit = (req, res) => {

    const user_id = req.user.id;

    const {
        property_id,
        visit_date,
        visit_time
    } = req.body;

    if (
        !property_id ||
        !visit_date ||
        !visit_time
    ) {
        return res.status(400).json({
            message:
                "All fields are required"
        });
    }

    // Check property exists
    const checkPropertyQuery = `
        SELECT id
        FROM properties
        WHERE id = ?
    `;

    db.query(
        checkPropertyQuery,
        [property_id],
        (err, propertyResult) => {

            if (err) {
                console.error(
                    "Check Property Error:",
                    err
                );

                return res.status(500).json({
                    message: err.message
                });
            }

            if (propertyResult.length === 0) {
                return res.status(404).json({
                    message:
                        "Property not found"
                });
            }

            const query = `
                INSERT INTO bookings
                (
                    user_id,
                    property_id,
                    visit_date,
                    visit_time,
                    status
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                query,
                [
                    user_id,
                    property_id,
                    visit_date,
                    visit_time,
                    "Pending"
                ],
                (err, result) => {

                    if (err) {
                        console.error(
                            "Book Visit Error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                err.message
                        });
                    }

                    return res.status(201).json({
                        message:
                            "Property visit booked successfully",

                        bookingId:
                            result.insertId
                    });
                }
            );
        }
    );
};


// ======================================================
// GET MY BOOKINGS
// ======================================================

const getMyBookings = (req, res) => {

    const user_id = req.user.id;

    const query = `
        SELECT

            b.id AS booking_id,
            b.visit_date,
            b.visit_time,
            b.status,
            b.created_at,

            p.id AS property_id,
            p.title,
            p.description,
            p.property_type,
            p.purpose,
            p.price,
            p.location,
            p.bedrooms,
            p.bathrooms,
            p.area,
            p.image,

            u.name AS owner_name,
            u.email AS owner_email

        FROM bookings b

        JOIN properties p
        ON b.property_id = p.id

        JOIN users u
        ON p.user_id = u.id

        WHERE b.user_id = ?

        ORDER BY b.created_at DESC
    `;

    db.query(
        query,
        [user_id],
        (err, results) => {

            if (err) {
                console.error(
                    "Get My Bookings Error:",
                    err
                );

                return res.status(500).json({
                    message: err.message
                });
            }

            return res.status(200).json(
                results
            );
        }
    );
};


// ======================================================
// CANCEL BOOKING
// ======================================================

const cancelBooking = (req, res) => {

    const user_id = req.user.id;

    const {
        id
    } = req.params;

    const query = `
        DELETE FROM bookings
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [
            id,
            user_id
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "Cancel Booking Error:",
                    err
                );

                return res.status(500).json({
                    message: err.message
                });
            }

            if (
                result.affectedRows === 0
            ) {
                return res.status(404).json({
                    message:
                        "Booking not found"
                });
            }

            return res.status(200).json({
                message:
                    "Booking cancelled successfully"
            });
        }
    );
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    bookVisit,
    getMyBookings,
    cancelBooking
};