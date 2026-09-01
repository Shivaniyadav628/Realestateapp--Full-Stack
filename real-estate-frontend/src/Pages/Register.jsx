
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/API";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    console.log("Sending registration data:", formData);

    try {
      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      console.log("Registration response:", response.data);

      setMessage(
        response.data.message || "User Registered Successfully"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        console.log("Backend response:", error.response.data);

        setMessage(
          error.response.data.message || "Registration failed"
        );
      } else if (error.request) {
        setMessage(
          "Cannot connect to server. Make sure backend is running."
        );
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.10)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "30px",
              color: "#0f172a",
            }}
          >
            Create Account
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Join our Real Estate platform
          </p>
        </div>

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "22px",
              borderRadius: "8px",
              textAlign: "center",
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
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="name" style={labelStyle}>
              Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="phone" style={labelStyle}>
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div
            style={{
              ...formGroupStyle,
              marginBottom: "25px",
            }}
          >
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: loading ? "#94a3b8" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "22px",
            }}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#2563eb",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const formGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "15px",
  fontWeight: "600",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

export default Register;

