
import React, { useEffect, useState } from "react";
import API from "../api/API";
import PropertyCard from "../components/PropertyCard";

function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // SEARCH & FILTER STATES
    // =====================================================

    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [purpose, setPurpose] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("");

    // =====================================================
    // FETCH PROPERTIES
    // =====================================================

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/properties");

            console.log(
                "Properties API response:",
                response.data
            );

            // =================================================
            // HANDLE DIFFERENT POSSIBLE BACKEND RESPONSES
            // =================================================
            //
            // Direct array:
            // [
            //   {...},
            //   {...}
            // ]
            //
            // OR:
            //
            // {
            //   properties: [...]
            // }
            // =================================================

            let propertyData = [];

            if (Array.isArray(response.data)) {
                propertyData = response.data;
            } else if (
                Array.isArray(response.data?.properties)
            ) {
                propertyData =
                    response.data.properties;
            } else if (
                Array.isArray(response.data?.data)
            ) {
                propertyData =
                    response.data.data;
            }

            setProperties(propertyData);

        } catch (error) {
            console.error(
                "Error fetching properties:",
                error
            );

            setProperties([]);

            setError(
                error?.response?.data?.message ||
                "Unable to load properties. Please check your backend server."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FILTER PROPERTIES
    // =====================================================

    const filteredProperties =
        properties.filter((property) => {

            const propertyLocation =
                String(
                    property?.location || ""
                ).toLowerCase();

            const searchLocation =
                location
                    .toLowerCase()
                    .trim();

            const matchesLocation =
                !searchLocation ||
                propertyLocation.includes(
                    searchLocation
                );

            const matchesType =
                !propertyType ||
                String(
                    property?.property_type || ""
                ).toLowerCase() ===
                    propertyType.toLowerCase();

            const matchesPurpose =
                !purpose ||
                String(
                    property?.purpose || ""
                ).toLowerCase() ===
                    purpose.toLowerCase();

            const price =
                Number(
                    property?.price || 0
                );

            const matchesMinPrice =
                !minPrice ||
                price >= Number(minPrice);

            const matchesMaxPrice =
                !maxPrice ||
                price <= Number(maxPrice);

            return (
                matchesLocation &&
                matchesType &&
                matchesPurpose &&
                matchesMinPrice &&
                matchesMaxPrice
            );
        });

    // =====================================================
    // SORT PROPERTIES
    // =====================================================

    const sortedProperties =
        [...filteredProperties].sort(
            (a, b) => {

                if (sortBy === "price-low") {
                    return (
                        Number(a.price || 0) -
                        Number(b.price || 0)
                    );
                }

                if (sortBy === "price-high") {
                    return (
                        Number(b.price || 0) -
                        Number(a.price || 0)
                    );
                }

                if (sortBy === "newest") {
                    return (
                        new Date(
                            b.created_at || 0
                        ) -
                        new Date(
                            a.created_at || 0
                        )
                    );
                }

                return 0;
            }
        );

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setLocation("");
        setPropertyType("");
        setPurpose("");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("");
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            style={{
                flex: 1,

                width: "100%",

                boxSizing: "border-box",

                backgroundColor: "#f8fafc",

                padding:
                    "50px 30px 70px",
            }}
        >

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div
                style={{
                    maxWidth: "1200px",

                    margin:
                        "0 auto 35px",

                    textAlign:
                        "center",
                }}
            >
                <h1
                    style={{
                        fontSize:
                            "38px",

                        color:
                            "#282c3f",

                        margin:
                            "0 0 10px",

                        fontWeight:
                            "800",
                    }}
                >
                    Explore Properties 🏡
                </h1>

                <p
                    style={{
                        color:
                            "#696b79",

                        fontSize:
                            "17px",

                        margin: 0,
                    }}
                >
                    Find a place that feels like home.
                </p>
            </div>


            {/* =================================================
                SEARCH & FILTER
            ================================================= */}

            {!loading && !error && (
                <div
                    style={{
                        maxWidth:
                            "1200px",

                        margin:
                            "0 auto 35px",

                        backgroundColor:
                            "#ffffff",

                        padding:
                            "25px",

                        borderRadius:
                            "12px",

                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.06)",

                        border:
                            "1px solid #eaeaec",
                    }}
                >

                    <h2
                        style={{
                            margin:
                                "0 0 20px",

                            color:
                                "#282c3f",

                            fontSize:
                                "20px",
                        }}
                    >
                        Search & Filter
                    </h2>

                    <div
                        style={{
                            display:
                                "grid",

                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(180px, 1fr))",

                            gap:
                                "15px",
                        }}
                    >

                        {/* LOCATION */}

                        <input
                            type="text"
                            placeholder="📍 Location"
                            value={location}
                            onChange={(e) =>
                                setLocation(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />


                        {/* PROPERTY TYPE */}

                        <select
                            value={
                                propertyType
                            }
                            onChange={(e) =>
                                setPropertyType(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="">
                                🏠 All Property Types
                            </option>

                            <option value="House">
                                House
                            </option>

                            <option value="Apartment">
                                Apartment
                            </option>

                            <option value="Villa">
                                Villa
                            </option>

                            <option value="Land">
                                Land
                            </option>

                            <option value="Commercial">
                                Commercial
                            </option>
                        </select>


                        {/* PURPOSE */}

                        <select
                            value={purpose}
                            onChange={(e) =>
                                setPurpose(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="">
                                🔑 Sale or Rent
                            </option>

                            <option value="Sale">
                                Sale
                            </option>

                            <option value="Rent">
                                Rent
                            </option>
                        </select>


                        {/* MINIMUM PRICE */}

                        <input
                            type="number"
                            min="0"
                            placeholder="₹ Minimum Price"
                            value={minPrice}
                            onChange={(e) =>
                                setMinPrice(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />


                        {/* MAXIMUM PRICE */}

                        <input
                            type="number"
                            min="0"
                            placeholder="₹ Maximum Price"
                            value={maxPrice}
                            onChange={(e) =>
                                setMaxPrice(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        />


                        {/* SORT */}

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="">
                                ↕️ Sort By
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="newest">
                                Newest First
                            </option>
                        </select>

                    </div>


                    {/* CLEAR FILTERS */}

                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        style={{
                            marginTop:
                                "20px",

                            padding:
                                "11px 20px",

                            backgroundColor:
                                "#64748b",

                            color:
                                "#ffffff",

                            border:
                                "none",

                            borderRadius:
                                "6px",

                            cursor:
                                "pointer",

                            fontSize:
                                "14px",

                            fontWeight:
                                "600",
                        }}
                    >
                        🔄 Clear Filters
                    </button>

                </div>
            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
                <div
                    style={{
                        minHeight:
                            "40vh",

                        display:
                            "flex",

                        justifyContent:
                            "center",

                        alignItems:
                            "center",

                        flexDirection:
                            "column",
                    }}
                >
                    <div
                        style={{
                            fontSize:
                                "45px",

                            marginBottom:
                                "10px",
                        }}
                    >
                        🏠
                    </div>

                    <h2
                        style={{
                            color:
                                "#282c3f",

                            margin:
                                "0 0 5px",
                        }}
                    >
                        Loading properties...
                    </h2>

                    <p
                        style={{
                            color:
                                "#64748b",
                        }}
                    >
                        Please wait a moment.
                    </p>
                </div>
            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (
                <div
                    style={{
                        maxWidth:
                            "600px",

                        margin:
                            "50px auto",

                        textAlign:
                            "center",

                        backgroundColor:
                            "#ffffff",

                        padding:
                            "40px",

                        borderRadius:
                            "12px",

                        border:
                            "1px solid #fecaca",

                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.05)",
                    }}
                >

                    <div
                        style={{
                            fontSize:
                                "45px",
                        }}
                    >
                        ⚠️
                    </div>

                    <h3
                        style={{
                            color:
                                "#dc2626",

                            marginBottom:
                                "10px",
                        }}
                    >
                        Unable to Load Properties
                    </h3>

                    <p
                        style={{
                            color:
                                "#64748b",

                            marginBottom:
                                "20px",
                        }}
                    >
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            fetchProperties
                        }
                        style={{
                            padding:
                                "11px 22px",

                            backgroundColor:
                                "#2563eb",

                            color:
                                "#ffffff",

                            border:
                                "none",

                            borderRadius:
                                "6px",

                            cursor:
                                "pointer",

                            fontSize:
                                "14px",

                            fontWeight:
                                "600",
                        }}
                    >
                        Try Again
                    </button>

                </div>
            )}


            {/* =================================================
                RESULTS
            ================================================= */}

            {!loading && !error && (
                <div
                    style={{
                        maxWidth:
                            "1200px",

                        margin:
                            "0 auto 20px",
                    }}
                >
                    <p
                        style={{
                            color:
                                "#696b79",

                            fontSize:
                                "15px",

                            margin:
                                "0",
                        }}
                    >
                        Showing{" "}
                        <strong
                            style={{
                                color:
                                    "#282c3f",
                            }}
                        >
                            {
                                sortedProperties.length
                            }
                        </strong>{" "}
                        {sortedProperties.length ===
                        1
                            ? "property"
                            : "properties"}
                    </p>
                </div>
            )}


            {/* =================================================
                NO PROPERTIES
            ================================================= */}

            {!loading &&
                !error &&
                sortedProperties.length ===
                    0 && (
                    <div
                        style={{
                            maxWidth:
                                "600px",

                            margin:
                                "40px auto",

                            textAlign:
                                "center",

                            backgroundColor:
                                "#ffffff",

                            padding:
                                "50px 30px",

                            borderRadius:
                                "12px",

                            border:
                                "1px solid #eaeaec",
                        }}
                    >
                        <div
                            style={{
                                fontSize:
                                    "55px",

                                marginBottom:
                                    "10px",
                            }}
                        >
                            🏠
                        </div>

                        <h2
                            style={{
                                color:
                                    "#282c3f",

                                margin:
                                    "0 0 10px",
                            }}
                        >
                            No properties found
                        </h2>

                        <p
                            style={{
                                color:
                                    "#64748b",

                                margin:
                                    "0 0 20px",
                            }}
                        >
                            Try changing your
                            search or filters.
                        </p>

                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            style={{
                                padding:
                                    "10px 20px",

                                backgroundColor:
                                    "#2563eb",

                                color:
                                    "#ffffff",

                                border:
                                    "none",

                                borderRadius:
                                    "6px",

                                cursor:
                                    "pointer",

                                fontWeight:
                                    "600",
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}


            {/* =================================================
                PROPERTY CARDS
            ================================================= */}

            {!loading &&
                !error &&
                sortedProperties.length >
                    0 && (
                    <div
                        style={{
                            maxWidth:
                                "1200px",

                            margin:
                                "0 auto",

                            display:
                                "grid",

                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(280px, 1fr))",

                            gap:
                                "28px",

                            alignItems:
                                "stretch",
                        }}
                    >
                        {sortedProperties.map(
                            (property) => (
                                <PropertyCard
                                    key={
                                        property.id
                                    }
                                    property={
                                        property
                                    }
                                />
                            )
                        )}
                    </div>
                )}

        </div>
    );
}


// =====================================================
// INPUT STYLE
// =====================================================

const inputStyle = {
    width: "100%",

    boxSizing: "border-box",

    padding: "12px",

    border:
        "1px solid #cbd5e1",

    borderRadius:
        "6px",

    fontSize:
        "14px",

    backgroundColor:
        "#ffffff",

    color:
        "#282c3f",

    outline: "none",
};


export default Properties;

