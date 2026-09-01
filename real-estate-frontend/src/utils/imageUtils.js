/**
 * Image URL Builder
 * 
 * Dynamically constructs image URLs based on the backend configuration.
 * Handles multiple image path formats from the backend.
 */

import API from "../api/API";

/**
 * Get the backend base URL
 * Extracts from the API.js baseURL config
 */
export const getBackendUrl = () => {
    // Extract base URL from API instance
    const baseURL = API.defaults.baseURL;
    
    // Remove '/api' suffix if present
    if (baseURL?.endsWith("/api")) {
        return baseURL.slice(0, -4); // Remove last 4 chars (/api)
    }
    
    return baseURL || "http://localhost:5000";
};

/**
 * Build complete image URL from various formats
 * 
 * Supports:
 * - Full URLs: https://example.com/image.jpg
 * - Absolute paths: /uploads/image.jpg
 * - Relative paths: uploads/image.jpg
 * - Filenames: image.jpg
 */
export const buildImageUrl = (imagePath) => {
    if (!imagePath) {
        return null;
    }

    const image = String(imagePath).trim();

    if (!image) {
        return null;
    }

    // 1. Complete URL (http:// or https://)
    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    const backendUrl = getBackendUrl();

    // 2. Path starting with /
    // /uploads/image.jpg → http://localhost:5000/uploads/image.jpg
    if (image.startsWith("/")) {
        return `${backendUrl}${image}`;
    }

    // 3. Path starting with uploads/
    // uploads/image.jpg → http://localhost:5000/uploads/image.jpg
    if (image.startsWith("uploads/")) {
        return `${backendUrl}/${image}`;
    }

    // 4. Just filename
    // image.jpg → http://localhost:5000/uploads/image.jpg
    return `${backendUrl}/uploads/${image}`;
};

