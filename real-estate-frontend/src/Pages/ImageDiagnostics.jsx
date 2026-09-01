import React, { useEffect, useState } from "react";
import API from "../api/API";
import { buildImageUrl, getBackendUrl } from "../utils/imageUtils";

/**
 * IMAGE DIAGNOSTICS PAGE
 * 
 * Helps identify why images aren't loading by showing:
 * - Backend URL configuration
 * - Raw image paths from backend
 * - Built URLs
 * - Network requests/errors
 */

function ImageDiagnostics() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendUrl, setBackendUrl] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setBackendUrl(getBackendUrl());
                setLoading(true);
                setError(null);

                const response = await API.get("/properties");

                console.log("API Response:", response.data);

                let properties = [];
                if (Array.isArray(response.data)) {
                    properties = response.data;
                } else if (Array.isArray(response.data?.properties)) {
                    properties = response.data.properties;
                } else if (Array.isArray(response.data?.data)) {
                    properties = response.data.data;
                }

                setProperties(properties.slice(0, 5)); // First 5 properties

            } catch (err) {
                console.error("Error fetching properties:", err);
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to fetch properties"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
            <h1>🖼️ Image Diagnostics</h1>

            {/* Backend Configuration */}
            <div style={sectionStyle}>
                <h2>Backend Configuration</h2>
                <p><strong>Backend URL:</strong> <code>{backendUrl}</code></p>
                <p><strong>API Base URL:</strong> <code>{API.defaults.baseURL}</code></p>
                <p><strong>Status:</strong> {backendUrl ? "✅ Configured" : "❌ Not configured"}</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div style={sectionStyle}>
                    <p>Loading properties...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div style={{ ...sectionStyle, backgroundColor: "#fee2e2", borderColor: "#dc2626" }}>
                    <h2 style={{ color: "#dc2626" }}>❌ Error</h2>
                    <p>{error}</p>
                </div>
            )}

            {/* Properties Table */}
            {!loading && !error && properties.length > 0 && (
                <div style={sectionStyle}>
                    <h2>Properties & Image URLs</h2>
                    <p>Total: {properties.length} properties shown</p>

                    <div style={{ overflowX: "auto" }}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Title</th>
                                    <th style={thStyle}>Raw Image Path</th>
                                    <th style={thStyle}>Built URL</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((property, idx) => {
                                    const rawImage = property.image || "N/A";
                                    const builtUrl = buildImageUrl(property.image);

                                    return (
                                        <tr key={idx}>
                                            <td style={tdStyle}>{property.id}</td>
                                            <td style={tdStyle}>{property.title}</td>
                                            <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "12px" }}>
                                                {rawImage === "N/A" ? (
                                                    <span style={{ color: "#ef4444" }}>No image path</span>
                                                ) : (
                                                    rawImage
                                                )}
                                            </td>
                                            <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "12px", wordBreak: "break-all" }}>
                                                {builtUrl ? (
                                                    <a href={builtUrl} target="_blank" rel="noopener noreferrer">
                                                        {builtUrl.slice(0, 50)}...
                                                    </a>
                                                ) : (
                                                    <span style={{ color: "#ef4444" }}>Could not build URL</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                {!rawImage || rawImage === "N/A" ? (
                                                    <span style={{ color: "#ef4444" }}>❌ No path</span>
                                                ) : builtUrl ? (
                                                    <span style={{ color: "#16a34a" }}>✅ URL built</span>
                                                ) : (
                                                    <span style={{ color: "#ef4444" }}>❌ Failed</span>
                                                )}
                                            </td>
                                            <td style={tdStyle}>
                                                {builtUrl ? (
                                                    <ImageThumbnail url={builtUrl} />
                                                ) : (
                                                    <span style={{ color: "#94a3b8" }}>N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No Properties */}
            {!loading && !error && properties.length === 0 && (
                <div style={sectionStyle}>
                    <p style={{ color: "#ef4444" }}>No properties found in backend</p>
                </div>
            )}

            {/* Troubleshooting Guide */}
            <div style={sectionStyle}>
                <h2>🔧 Troubleshooting Checklist</h2>
                <ul>
                    <li>
                        <strong>No image path in "Raw Image Path" column:</strong>
                        <br />→ Backend is not returning image paths. Check backend code.
                    </li>
                    <li>
                        <strong>Built URL shows but image doesn't load:</strong>
                        <br />→ Click the URL link above. Does it show "404 Not Found"?
                        <br />→ Check if backend is serving static files at `/uploads`
                    </li>
                    <li>
                        <strong>Browser shows CORS error in console:</strong>
                        <br />→ Backend needs CORS headers configured
                    </li>
                    <li>
                        <strong>Backend URL is wrong:</strong>
                        <br />→ Update `src/api/API.js` baseURL to your actual port
                    </li>
                    <li>
                        <strong>Images not uploaded to backend:</strong>
                        <br />→ Check if upload directory exists on backend
                        <br />→ Check file permissions
                    </li>
                </ul>
            </div>

            {/* Browser Console Instructions */}
            <div style={{ ...sectionStyle, backgroundColor: "#f0f9ff", borderColor: "#0284c7" }}>
                <h3 style={{ color: "#0284c7" }}>📋 Next Steps</h3>
                <ol>
                    <li>Open Browser DevTools: Press <code>F12</code></li>
                    <li>Go to <strong>Network</strong> tab</li>
                    <li>Reload this page</li>
                    <li>Look for failed image requests (red ❌)</li>
                    <li>Click on each failed request to see error details</li>
                    <li>Share the error message and I'll help fix it</li>
                </ol>
            </div>
        </div>
    );
}

/**
 * Image Thumbnail Component
 * Shows if image loads successfully
 */
function ImageThumbnail({ url }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div style={{ position: "relative" }}>
            {error ? (
                <div style={{ color: "#ef4444", fontSize: "12px" }}>
                    ❌ Failed to load
                </div>
            ) : loaded ? (
                <span style={{ color: "#16a34a" }}>✅ Loaded</span>
            ) : (
                <span style={{ color: "#f59e0b" }}>⏳ Loading...</span>
            )}
            <img
                src={url}
                alt="test"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                style={{ display: "none" }}
            />
        </div>
    );
}

// =====================================================
// Styles
// =====================================================

const sectionStyle = {
    backgroundColor: "#ffffff",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
};

const thStyle = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    color: "#1e293b",
};

const tdStyle = {
    border: "1px solid #e2e8f0",
    padding: "12px",
    color: "#475569",
};

export default ImageDiagnostics;
