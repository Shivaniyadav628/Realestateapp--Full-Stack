
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildImageUrl } from "../utils/imageUtils";

function PropertyCard({ property }) {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (!property) {
        return null;
    }

    // =====================================================
    // PROPERTY ID
    // =====================================================

    const propertyId = property.id;

    // =====================================================
    // BUILD IMAGE URL
    // =====================================================

    const imageUrl = buildImageUrl(property.image);

    // =====================================================
    // VIEW DETAILS
    // =====================================================

    const handleViewDetails = () => {
        if (!propertyId) {
            console.error(
                "Property ID is missing:",
                property
            );

            return;
        }

        navigate(`/properties/${propertyId}`);
    };

    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = () => {
        console.error(
            "Property image could not be loaded:",
            imageUrl
        );

        setImageError(true);
    };

    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",

                boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",

                transition:
                    "transform 0.2s ease, box-shadow 0.2s ease",

                border: "1px solid #eaeaec",

                height: "100%",

                display: "flex",
                flexDirection: "column",
            }}
        >

            {/* =================================================
                PROPERTY IMAGE
            ================================================= */}

            <div
                style={{
                    width: "100%",
                    height: "220px",

                    backgroundColor: "#f1f5f9",

                    overflow: "hidden",

                    position: "relative",
                }}
            >
                {imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={
                            property.title ||
                            "Property"
                        }
                        onError={handleImageError}
                        style={{
                            width: "100%",
                            height: "100%",

                            objectFit: "cover",

                            display: "block",

                            transition:
                                "transform 0.3s ease",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",

                            display: "flex",

                            justifyContent:
                                "center",

                            alignItems:
                                "center",

                            flexDirection:
                                "column",

                            color: "#64748b",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "55px",
                                marginBottom: "5px",
                            }}
                        >
                            🏠
                        </div>

                        <span
                            style={{
                                fontSize: "13px",
                            }}
                        >
                            No image available
                        </span>
                    </div>
                )}

                {/* PROPERTY PURPOSE BADGE */}

                {property.purpose && (
                    <span
                        style={{
                            position: "absolute",

                            top: "12px",
                            left: "12px",

                            backgroundColor:
                                "#ff3f6c",

                            color: "#ffffff",

                            padding:
                                "6px 10px",

                            borderRadius:
                                "5px",

                            fontSize: "12px",

                            fontWeight: "700",

                            textTransform:
                                "uppercase",
                        }}
                    >
                        {property.purpose}
                    </span>
                )}
            </div>

            {/* =================================================
                PROPERTY INFORMATION
            ================================================= */}

            <div
                style={{
                    padding: "20px",

                    display: "flex",

                    flexDirection:
                        "column",

                    flex: 1,
                }}
            >

                {/* TITLE */}

                <h2
                    style={{
                        margin:
                            "0 0 9px",

                        color: "#282c3f",

                        fontSize: "20px",

                        fontWeight: "700",

                        lineHeight: "1.3",
                    }}
                >
                    {property.title ||
                        "Untitled Property"}
                </h2>

                {/* LOCATION */}

                <p
                    style={{
                        color: "#696b79",

                        margin:
                            "0 0 12px",

                        fontSize: "14px",

                        lineHeight: "1.5",
                    }}
                >
                    📍{" "}
                    {property.location ||
                        "Location unavailable"}
                </p>

                {/* PRICE */}

                <h3
                    style={{
                        color: "#2563eb",

                        margin:
                            "0 0 14px",

                        fontSize: "21px",

                        fontWeight: "700",
                    }}
                >
                    ₹
                    {Number(
                        property.price || 0
                    ).toLocaleString(
                        "en-IN"
                    )}
                </h3>

                {/* =================================================
                    PROPERTY TAGS
                ================================================= */}

                <div
                    style={{
                        display: "flex",

                        gap: "8px",

                        flexWrap:
                            "wrap",

                        marginBottom:
                            "15px",
                    }}
                >
                    <span
                        style={{
                            backgroundColor:
                                "#eff6ff",

                            color:
                                "#1d4ed8",

                            padding:
                                "5px 9px",

                            borderRadius:
                                "5px",

                            fontSize:
                                "13px",

                            fontWeight:
                                "500",
                        }}
                    >
                        {property.property_type ||
                            "Property"}
                    </span>

                    {property.area && (
                        <span
                            style={{
                                backgroundColor:
                                    "#f8fafc",

                                color:
                                    "#475569",

                                padding:
                                    "5px 9px",

                                borderRadius:
                                    "5px",

                                fontSize:
                                    "13px",
                            }}
                        >
                            {property.area}{" "}
                            sq.ft
                        </span>
                    )}
                </div>

                {/* =================================================
                    BEDROOM / BATHROOM
                ================================================= */}

                {(property.bedrooms ||
                    property.bathrooms) && (
                    <div
                        style={{
                            display:
                                "flex",

                            gap: "15px",

                            flexWrap:
                                "wrap",

                            marginBottom:
                                "15px",

                            color:
                                "#475569",

                            fontSize:
                                "14px",
                        }}
                    >
                        {property.bedrooms && (
                            <span>
                                🛏️{" "}
                                {
                                    property.bedrooms
                                }{" "}
                                Bedrooms
                            </span>
                        )}

                        {property.bathrooms && (
                            <span>
                                🚿{" "}
                                {
                                    property.bathrooms
                                }{" "}
                                Bathrooms
                            </span>
                        )}
                    </div>
                )}

                {/* =================================================
                    OWNER
                ================================================= */}

                {property.owner_name && (
                    <p
                        style={{
                            color:
                                "#64748b",

                            fontSize:
                                "13px",

                            margin:
                                "0 0 15px",
                        }}
                    >
                        👤 Listed by:{" "}
                        {
                            property.owner_name
                        }
                    </p>
                )}

                {/* =================================================
                    SPACER

                    Keeps buttons aligned when cards have
                    different amounts of content.
                ================================================= */}

                <div
                    style={{
                        flex: 1,
                    }}
                />

                {/* =================================================
                    VIEW DETAILS
                ================================================= */}

                <button
                    type="button"
                    onClick={
                        handleViewDetails
                    }
                    style={{
                        width: "100%",

                        padding:
                            "12px",

                        backgroundColor:
                            "#2563eb",

                        color:
                            "#ffffff",

                        border: "none",

                        borderRadius:
                            "6px",

                        cursor:
                            "pointer",

                        fontSize:
                            "15px",

                        fontWeight:
                            "600",

                        transition:
                            "background-color 0.2s ease",

                        marginTop:
                            "5px",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "#2563eb";
                    }}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

export default PropertyCard;

