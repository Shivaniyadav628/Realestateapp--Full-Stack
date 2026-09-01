const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

// File Filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpg|jpeg|png/;

    const isValid =
        allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG and PNG images are allowed"));
    }

};

// Multer Upload
const upload = multer({

    storage,
    fileFilter

});

module.exports = upload;