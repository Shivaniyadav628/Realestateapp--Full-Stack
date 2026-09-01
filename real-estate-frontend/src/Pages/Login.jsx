
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/API";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input Changes
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // =========================
  // Login Function
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    console.log("Login button clicked");
    console.log("Email:", formData.email);

    try {
      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response:", response.data);

      // =========================
      // Check Token
      // =========================

      if (!response.data.token) {
        setMessage("Login failed: Token not received.");
        return;
      }

      // =========================
      // Save Token
      // =========================

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      // =========================
      // Save User Information
      // =========================

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        console.log(
          "Logged-in user:",
          response.data.user
        );

        console.log(
          "User role:",
          response.data.user.role
        );
      }

      // =========================
      // Success
      // =========================

      setMessage("Login Successful!");

      // =========================
      // Redirect
      // =========================

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setMessage(
          error.response.data.message ||
            "Invalid email or password"
        );
      } else if (error.request) {
        setMessage(
          "Cannot connect to server. Make sure backend is running."
        );
      } else {
        setMessage(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        minHeight: "80vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "14px",
          boxShadow:
            "0 8px 30px rgba(0, 0, 0, 0.10)",
          boxSizing: "border-box",
        }}
      >
        {/* =========================
            Heading
        ========================= */}

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
            Welcome Back
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Login to your Real Estate account
          </p>
        </div>

        {/* =========================
            Message
        ========================= */}

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor:
                message.includes("Successful")
                  ? "#dcfce7"
                  : "#fee2e2",
              color:
                message.includes("Successful")
                  ? "#166534"
                  : "#b91c1c",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        {/* =========================
            Login Form
        ========================= */}

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "15px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
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
              style={{
                width: "100%",
                padding: "13px 14px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "15px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "13px 14px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: loading
                ? "#94a3b8"
                : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              marginBottom: "22px",
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* =========================
            Register Link
        ========================= */}

        <p
          style={{
            textAlign: "center",
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Don't have an account?{" "}

          <Link
            to="/register"
            style={{
              color: "#2563eb",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;