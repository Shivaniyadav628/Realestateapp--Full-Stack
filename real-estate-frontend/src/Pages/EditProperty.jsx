import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/API";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "",
    purpose: "",
    price: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    status: "Available",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // ======================
  // Fetch Property Details
  // ======================
  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/properties/${id}`);

      const property = response.data;

      setFormData({
        title: property.title || "",
        description: property.description || "",
        property_type: property.property_type || "",
        purpose: property.purpose || "",
        price: property.price || "",
        location: property.location || "",
        bedrooms: property.bedrooms || "",
        bathrooms: property.bathrooms || "",
        area: property.area || "",
        status: property.status || "Available",
      });
    } catch (error) {
      console.error("Fetch Property Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load property"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Handle Input Change
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ======================
  // Update Property
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await API.put(
        `/properties/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Property Updated Successfully"
      );

      setTimeout(() => {
        navigate("/my-properties");
      }, 1000);

    } catch (error) {
      console.error("Update Property Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update property"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ======================
  // Loading
  // ======================
  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>Loading Property...</h2>
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1>Edit Property</h1>

        <p>
          Update your property information.
        </p>

        {message && (
          <p
            style={{
              color: message
                .toLowerCase()
                .includes("success")
                ? "green"
                : "red",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div style={{ marginBottom: "15px" }}>
            <label>Property Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "15px" }}>
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* Property Type */}
          <div style={{ marginBottom: "15px" }}>
            <label>Property Type</label>

            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            >
              <option value="">
                Select Property Type
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
            </select>
          </div>

          {/* Purpose */}
          <div style={{ marginBottom: "15px" }}>
            <label>Purpose</label>

            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            >
              <option value="">
                Select Purpose
              </option>

              <option value="Sale">
                Sale
              </option>

              <option value="Rent">
                Rent
              </option>
            </select>
          </div>

          {/* Price */}
          <div style={{ marginBottom: "15px" }}>
            <label>Price</label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* Location */}
          <div style={{ marginBottom: "15px" }}>
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* Bedrooms */}
          <div style={{ marginBottom: "15px" }}>
            <label>Bedrooms</label>

            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* Bathrooms */}
          <div style={{ marginBottom: "15px" }}>
            <label>Bathrooms</label>

            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* Area */}
          <div style={{ marginBottom: "15px" }}>
            <label>Area (sq ft)</label>

            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            />
          </div>

          {/* Status */}
          <div style={{ marginBottom: "20px" }}>
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
              }}
            >
              <option value="Available">
                Available
              </option>

              <option value="Sold">
                Sold
              </option>

              <option value="Rented">
                Rented
              </option>
            </select>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={updating}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {updating
              ? "Updating Property..."
              : "Update Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProperty;