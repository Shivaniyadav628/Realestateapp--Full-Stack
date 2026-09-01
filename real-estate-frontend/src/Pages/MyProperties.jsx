
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/API";
import { buildImageUrl } from "../utils/imageUtils";

function MyProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =====================================================
  // Check Admin
  // =====================================================

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const user = getUser();
  const isAdmin = user?.role === "admin";

  // =====================================================
  // Fetch My Properties
  // =====================================================

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!isAdmin) {
        setMessage(
          "Only the administrator can manage properties."
        );
        return;
      }

      const response = await API.get("/properties/my");

      console.log(
        "My Properties Response:",
        response.data
      );

      setProperties(
        Array.isArray(response.data)
          ? response.data
          : response.data.properties || []
      );
    } catch (error) {
      console.error("My Properties Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load your properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  // =====================================================
  // Delete Property
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/properties/${id}`);

      alert("Property deleted successfully!");

      setProperties((previousProperties) =>
        previousProperties.filter(
          (property) => property.id !== id
        )
      );
    } catch (error) {
      console.error("Delete Property Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete property."
      );
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div style={centerStyle}>
        <h2>Loading Properties...</h2>
      </div>
    );
  }

  // =====================================================
  // Unauthorized
  // =====================================================

  if (!isAdmin) {
    return (
      <div style={centerStyle}>
        <h2>Access Restricted</h2>

        <p style={{ color: "#64748b" }}>
          Only the administrator can manage properties.
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
  // Main
  // =====================================================

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "35px auto",
        padding: "20px",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "5px" }}>
            My Properties 🏠
          </h1>

          <p style={{ color: "#64748b" }}>
            Manage properties listed by the administrator.
          </p>
        </div>

        <Link
          to="/add-property"
          style={buttonStyle}
        >
          + Add Property
        </Link>
      </div>

      {/* Error */}

      {message && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
          }}
        >
          {message}
        </div>
      )}

      {/* Empty */}

      {!message && properties.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#f8fafc",
            borderRadius: "10px",
          }}
        >
          <div style={{ fontSize: "50px" }}>
            🏠
          </div>

          <h2>No Properties Yet</h2>

          <p style={{ color: "#64748b" }}>
            Add your first property to EstateHub.
          </p>

          <Link
            to="/add-property"
            style={buttonStyle}
          >
            Add Property
          </Link>
        </div>
      )}

      {/* Grid */}

      {properties.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          {properties.map((property) => {
            const imageUrl = buildImageUrl(property.image);

            return (
              <PropertyAdminCard
                key={property.id}
                property={property}
                imageUrl={imageUrl}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// =====================================================
// Admin Property Card
// =====================================================

function PropertyAdminCard({
  property,
  imageUrl,
  onDelete,
}) {
  const [imageError, setImageError] =
    useState(false);

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
            height: "210px",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "210px",
            backgroundColor: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "65px",
          }}
        >
          🏠
        </div>
      )}

      <div style={{ padding: "20px" }}>
        <h2 style={{ marginTop: 0 }}>
          {property.title}
        </h2>

        <p style={{ color: "#64748b" }}>
          {property.description}
        </p>

        <p>
          <strong>Type:</strong>{" "}
          {property.property_type}
        </p>

        <p>
          <strong>Purpose:</strong>{" "}
          {property.purpose}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {property.location}
        </p>

        <p>
          <strong>Price:</strong> ₹
          {Number(property.price || 0).toLocaleString(
            "en-IN"
          )}
        </p>

        <p>
          <strong>Bedrooms:</strong>{" "}
          {property.bedrooms || "N/A"}
        </p>

        <p>
          <strong>Bathrooms:</strong>{" "}
          {property.bathrooms || "N/A"}
        </p>

        <p>
          <strong>Area:</strong>{" "}
          {property.area
            ? `${property.area} sq ft`
            : "N/A"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {property.status || "Available"}
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          {/* IMPORTANT: properties, not property */}

          <Link
            to={`/properties/${property.id}`}
            style={{
              ...smallButton,
              backgroundColor: "#2563eb",
            }}
          >
            View Details
          </Link>

          <Link
            to={`/edit-property/${property.id}`}
            style={{
              ...smallButton,
              backgroundColor: "#1e3a8a",
            }}
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() =>
              onDelete(property.id)
            }
            style={{
              ...smallButton,
              backgroundColor: "#dc2626",
              border: "none",
            }}
          >
            Delete
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
  marginTop: "10px",
  padding: "11px 18px",
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

export default MyProperties;

