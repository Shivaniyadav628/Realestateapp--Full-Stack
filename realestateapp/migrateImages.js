const fs = require("fs");
const path = require("path");
const db = require("./config/db");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

// ======================================================
// CLOUDINARY CONFIGURATION
// ======================================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======================================================
// UPLOAD IMAGE TO CLOUDINARY
// ======================================================

const uploadImage = (filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filePath,
            {
                folder: "realestateapp",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

// ======================================================
// MAIN MIGRATION
// ======================================================

async function migrateImages() {
    try {
        console.log("========================================");
        console.log("STARTING IMAGE MIGRATION");
        console.log("========================================\n");

        const uploadsPath = path.join(__dirname, "uploads");

        // Check uploads folder
        if (!fs.existsSync(uploadsPath)) {
            console.error("❌ uploads folder not found!");
            process.exit(1);
        }

        // Find all image files
        const files = fs
            .readdirSync(uploadsPath)
            .filter((file) => {
                const extension = path
                    .extname(file)
                    .toLowerCase();

                return [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".webp",
                    ".gif",
                ].includes(extension);
            });

        console.log(
            `Found ${files.length} image files in uploads folder.\n`
        );

        let successCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        // ==================================================
        // PROCESS EACH IMAGE
        // ==================================================

        for (const file of files) {
            try {
                console.log(`Processing: ${file}`);

                // Find properties using this filename
                const [properties] = await db
                    .promise()
                    .query(
                        `
                        SELECT id, title, image
                        FROM properties
                        WHERE image = ?
                        `,
                        [file]
                    );

                // No property uses this image
                if (properties.length === 0) {
                    console.log(
                        `⚠️ No database property uses ${file}`
                    );

                    skippedCount++;
                    console.log("");

                    continue;
                }

                // Local file path
                const filePath = path.join(
                    uploadsPath,
                    file
                );

                // Upload to Cloudinary
                const result = await uploadImage(filePath);

                const cloudinaryUrl =
                    result.secure_url;

                console.log(
                    `☁️ Uploaded to Cloudinary`
                );

                console.log(
                    `URL: ${cloudinaryUrl}`
                );

                // Update every property using this image
                for (const property of properties) {
                    await db
                        .promise()
                        .query(
                            `
                            UPDATE properties
                            SET image = ?
                            WHERE id = ?
                            `,
                            [
                                cloudinaryUrl,
                                property.id,
                            ]
                        );

                    console.log(
                        `✓ Updated property #${property.id}: ${property.title}`
                    );
                }

                successCount++;

                console.log("");
            } catch (error) {
                console.error(
                    `❌ Error processing ${file}:`,
                    error.message
                );

                errorCount++;

                console.log("");
            }
        }

        // ==================================================
        // SUMMARY
        // ==================================================

        console.log("========================================");
        console.log("IMAGE MIGRATION COMPLETE");
        console.log("========================================");

        console.log(
            `✓ Successfully migrated: ${successCount}`
        );

        console.log(
            `⚠️ Skipped: ${skippedCount}`
        );

        console.log(
            `❌ Failed: ${errorCount}`
        );

        console.log(
            "\n🎉 Image migration finished!"
        );

        process.exit(0);

    } catch (error) {
        console.error(
            "\n❌ Migration failed:",
            error.message
        );

        process.exit(1);
    }
}

// ======================================================
// START
// ======================================================

migrateImages();