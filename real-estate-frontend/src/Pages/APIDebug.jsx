import React, { useState, useEffect } from "react";
import API from "../api/API";

/**
 * DEBUG PAGE - Shows exactly what's happening with the API connection
 * 
 * Visit: http://localhost:5173/api-debug (after adding route in App.jsx)
 * 
 * This page displays:
 * 1. Backend connection status
 * 2. Raw API response data
 * 3. Parsed property list
 * 4. Any errors encountered
 */

function APIDebug() {
    const [status, setStatus] = useState("Checking...");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const testAPI = async () => {
            try {
                setStatus("🔄 Connecting to backend...");
                setError(null);

                console.log("API Base URL:", API.defaults.baseURL);
                console.log("Timeout:", API.defaults.timeout);

                const response = await API.get("/properties");

                setStatus("✅ Connected Successfully!");
                setData(response.data);
                setError(null);

                console.log("Full Response:", response);
                console.log("Response Data:", response.data);

            } catch (err) {
                console.error("API Error Details:", err);

                setStatus("❌ Connection Failed");

                if (err.code === "ECONNREFUSED") {
                    setError(
                        `Connection refused - Backend not running on port 5000. 
                        Error: ${err.message}`
                    );
                } else if (err.response) {
                    setError(
                        `Server responded with error. 
                        Status: ${err.response.status}
                        Message: ${err.response.data?.message || err.message}`
                    );
                } else if (err.request) {
                    setError(
                        `No response from server. 
                        Check if backend is running at http://localhost:5000
                        Error: ${err.message}`
                    );
                } else {
                    setError(`Error: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        testAPI();
    }, []);

    // Parse the data based on different possible formats
    const parseProperties = () => {
        if (!data) return null;

        if (Array.isArray(data)) {
            return data;
        } else if (Array.isArray(data.properties)) {
            return data.properties;
        } else if (Array.isArray(data.data)) {
            return data.data;
        }
        return null;
    };

    const properties = parseProperties();

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1200px",
                margin: "0 auto",
                fontFamily: "monospace",
            }}
        >
            <h1>🔧 API Debug Console</h1>

            {/* Status Section */}
            <div
                style={{
                    padding: "20px",
                    marginBottom: "20px",
                    backgroundColor:
                        status.includes("✅") ? "#d1fae5" :
                        status.includes("❌") ? "#fee2e2" :
                        "#fef3c7",
                    border: "2px solid #999",
                    borderRadius: "8px",
                }}
            >
                <h2 style={{ margin: "0 0 10px" }}>Status</h2>
                <p style={{ fontSize: "16px", margin: 0 }}>
                    {status}
                </p>
            </div>

            {/* Error Section */}
            {error && (
                <div
                    style={{
                        padding: "20px",
                        marginBottom: "20px",
                        backgroundColor: "#fee2e2",
                        border: "2px solid #dc2626",
                        borderRadius: "8px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    }}
                >
                    <h2 style={{ margin: "0 0 10px", color: "#dc2626" }}>
                        ❌ Error
                    </h2>
                    <p style={{ margin: 0, color: "#991b1b" }}>
                        {error}
                    </p>
                </div>
            )}

            {/* Raw Response Data */}
            <div
                style={{
                    padding: "20px",
                    marginBottom: "20px",
                    backgroundColor: "#f3f4f6",
                    border: "2px solid #6b7280",
                    borderRadius: "8px",
                    overflow: "auto",
                    maxHeight: "300px",
                }}
            >
                <h2 style={{ margin: "0 0 10px" }}>
                    Raw API Response
                </h2>
                <pre
                    style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#1f2937",
                    }}
                >
                    {data
                        ? JSON.stringify(data, null, 2)
                        : loading
                            ? "Loading..."
                            : "No data"}
                </pre>
            </div>

            {/* Parsed Properties */}
            {properties && (
                <div
                    style={{
                        padding: "20px",
                        marginBottom: "20px",
                        backgroundColor: "#ecfdf5",
                        border: "2px solid #059669",
                        borderRadius: "8px",
                    }}
                >
                    <h2 style={{ margin: "0 0 10px", color: "#059669" }}>
                        ✅ Parsed Properties ({properties.length})
                    </h2>

                    {properties.length === 0 ? (
                        <p style={{ color: "#047857" }}>
                            Backend returned empty array
                        </p>
                    ) : (
                        <div style={{ marginTop: "10px" }}>
                            {properties.slice(0, 5).map(
                                (prop, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: "10px",
                                            marginBottom: "10px",
                                            backgroundColor:
                                                "#d1fae5",
                                            border:
                                                "1px solid #6ee7b7",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <strong>
                                            {prop.title ||
                                            prop.name ||
                                            "Untitled"}
                                        </strong>
                                        <br />
                                        <small>
                                            ID: {prop.id ||
                                            prop._id ||
                                            "N/A"}
                                        </small>
                                        <br />
                                        <small>
                                            Location:{" "}
                                            {prop.location ||
                                            prop.address ||
                                            "N/A"}
                                        </small>
                                        <br />
                                        <small>
                                            Price: ₹
                                            {Number(
                                                prop.price ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </small>
                                    </div>
                                )
                            )}
                            {properties.length > 5 && (
                                <p style={{ color: "#047857" }}>
                                    ... and{" "}
                                    {properties.length - 5}{" "}
                                    more properties
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#eff6ff",
                    border: "2px solid #3b82f6",
                    borderRadius: "8px",
                }}
            >
                <h3 style={{ margin: "0 0 10px", color: "#1e40af" }}>
                    📋 What to Do Next
                </h3>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    <li>
                        If status shows ❌: <strong>Backend is not running</strong>
                    </li>
                    <li>
                        If data shows empty array: <strong>Backend has no properties</strong>
                    </li>
                    <li>
                        If properties show: <strong>Problem is in frontend rendering</strong>
                    </li>
                    <li>
                        Open browser console (F12) to see detailed error logs
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default APIDebug;
