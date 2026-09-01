
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/API";
import { buildImageUrl } from "../utils/imageUtils";

function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [bookingMessage, setBookingMessage] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);

    const [inquiryMessage, setInquiryMessage] = useState("");
    const [inquiryStatus, setInquiryStatus] = useState("");
    const [inquiryLoading, setInquiryLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState("");
    const [reviewMessage, setReviewMessage] = useState("");

    const [imageError, setImageError] = useState(false);

    // =====================================================
    // FETCH PROPERTY + REVIEWS
    // =====================================================

    useEffect(() => {
        if (!id) {
            return;
        }

        fetchProperty();
        fetchReviews();
        checkIfFavorite();
    }, [id]);

    // =====================================================
    // FETCH PROPERTY
    // =====================================================

    const fetchProperty = async () => {
        try {
            setLoading(true);
            setMessage("");
            setImageError(false);

            const response = await API.get(
                `/properties/${id}`
            );

            console.log(
                "Property Details:",
                response.data
            );

            // Handle possible backend formats
            const propertyData =
                response.data?.property ||
                response.data?.data ||
                response.data;

            setProperty(propertyData);

        } catch (error) {
            console.error(
                "Property Error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Unable to load property."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CHECK IF FAVORITE
    // =====================================================

    const checkIfFavorite = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsFavorite(false);
                return;
            }

            const response = await API.get("/favorites");
            const favList = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.favorites)
                ? response.data.favorites
                : [];

            const found = favList.some(
                (fav) => (fav.id || fav.property_id) === Number(id)
            );
            setIsFavorite(found);
        } catch (error) {
            console.error("Check Favorite Error:", error);
            setIsFavorite(false);
        }
    };

    // =====================================================
    // ADD/REMOVE FAVORITE
    // =====================================================

    const handleToggleFavorite = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to add to favorites.");
                navigate("/login");
                return;
            }

            setFavoriteLoading(true);

            if (isFavorite) {
                await API.delete(`/favorites/${id}`);
                setIsFavorite(false);
                alert("Removed from favorites.");
            } else {
                await API.post("/favorites", {
                    property_id: Number(id),
                });
                setIsFavorite(true);
                alert("Added to favorites!");
            }
        } catch (error) {
            console.error("Toggle Favorite Error:", error);
            alert(
                error.response?.data?.message ||
                (isFavorite
                    ? "Failed to remove from favorites."
                    : "Failed to add to favorites.")
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

    // =====================================================
    // FETCH REVIEWS
    // =====================================================

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);
            setReviewMessage("");

            const response = await API.get(
                `/reviews/${id}`
            );

            console.log(
                "Reviews Response:",
                response.data
            );

            // Support different response formats
            if (
                Array.isArray(
                    response.data
                )
            ) {
                setReviews(
                    response.data
                );
            } else if (
                Array.isArray(
                    response.data?.reviews
                )
            ) {
                setReviews(
                    response.data.reviews
                );
            } else if (
                Array.isArray(
                    response.data?.data
                )
            ) {
                setReviews(
                    response.data.data
                );
            } else {
                setReviews([]);
            }

        } catch (error) {
            console.error(
                "Reviews Error:",
                error
            );

            setReviews([]);

            setReviewMessage(
                error.response?.data?.message ||
                "Unable to load reviews."
            );
        } finally {
            setReviewsLoading(false);
        }
    };

    // =====================================================
    // BOOK VISIT
    // =====================================================

    const handleBookVisit = async (e) => {
        e.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            alert(
                "Please login to book a property visit."
            );

            navigate("/login");
            return;
        }

        if (!visitDate) {
            setBookingMessage(
                "Please select a visit date."
            );

            return;
        }

        if (!visitTime) {
            setBookingMessage(
                "Please select a visit time."
            );

            return;
        }

        try {
            setBookingLoading(true);
            setBookingMessage("");

            const response =
                await API.post(
                    "/bookings",
                    {
                        property_id:
                            Number(id),

                        visit_date:
                            visitDate,

                        visit_time:
                            visitTime,
                    }
                );

            setBookingMessage(
                response.data?.message ||
                "Property visit booked successfully!"
            );

            setVisitDate("");
            setVisitTime("");

        } catch (error) {
            console.error(
                "Booking Error:",
                error
            );

            if (
                error.response?.status ===
                401
            ) {
                handleSessionExpired();
                return;
            }

            setBookingMessage(
                error.response?.data?.message ||
                "Failed to book property visit."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    // =====================================================
    // SEND INQUIRY
    // =====================================================

    const handleSendInquiry = async (e) => {
        e.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            alert(
                "Please login to send an inquiry."
            );

            navigate("/login");
            return;
        }

        if (!inquiryMessage.trim()) {
            setInquiryStatus(
                "Please enter your inquiry message."
            );

            return;
        }

        try {
            setInquiryLoading(true);
            setInquiryStatus("");

            const response =
                await API.post(
                    "/inquiries",
                    {
                        property_id:
                            Number(id),

                        message:
                            inquiryMessage.trim(),
                    }
                );

            setInquiryStatus(
                response.data?.message ||
                "Inquiry sent successfully!"
            );

            setInquiryMessage("");

        } catch (error) {
            console.error(
                "Inquiry Error:",
                error
            );

            if (
                error.response?.status ===
                401
            ) {
                handleSessionExpired();
                return;
            }

            setInquiryStatus(
                error.response?.data?.message ||
                "Failed to send inquiry."
            );
        } finally {
            setInquiryLoading(false);
        }
    };

    // =====================================================
    // SUBMIT REVIEW
    // =====================================================
    //
    // IMPORTANT:
    // The endpoint is currently kept as:
    //
    // POST /reviews/:id
    //
    // We will verify this against your backend
    // reviewRoutes.js before calling this finished.
    //
    // =====================================================

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            alert(
                "Please login to submit a review."
            );

            navigate("/login");
            return;
        }

        if (!comment.trim()) {
            setReviewMessage(
                "Please write a comment."
            );

            return;
        }

        if (
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            setReviewMessage(
                "Rating must be between 1 and 5."
            );

            return;
        }

        try {
            setSubmitting(true);
            setReviewMessage("");

            // Try multiple endpoints for compatibility
            let response;
            try {
                // Try the property ID endpoint first
                response = await API.post(`/reviews/${id}`, {
                    rating: Number(rating),
                    comment: comment.trim(),
                });
            } catch (err) {
                // Fallback: try POST /reviews with property_id
                if (err.response?.status === 404) {
                    response = await API.post("/reviews", {
                        property_id: Number(id),
                        rating: Number(rating),
                        comment: comment.trim(),
                    });
                } else {
                    throw err;
                }
            }

            setReviewMessage(
                response.data?.message || "Review submitted successfully."
            );
            setRating(5);
            setComment("");

            // Refresh reviews after delay
            setTimeout(() => fetchReviews(), 1000);

        } catch (error) {
            console.error(
                "Submit Review Error:",
                error.response?.data || error.message
            );

            if (error.response?.status === 401) {
                handleSessionExpired();
                return;
            }

            setReviewMessage(
                error.response?.data?.message ||
                error.message ||
                "Failed to submit review. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // SESSION EXPIRED
    // =====================================================

    const handleSessionExpired = () => {
        localStorage.removeItem("token");
        localStorage.removeItem(
            "isLoggedIn"
        );
        localStorage.removeItem("user");

        alert(
            "Your session has expired. Please login again."
        );

        navigate("/login");
    };

    // =====================================================
    // BUILD IMAGE URL
    // =====================================================

    const getImageUrl = () => buildImageUrl(property?.image);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div style={centerStyle}>
                <div
                    style={{
                        fontSize: "50px",
                        marginBottom: "10px",
                    }}
                >
                    🏠
                </div>

                <h2>
                    Loading Property...
                </h2>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (message) {
        return (
            <div style={centerStyle}>
                <h2>{message}</h2>

                <Link to="/properties">
                    ← Back to Properties
                </Link>
            </div>
        );
    }

    if (!property) {
        return (
            <div style={centerStyle}>
                <h2>
                    Property Not Found
                </h2>

                <Link to="/properties">
                    ← Back to Properties
                </Link>
            </div>
        );
    }

    const imageUrl =
        getImageUrl();

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div
            style={{
                flex: 1,

                backgroundColor:
                    "#f8fafc",

                padding:
                    "35px 20px 70px",
            }}
        >
            <div
                style={{
                    maxWidth:
                        "1000px",

                    margin:
                        "0 auto",
                }}
            >

                {/* =========================================
                    BACK
                ========================================= */}

                <Link
                    to="/properties"
                    style={{
                        display:
                            "inline-block",

                        marginBottom:
                            "20px",

                        textDecoration:
                            "none",

                        color:
                            "#2563eb",

                        fontWeight:
                            "600",
                    }}
                >
                    ← Back to Properties
                </Link>


                {/* =========================================
                    PROPERTY
                ========================================= */}

                <div
                    style={
                        sectionStyle
                    }
                >

                    {/* IMAGE */}

                    {imageUrl &&
                    !imageError ? (
                        <img
                            src={imageUrl}
                            alt={
                                property.title ||
                                "Property"
                            }
                            onError={() =>
                                setImageError(
                                    true
                                )
                            }
                            style={{
                                width:
                                    "100%",

                                height:
                                    "430px",

                                objectFit:
                                    "cover",

                                borderRadius:
                                    "10px",

                                marginBottom:
                                    "25px",

                                display:
                                    "block",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width:
                                    "100%",

                                height:
                                    "300px",

                                backgroundColor:
                                    "#e2e8f0",

                                borderRadius:
                                    "10px",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                flexDirection:
                                    "column",

                                fontSize:
                                    "65px",

                                marginBottom:
                                    "25px",
                            }}
                        >
                            🏠

                            <span
                                style={{
                                    fontSize:
                                        "13px",

                                    color:
                                        "#64748b",

                                    marginTop:
                                        "5px",
                                }}
                            >
                                No image available
                            </span>
                        </div>
                    )}


                    {/* TITLE & FAVORITES */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "15px",
                            marginBottom: "15px",
                            flexWrap: "wrap",
                        }}
                    >
                        <h1
                            style={{
                                margin: "0",
                                color: "#282c3f",
                                fontSize: "32px",
                                flex: 1,
                            }}
                        >
                            {property.title}
                        </h1>

                        <button
                            type="button"
                            onClick={handleToggleFavorite}
                            disabled={favoriteLoading}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: isFavorite
                                    ? "#ef4444"
                                    : "#f3f4f6",
                                color: isFavorite
                                    ? "white"
                                    : "#374151",
                                border: isFavorite
                                    ? "none"
                                    : "2px solid #d1d5db",
                                borderRadius: "8px",
                                cursor: favoriteLoading
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize: "16px",
                                fontWeight: "600",
                                opacity: favoriteLoading ? 0.7 : 1,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
                        </button>
                    </div>


                    {/* LOCATION */}

                    <p
                        style={{
                            color:
                                "#696b79",

                            fontSize:
                                "16px",

                            margin:
                                "0 0 15px",
                        }}
                    >
                        📍{" "}
                        {
                            property.location ||
                            "Location unavailable"
                        }
                    </p>


                    {/* DESCRIPTION */}

                    <p
                        style={{
                            color:
                                "#475569",

                            fontSize:
                                "16px",

                            lineHeight:
                                "1.7",

                            margin:
                                "0",
                        }}
                    >
                        {
                            property.description ||
                            "No description available."
                        }
                    </p>


                    <hr
                        style={{
                            margin:
                                "25px 0",

                            border:
                                "none",

                            borderTop:
                                "1px solid #e2e8f0",
                        }}
                    />


                    {/* PROPERTY INFORMATION */}

                    <h2>
                        Property Information
                    </h2>

                    <div
                        style={
                            infoGrid
                        }
                    >
                        <InfoItem
                            title="Property Type"
                            value={
                                property.property_type
                            }
                        />

                        <InfoItem
                            title="Purpose"
                            value={
                                property.purpose
                            }
                        />

                        <InfoItem
                            title="Price"
                            value={`₹${Number(
                                property.price ||
                                    0
                            ).toLocaleString(
                                "en-IN"
                            )}`}
                        />

                        <InfoItem
                            title="Location"
                            value={
                                property.location
                            }
                        />

                        <InfoItem
                            title="Bedrooms"
                            value={
                                property.bedrooms ||
                                "N/A"
                            }
                        />

                        <InfoItem
                            title="Bathrooms"
                            value={
                                property.bathrooms ||
                                "N/A"
                            }
                        />

                        <InfoItem
                            title="Area"
                            value={
                                property.area
                                    ? `${property.area} sq ft`
                                    : "N/A"
                            }
                        />

                        <InfoItem
                            title="Status"
                            value={
                                property.status ||
                                "Available"
                            }
                        />
                    </div>


                    <hr
                        style={{
                            margin:
                                "25px 0",

                            border:
                                "none",

                            borderTop:
                                "1px solid #e2e8f0",
                        }}
                    />


                    {/* OWNER */}

                    <h2>
                        Owner Information
                    </h2>

                    <p>
                        <strong>
                            Name:
                        </strong>{" "}
                        {
                            property.owner_name ||
                            "Not available"
                        }
                    </p>

                    <p>
                        <strong>
                            Email:
                        </strong>{" "}
                        {
                            property.owner_email ||
                            "Not available"
                        }
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            if (
                                !property.owner_email
                            ) {
                                alert(
                                    "Owner email is not available."
                                );

                                return;
                            }

                            window.open(
                                `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                    property.owner_email
                                )}`,
                                "_blank"
                            );
                        }}
                        style={
                            primaryButton
                        }
                    >
                        Contact Owner
                    </button>
                </div>


                {/* =========================================
                    INQUIRY
                ========================================= */}

                <div
                    style={
                        sectionStyle
                    }
                >
                    <h2>
                        ✉️ Send an Inquiry
                    </h2>

                    <p
                        style={
                            mutedText
                        }
                    >
                        Have a question about this
                        property? Send a message to
                        the property owner.
                    </p>

                    <form
                        onSubmit={
                            handleSendInquiry
                        }
                    >
                        <label
                            style={
                                labelStyle
                            }
                        >
                            Your Message
                        </label>

                        <textarea
                            value={
                                inquiryMessage
                            }
                            onChange={(e) =>
                                setInquiryMessage(
                                    e.target.value
                                )
                            }
                            placeholder="Ask the owner about the property..."
                            rows="5"
                            style={
                                textareaStyle
                            }
                        />

                        {inquiryStatus && (
                            <StatusMessage
                                message={
                                    inquiryStatus
                                }
                            />
                        )}

                        <button
                            type="submit"
                            disabled={
                                inquiryLoading
                            }
                            style={{
                                ...primaryButton,

                                width:
                                    "100%",

                                backgroundColor:
                                    inquiryLoading
                                        ? "#93c5fd"
                                        : "#2563eb",
                            }}
                        >
                            {inquiryLoading
                                ? "Sending..."
                                : "✉️ Send Inquiry"}
                        </button>
                    </form>
                </div>


                {/* =========================================
                    BOOKING
                ========================================= */}

                <div
                    style={
                        sectionStyle
                    }
                >
                    <h2>
                        📅 Book a Property Visit
                    </h2>

                    <p
                        style={
                            mutedText
                        }
                    >
                        Select a date and time to
                        schedule your property visit.
                    </p>

                    <form
                        onSubmit={
                            handleBookVisit
                        }
                    >
                        <label
                            style={
                                labelStyle
                            }
                        >
                            Visit Date
                        </label>

                        <input
                            type="date"
                            value={
                                visitDate
                            }
                            min={
                                today
                            }
                            onChange={(e) =>
                                setVisitDate(
                                    e.target.value
                                )
                            }
                            style={
                                inputStyle
                            }
                        />

                        <label
                            style={
                                labelStyle
                            }
                        >
                            Visit Time
                        </label>

                        <input
                            type="time"
                            value={
                                visitTime
                            }
                            onChange={(e) =>
                                setVisitTime(
                                    e.target.value
                                )
                            }
                            style={
                                inputStyle
                            }
                        />

                        {bookingMessage && (
                            <StatusMessage
                                message={
                                    bookingMessage
                                }
                            />
                        )}

                        <button
                            type="submit"
                            disabled={
                                bookingLoading
                            }
                            style={{
                                ...primaryButton,

                                width:
                                    "100%",

                                backgroundColor:
                                    bookingLoading
                                        ? "#86efac"
                                        : "#16a34a",
                            }}
                        >
                            {bookingLoading
                                ? "Booking..."
                                : "📅 Book Visit"}
                        </button>
                    </form>
                </div>


                {/* =========================================
                    REVIEWS
                ========================================= */}

                <div
                    style={
                        sectionStyle
                    }
                >
                    <h2>
                        ⭐ Ratings & Reviews
                    </h2>

                    <p
                        style={
                            mutedText
                        }
                    >
                        See what other users think about
                        this property.
                    </p>


                    {/* WRITE REVIEW */}

                    <form
                        onSubmit={
                            handleSubmitReview
                        }
                    >
                        <h3>
                            Write a Review
                        </h3>

                        <label
                            style={
                                labelStyle
                            }
                        >
                            Your Rating
                        </label>

                        <div
                            style={{
                                display:
                                    "flex",

                                gap:
                                    "3px",

                                marginBottom:
                                    "20px",
                            }}
                        >
                            {[1, 2, 3, 4, 5].map(
                                (star) => (
                                    <button
                                        key={
                                            star
                                        }
                                        type="button"
                                        onClick={() =>
                                            setRating(
                                                star
                                            )
                                        }
                                        style={{
                                            border:
                                                "none",

                                            background:
                                                "transparent",

                                            fontSize:
                                                "30px",

                                            cursor:
                                                "pointer",

                                            color:
                                                star <=
                                                rating
                                                    ? "#f59e0b"
                                                    : "#cbd5e1",
                                        }}
                                    >
                                        ★
                                    </button>
                                )
                            )}
                        </div>


                        <label
                            style={
                                labelStyle
                            }
                        >
                            Your Review
                        </label>

                        <textarea
                            value={
                                comment
                            }
                            onChange={(e) =>
                                setComment(
                                    e.target.value
                                )
                            }
                            placeholder="Write your review..."
                            rows="5"
                            style={
                                textareaStyle
                            }
                        />

                        {reviewMessage && (
                            <StatusMessage
                                message={
                                    reviewMessage
                                }
                            />
                        )}

                        <button
                            type="submit"
                            disabled={
                                submitting
                            }
                            style={{
                                ...primaryButton,

                                opacity:
                                    submitting
                                        ? 0.7
                                        : 1,
                            }}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>
                    </form>


                    <hr
                        style={{
                            margin:
                                "30px 0",

                            border:
                                "none",

                            borderTop:
                                "1px solid #e2e8f0",
                        }}
                    />


                    {/* CUSTOMER REVIEWS */}

                    <h3>
                        Customer Reviews
                    </h3>

                    {reviewsLoading ? (
                        <p
                            style={
                                mutedText
                            }
                        >
                            Loading reviews...
                        </p>
                    ) : reviews.length ===
                      0 ? (
                        <p
                            style={
                                mutedText
                            }
                        >
                            No reviews yet. Be the
                            first to review this
                            property!
                        </p>
                    ) : (
                        reviews.map(
                            (review) => {

                                const reviewRating =
                                    Math.min(
                                        5,
                                        Math.max(
                                            0,
                                            Number(
                                                review.rating
                                            ) || 0
                                        )
                                    );

                                return (
                                    <div
                                        key={
                                            review.id
                                        }
                                        style={{
                                            padding:
                                                "18px 0",

                                            borderBottom:
                                                "1px solid #e2e8f0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display:
                                                    "flex",

                                                justifyContent:
                                                    "space-between",

                                                gap:
                                                    "10px",

                                                flexWrap:
                                                    "wrap",
                                            }}
                                        >
                                            <strong>
                                                {
                                                    review.user_name ||
                                                    "Anonymous"
                                                }
                                            </strong>

                                            <span
                                                style={{
                                                    color:
                                                        "#f59e0b",

                                                    fontSize:
                                                        "19px",
                                                }}
                                            >
                                                {"★".repeat(
                                                    reviewRating
                                                )}

                                                <span
                                                    style={{
                                                        color:
                                                            "#cbd5e1",
                                                    }}
                                                >
                                                    {"★".repeat(
                                                        5 -
                                                            reviewRating
                                                    )}
                                                </span>
                                            </span>
                                        </div>

                                        <p
                                            style={{
                                                color:
                                                    "#334155",

                                                lineHeight:
                                                    "1.6",
                                            }}
                                        >
                                            {
                                                review.comment ||
                                                "No comment provided."
                                            }
                                        </p>

                                        <small
                                            style={{
                                                color:
                                                    "#94a3b8",
                                            }}
                                        >
                                            {review.created_at
                                                ? new Date(
                                                      review.created_at
                                                  ).toLocaleDateString(
                                                      "en-IN"
                                                  )
                                                : ""}
                                        </small>
                                    </div>
                                );
                            }
                        )
                    )}
                </div>

            </div>
        </div>
    );
}


