const db = require("../config/db");

// ======================================================
// ADD FAVORITE
// ======================================================

const addFavorite = (req, res) => {

    console.log("===== ADD FAVORITE REQUEST =====");

    const user_id = req.user.id;

    const {
        property_id
    } = req.body;

    // Validate
    if (!property_id) {
        return res.status(400).json({
            message:
                "Property ID is required"
        });
    }

    // Check property exists
    const propertyQuery = `
        SELECT id
        FROM properties
        WHERE id = ?
    `;

    db.query(
        propertyQuery,
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

            // Insert favorite
            const query = `
                INSERT INTO favorites
                (
                    user_id,
                    property_id
                )
                VALUES (?, ?)
            `;

            db.query(
                query,
                [
                    user_id,
                    property_id
                ],
                (err, result) => {

                    if (err) {

                        console.error(
                            "Add Favorite Error:",
                            err
                        );

                        if (
                            err.code ===
                            "ER_DUP_ENTRY"
                        ) {
                            return res.status(400).json({
                                message:
                                    "Property already added to favorites"
                            });
                        }

                        return res.status(500).json({
                            message:
                                err.message
                        });
                    }

                    return res.status(201).json({
                        message:
                            "Property added to favorites successfully",

                        favoriteId:
                            result.insertId
                    });
                }
            );
        }
    );
};


// ======================================================
// GET MY FAVORITES
// ======================================================

const getFavorites = (req, res) => {

    const user_id = req.user.id;

    const query = `
        SELECT
            f.id AS favorite_id,

            p.*,

            u.name AS owner_name,
            u.email AS owner_email

        FROM favorites f

        JOIN properties p
        ON f.property_id = p.id

        JOIN users u
        ON p.user_id = u.id

        WHERE f.user_id = ?

        ORDER BY f.created_at DESC
    `;

    db.query(
        query,
        [user_id],
        (err, results) => {

            if (err) {
                console.error(
                    "Get Favorites Error:",
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
// REMOVE FAVORITE
// ======================================================

const removeFavorite = (req, res) => {

    const user_id = req.user.id;

    const {
        propertyId
    } = req.params;

    const query = `
        DELETE FROM favorites
        WHERE user_id = ?
        AND property_id = ?
    `;

    db.query(
        query,
        [
            user_id,
            propertyId
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "Remove Favorite Error:",
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
                        "Favorite not found"
                });
            }

            return res.status(200).json({
                message:
                    "Property removed from favorites successfully"
            });
        }
    );
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite
};