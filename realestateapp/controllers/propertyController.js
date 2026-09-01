const db = require("../config/db");

// ======================================================
// ADD PROPERTY
// ======================================================

const addProperty = (req, res) => {

    console.log("===== ADD PROPERTY REQUEST =====");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);

    // User ID from JWT
    const user_id = req.user.id;

    const {
        title,
        description,
        property_type,
        purpose,
        price,
        location,
        bedrooms,
        bathrooms,
        area,
        status
    } = req.body;

    // Uploaded image
    const image =
        req.file
            ? req.file.filename
            : null;

    // Required fields
    if (
        !title ||
        !description ||
        !property_type ||
        !purpose ||
        !price ||
        !location
    ) {
        return res.status(400).json({
            message:
                "Please fill all required property fields"
        });
    }

    const query = `
        INSERT INTO properties
        (
            user_id,
            title,
            description,
            property_type,
            purpose,
            price,
            location,
            bedrooms,
            bathrooms,
            area,
            image,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            user_id,
            title,
            description,
            property_type,
            purpose,
            price,
            location,
            bedrooms || null,
            bathrooms || null,
            area || null,
            image,
            status || "Available"
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "Add Property Error:",
                    err
                );

                return res.status(500).json({
                    message: err.message
                });
            }

            console.log(
                "Property added successfully. ID:",
                result.insertId
            );

            return res.status(201).json({
                message:
                    "Property Added Successfully",
                propertyId:
                    result.insertId
            });
        }
    );
};


// ======================================================
// GET ALL PROPERTIES
// ======================================================

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

    db.query(
        query,
        (err, results) => {

            if (err) {
                console.error(
                    "Get Properties Error:",
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
// GET MY PROPERTIES
// ======================================================

const getMyProperties = (req, res) => {

    const user_id = req.user.id;

    const query = `
        SELECT
            p.*,
            u.name AS owner_name,
            u.email AS owner_email
        FROM properties p
        JOIN users u
        ON p.user_id = u.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
    `;

    db.query(
        query,
        [user_id],
        (err, results) => {

            if (err) {
                console.error(
                    "Get My Properties Error:",
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
// GET SINGLE PROPERTY
// ======================================================

const getPropertyById = (req, res) => {

    const {
        id
    } = req.params;

    const query = `
        SELECT
            p.*,
            u.name AS owner_name,
            u.email AS owner_email
        FROM properties p
        JOIN users u
        ON p.user_id = u.id
        WHERE p.id = ?
    `;

    db.query(
        query,
        [id],
        (err, results) => {

            if (err) {
                console.error(
                    "Get Property Error:",
                    err
                );

                return res.status(500).json({
                    message: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message:
                        "Property Not Found"
                });
            }

            return res.status(200).json(
                results[0]
            );
        }
    );
};


// ======================================================
// UPDATE PROPERTY
// ======================================================

const updateProperty = (req, res) => {

    const {
        id
    } = req.params;

    const user_id = req.user.id;

    const {
        title,
        description,
        property_type,
        purpose,
        price,
        location,
        bedrooms,
        bathrooms,
        area,
        status
    } = req.body;

    // Check required fields
    if (
        !title ||
        !description ||
        !property_type ||
        !purpose ||
        !price ||
        !location
    ) {
        return res.status(400).json({
            message:
                "Please fill all required property fields"
        });
    }

    // First get current property
    const getQuery = `
        SELECT image
        FROM properties
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        getQuery,
        [id, user_id],
        (err, results) => {

            if (err) {
                console.error(
                    "Find Property Error:",
                    err
                );

                return res.status(500).json({
                    message: err.message
                });
            }

            // Property doesn't belong to user
            if (results.length === 0) {
                return res.status(403).json({
                    message:
                        "You are not authorized to update this property"
                });
            }

            // Keep old image if no new image uploaded
            const currentImage =
                results[0].image;

            const newImage =
                req.file
                    ? req.file.filename
                    : currentImage;

            const updateQuery = `
                UPDATE properties
                SET
                    title = ?,
                    description = ?,
                    property_type = ?,
                    purpose = ?,
                    price = ?,
                    location = ?,
                    bedrooms = ?,
                    bathrooms = ?,
                    area = ?,
                    image = ?,
                    status = ?
                WHERE id = ?
                AND user_id = ?
            `;

            db.query(
                updateQuery,
                [
                    title,
                    description,
                    property_type,
                    purpose,
                    price,
                    location,
                    bedrooms || null,
                    bathrooms || null,
                    area || null,
                    newImage,
                    status || "Available",
                    id,
                    user_id
                ],
                (err, result) => {

                    if (err) {
                        console.error(
                            "Update Property Error:",
                            err
                        );

                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    return res.status(200).json({
                        message:
                            "Property Updated Successfully"
                    });
                }
            );
        }
    );
};


// ======================================================
// DELETE PROPERTY
// ======================================================

const deleteProperty = (req, res) => {

    const {
        id
    } = req.params;

    const user_id = req.user.id;

    const query = `
        DELETE FROM properties
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [id, user_id],
        (err, result) => {

            if (err) {
                console.error(
                    "Delete Property Error:",
                    err
                );

                return res.status(500).json({
                    message: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(403).json({
                    message:
                        "You are not authorized to delete this property"
                });
            }

            return res.status(200).json({
                message:
                    "Property Deleted Successfully"
            });
        }
    );
};


// ======================================================
// SEARCH PROPERTIES
// ======================================================

const searchProperties = (req, res) => {

    const {
        location,
        property_type,
        purpose,
        minPrice,
        maxPrice
    } = req.query;

    let query = `
        SELECT
            p.*,
            u.name AS owner_name,
            u.email AS owner_email
        FROM properties p
        JOIN users u
        ON p.user_id = u.id
        WHERE 1=1
    `;

    const values = [];

    // Location
    if (location) {

        query += `
            AND p.location LIKE ?
        `;

        values.push(
            `%${location}%`
        );
    }

    // Property type
    if (property_type) {

        query += `
            AND p.property_type = ?
        `;

        values.push(
            property_type
        );
    }

    // Purpose
    if (purpose) {

        query += `
            AND p.purpose = ?
        `;

        values.push(
            purpose
        );
    }

    // Price range
    if (minPrice && maxPrice) {

        query += `
            AND p.price BETWEEN ? AND ?
        `;

        values.push(
            minPrice,
            maxPrice
        );

    } else if (minPrice) {

        query += `
            AND p.price >= ?
        `;

        values.push(
            minPrice
        );

    } else if (maxPrice) {

        query += `
            AND p.price <= ?
        `;

        values.push(
            maxPrice
        );
    }

    query += `
        ORDER BY p.created_at DESC
    `;

    db.query(
        query,
        values,
        (err, results) => {

            if (err) {
                console.error(
                    "Search Property Error:",
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
// EXPORT
// ======================================================

module.exports = {
    addProperty,
    getAllProperties,
    getPropertyById,
    getMyProperties,
    updateProperty,
    deleteProperty,
    searchProperties
};