// =====================================================
// SMALL COMPONENTS
// =====================================================

function InfoItem({
    title,
    value,
}) {
    return (
        <div>
            <strong>
                {title}
            </strong>

            <p
                style={{
                    marginTop:
                        "5px",

                    color:
                        "#475569",

                    marginBottom:
                        "0",
                }}
            >
                {value ||
                    "N/A"}
            </p>
        </div>
    );
}


function StatusMessage({
    message,
}) {
    const success =
        message
            .toLowerCase()
            .includes(
                "success"
            );

    return (
        <div
            style={{
                padding:
                    "12px",

                margin:
                    "15px 0",

                borderRadius:
                    "8px",

                backgroundColor:
                    success
                        ? "#dcfce7"
                        : "#fee2e2",

                color:
                    success
                        ? "#166534"
                        : "#b91c1c",
            }}
        >
            {message}
        </div>
    );
}


// =====================================================
// STYLES
// =====================================================

const centerStyle = {
    minHeight:
        "60vh",

    display:
        "flex",

    flexDirection:
        "column",

    justifyContent:
        "center",

    alignItems:
        "center",

    padding:
        "60px 20px",

    textAlign:
        "center",

    backgroundColor:
        "#f8fafc",
};


const sectionStyle = {
    marginTop:
        "25px",

    backgroundColor:
        "#ffffff",

    padding:
        "28px",

    borderRadius:
        "12px",

    boxShadow:
        "0 4px 15px rgba(0,0,0,0.06)",

    border:
        "1px solid #eaeaec",
};


const infoGrid = {
    display:
        "grid",

    gridTemplateColumns:
        "repeat(auto-fit, minmax(190px, 1fr))",

    gap:
        "18px",

    marginTop:
        "20px",
};


const mutedText = {
    color:
        "#64748b",

    lineHeight:
        "1.6",
};


const labelStyle = {
    display:
        "block",

    fontWeight:
        "600",

    marginBottom:
        "8px",

    color:
        "#282c3f",
};


const inputStyle = {
    width:
        "100%",

    padding:
        "12px",

    border:
        "1px solid #cbd5e1",

    borderRadius:
        "8px",

    boxSizing:
        "border-box",

    fontSize:
        "15px",

    marginBottom:
        "20px",

    outline:
        "none",
};


const textareaStyle = {
    width:
        "100%",

    padding:
        "13px",

    border:
        "1px solid #cbd5e1",

    borderRadius:
        "8px",

    resize:
        "vertical",

    boxSizing:
        "border-box",

    fontSize:
        "15px",

    marginBottom:
        "5px",

    fontFamily:
        "inherit",

    outline:
        "none",
};


const primaryButton = {
    padding:
        "12px 24px",

    backgroundColor:
        "#2563eb",

    color:
        "#ffffff",

    border:
        "none",

    borderRadius:
        "7px",

    cursor:
        "pointer",

    fontSize:
        "15px",

    fontWeight:
        "600",
};


export default PropertyDetails;

