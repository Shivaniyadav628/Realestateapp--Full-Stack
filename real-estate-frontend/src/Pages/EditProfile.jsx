import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/API";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile for editing:", response.data);

      setFormData({
        name: response.data.user.name || "",
        email: response.data.user.email || "",
        phone: response.data.user.phone || "",
      });
    } catch (error) {
      console.error("Fetch Profile Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      setMessage("Name and phone are required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await API.put(
        "/auth/profile",
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update Profile Response:", response.data);

      setMessage(
        response.data.message ||
          "Profile updated successfully."
      );

      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    } catch (error) {
      console.error("Update Profile Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        backgroundColor: "#f8fafc",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "35px",
          borderRadius: "14px",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#0f172a",
            marginBottom: "10px",
          }}
        >
          Edit Profile
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          Update your account information
        </p>

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              textAlign: "center",
              borderRadius: "8px",
              backgroundColor: message
                .toLowerCase()
                .includes("success")
                ? "#dcfce7"
                : "#fee2e2",
              color: message
                .toLowerCase()
                .includes("success")
                ? "#166534"
                : "#b91c1c",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxSizing: "border-box",
                backgroundColor: "#f1f5f9",
                color: "#64748b",
                cursor: "not-allowed",
                fontSize: "15px",
              }}
            />

            <small
              style={{
                display: "block",
                marginTop: "6px",
                color: "#64748b",
              }}
            >
              Email cannot be changed.
            </small>
          </div>

          <div
            style={{
              marginBottom: "28px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/profile")}
              style={{
                flex: 1,
                padding: "13px",
                backgroundColor: "#64748b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: "13px",
                backgroundColor: saving
                  ? "#93c5fd"
                  : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
                fontSize: "15px",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;