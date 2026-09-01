import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/API";

function AddProperty() {
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

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ======================
  // Handle Input Changes
  // ======================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================
  // Handle Image Change
  // ======================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const imagePreview = URL.createObjectURL(file);
    setPreview(imagePreview);
  };

  // ======================
  // Submit Property
  // ======================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      const propertyData = new FormData();

      propertyData.append("title", formData.title);
      propertyData.append(
        "description",
        formData.description
      );
      propertyData.append(
        "property_type",
        formData.property_type
      );
      propertyData.append(
        "purpose",
        formData.purpose
      );
      propertyData.append(
        "price",
        formData.price
      );
      propertyData.append(
        "location",
        formData.location
      );

      // Optional fields
      if (formData.bedrooms) {
        propertyData.append(
          "bedrooms",
          formData.bedrooms
        );
      }

      if (formData.bathrooms) {
        propertyData.append(
          "bathrooms",
          formData.bathrooms
        );
      }

      if (formData.area) {
        propertyData.append(
          "area",
          formData.area
        );
      }

      propertyData.append(
        "status",
        formData.status
      );

      // Image
      if (image) {
        propertyData.append("image", image);
      }

      console.log("Sending property data...");

      const response = await API.post(
        "/properties",
        propertyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Property Added Successfully:",
        response.data
      );

      alert("Property added successfully! 🏠");

      navigate("/my-properties");

    } catch (error) {
      console.error(
        "Add Property Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add property"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#1e3a8a",
        }}
      >
        Add New Property 🏠
      </h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Property Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <textarea
          name="description"
          placeholder="Property Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          style={inputStyle}
        />

        <select
          name="property_type"
          value={formData.property_type}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">
            Select Property Type
          </option>

          <option value="Apartment">
            Apartment
          </option>

          <option value="Villa">
            Villa
          </option>

          <option value="House">
            House
          </option>

          <option value="Plot">
            Plot
          </option>

          <option value="Commercial">
            Commercial
          </option>
        </select>

        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          style={inputStyle}
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

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          min="1"
          style={inputStyle}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          value={formData.bedrooms}
          onChange={handleChange}
          min="0"
          style={inputStyle}
        />

        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
          min="0"
          style={inputStyle}
        />

        <input
          type="number"
          name="area"
          placeholder="Area (sq ft)"
          value={formData.area}
          onChange={handleChange}
          min="1"
          style={inputStyle}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={inputStyle}
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

        {/* Image Upload */}

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          Property Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            marginBottom: "20px",
          }}
        />

        {/* Image Preview */}

        {preview && (
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <p>
              <strong>Image Preview:</strong>
            </p>

            <img
              src={preview}
              alt="Property Preview"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading
              ? "#94a3b8"
              : "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Adding Property..."
            : "Add Property"}
        </button>

      </form>
    </div>
  );
}


// ======================
// Common Input Style
// ======================

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
  boxSizing: "border-box",
};


export default AddProperty;