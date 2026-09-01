
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/API";
import { buildImageUrl } from "../utils/imageUtils";

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // Fetch Favorites
  // =====================================================

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get("/favorites");

      console.log("Favorites Response:", response.data);

      setFavorites(
        Array.isArray(response.data)
          ? response.data
          : response.data.favorites || []
      );
    } catch (error) {
      console.error("Favorites Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to load favorites."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // =====================================================
  // Remove Favorite
  // =====================================================

  const removeFavorite = async (propertyId) => {
    try {
      await API.delete(`/favorites/${propertyId}`);

      setFavorites((previousFavorites) =>
        previousFavorites.filter(
          (property) =>
            property.id !== propertyId
        )
      );

      alert("Property removed from favorites.");
    } catch (error) {
      console.error(
        "Remove Favorite Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove favorite."
      );
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div style={centerStyle}>
        <h2>Loading Favorites...</h2>
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (message) {
    return (
      <div style={centerStyle}>
        <h2>{message}</h2>

        <Link to="/properties">
          Browse Properties
        </Link>
      </div>
    );
  }

  // =====================================================
  // Empty
  // =====================================================

  if (favorites.length === 0) {
    return (
      <div style={centerStyle}>
        <div style={{ fontSize: "55px" }}>
          ❤️
        </div>

        <h1>My Favorites</h1>

        <p style={{ color: "#64748b" }}>
          You haven't added any properties to your
          favorites yet.
        </p>

        <Link
          to="/properties"
          style={buttonStyle}
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  // =====================================================
  // Favorites
  // =====================================================

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "35px auto",
        padding: "20px",
      }}
    >
      <h1>❤️ My Favorites</h1>

      <p style={{ color: "#64748b" }}>
        You have {favorites.length} favorite
        {favorites.length !== 1 ? "s" : ""}.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "25px",
          marginTop: "25px",
        }}
      >
        {favorites.map((property) => (
          <FavoriteCard
            key={property.favorite_id || property.id}
            property={property}
            onRemove={removeFavorite}
          />
        ))}
      </div>
    </div>
  );
}

// =====================================================
// Favorite Card
// =====================================================

function FavoriteCard({
  property,
  onRemove,
}) {
  const [imageError, setImageError] =
    useState(false);

  const imageUrl = buildImageUrl(property.image);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={property.title}
          onError={() => setImageError(true)}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "200px",
            backgroundColor: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "60px",
          }}
        >
          🏠
        </div>
      )}

      <div style={{ padding: "20px" }}>
        <h2>{property.title}</h2>

        <p style={{ color: "#64748b" }}>
          📍 {property.location}
        </p>

        <h3 style={{ color: "#2563eb" }}>
          ₹
          {Number(property.price || 0).toLocaleString(
            "en-IN"
          )}
        </h3>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            color: "#475569",
            fontSize: "14px",
            marginBottom: "15px",
          }}
        >
          <span>
            🛏️ {property.bedrooms || "N/A"}
          </span>

          <span>
            🚿 {property.bathrooms || "N/A"}
          </span>

          <span>
            📐 {property.area || "N/A"} sq ft
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {/* FIXED ROUTE */}

          <Link
            to={`/properties/${property.id}`}
            style={{
              ...smallButton,
              backgroundColor: "#2563eb",
            }}
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={() =>
              onRemove(property.id)
            }
            style={{
              ...smallButton,
              backgroundColor: "#dc2626",
              border: "none",
            }}
          >
            Remove ❤️
          </button>
        </div>
      </div>
    </div>
  );
}

const centerStyle = {
  padding: "60px 20px",
  textAlign: "center",
};

const buttonStyle = {
  display: "inline-block",
  marginTop: "20px",
  padding: "12px 20px",
  backgroundColor: "#2563eb",
  color: "white",
  textDecoration: "none",
  borderRadius: "7px",
  fontWeight: "600",
};

const smallButton = {
  padding: "9px 13px",
  color: "white",
  textDecoration: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

export default Favorites;

