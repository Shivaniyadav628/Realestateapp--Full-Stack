const db = require("../config/db");

// ======================================================
// SEND INQUIRY
// ======================================================

const sendInquiry = (req, res) => {

    const user_id = req.user.id;

    const {
        property_id,
        message
    } = req.body;

    if (!property_id || !message) {
        return res.status(400).json({
            message: "All fields are required"
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
                INSERT INTO inquiries
                (
                    user_id,
                    property_id,
                    message
                )
                VALUES (?, ?, ?)
            `;

            db.query(
                query,
                [
                    user_id,
                    property_id,
                    message
                ],
                (err, result) => {

                    if (err) {
                        console.error(
                            "Send Inquiry Error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                err.message
                        });
                    }

                    return res.status(201).json({
                        message:
                            "Inquiry sent successfully",

                        inquiryId:
                            result.insertId
                    });
                }
            );
        }
    );
};


// ======================================================
// GET MY INQUIRIES
// ======================================================

const getMyInquiries = (req, res) => {

    const user_id = req.user.id;

    const query = `
        SELECT

            i.id AS inquiry_id,
            i.message,
            i.created_at,

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

        FROM inquiries i

        JOIN properties p
        ON i.property_id = p.id

        JOIN users u
        ON p.user_id = u.id

        WHERE i.user_id = ?

        ORDER BY i.created_at DESC
    `;

    db.query(
        query,
        [user_id],
        (err, results) => {

            if (err) {
                console.error(
                    "Get My Inquiries Error:",
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
// DELETE INQUIRY
// ======================================================

const deleteInquiry = (req, res) => {

    const user_id = req.user.id;

    const {
        id
    } = req.params;

    const query = `
        DELETE FROM inquiries
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
                    "Delete Inquiry Error:",
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
                        "Inquiry not found"
                });
            }

            return res.status(200).json({
                message:
                    "Inquiry deleted successfully"
            });
        }
    );
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    sendInquiry,
    getMyInquiries,
    deleteInquiry
};