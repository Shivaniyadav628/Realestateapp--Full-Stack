import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/API";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError("");

      const response = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile received:", response.data);

      setUser(response.data.user);
    } catch (error) {
      console.error("Profile error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load profile."
      );
    } finally {
      setLoading(false);
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

  if (error) {
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
        <div style={{ textAlign: "center" }}>
          <h2>Unable to load profile</h2>

          <p
            style={{
              color: "#dc2626",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProfile}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
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
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              margin: "0 auto 15px",
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: "bold",
            }}
          >
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h1
            style={{
              marginBottom: "8px",
              color: "#0f172a",
            }}
          >
            My Profile
          </h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Manage your Real Estate account
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "14px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
          }}
        >
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

            <div
              style={{
                padding: "13px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#0f172a",
              }}
            >
              {user?.name || "Not available"}
            </div>
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

            <div
              style={{
                padding: "13px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#0f172a",
              }}
            >
              {user?.email || "Not available"}
            </div>
          </div>

          <div
            style={{
              marginBottom: "25px",
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

            <div
              style={{
                padding: "13px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#0f172a",
              }}
            >
              {user?.phone || "Not available"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "12px",
                textAlign: "center",
                backgroundColor: "#64748b",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
              }}
            >
              Back Home
            </Link>

            <button
              type="button"
              onClick={() => navigate("/edit-profile")}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;