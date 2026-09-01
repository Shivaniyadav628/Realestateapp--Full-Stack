
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        user = null;
    }

    const isLoggedIn = Boolean(token);
    const isAdmin = user?.role === "admin";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");

        alert("Logged out successfully");
        navigate("/login");
    };

    return (
        <nav style={navbarStyle}>
            {/* =========================
                LOGO
            ========================= */}
            <Link to="/" style={logoStyle}>
                <span style={logoIcon}>🏡</span>
                <span>EstateHub</span>
            </Link>

            {/* =========================
                NAVIGATION
            ========================= */}
            <div style={navLinksStyle}>

                {/* PUBLIC */}
                <Link to="/" style={linkStyle}>
                    Home
                </Link>

                <Link to="/properties" style={linkStyle}>
                    Properties
                </Link>

                {/* =========================
                    LOGGED-IN USER
                ========================= */}
                {isLoggedIn && (
                    <>
                        <Link to="/dashboard" style={linkStyle}>
                            🏠 Dashboard
                        </Link>

                        <Link to="/favorites" style={linkStyle}>
                            ❤️ Favorites
                        </Link>

                        <Link to="/profile" style={linkStyle}>
                            👤 Profile
                        </Link>
                    </>
                )}

                {/* =========================
                    ADMIN ONLY
                ========================= */}
                {isLoggedIn && isAdmin && (
                    <>
                        <Link to="/add-property" style={adminLinkStyle}>
                            + Add Property
                        </Link>

                        <Link to="/my-properties" style={adminLinkStyle}>
                            My Properties
                        </Link>

                        <Link to="/admin" style={adminLinkStyle}>
                            🛡️ Admin
                        </Link>
                    </>
                )}

                {/* =========================
                    AUTH
                ========================= */}
                {!isLoggedIn && (
                    <>
                        <Link to="/login" style={authLinkStyle}>
                            Login
                        </Link>

                        <Link to="/register" style={registerLinkStyle}>
                            Register
                        </Link>
                    </>
                )}

                {/* =========================
                    LOGOUT
                ========================= */}
                {isLoggedIn && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        style={logoutButtonStyle}
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

/* =====================================================
   NAVBAR STYLES
===================================================== */

const navbarStyle = {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #eaeaec",
    padding: "0 40px",
    minHeight: "72px",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    position: "sticky",
    top: 0,
    zIndex: 1000,

    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
};

const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",

    color: "#282c3f",
    textDecoration: "none",

    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.4px",

    whiteSpace: "nowrap"
};

const logoIcon = {
    fontSize: "25px"
};

const navLinksStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",

    gap: "6px",
    flexWrap: "wrap"
};

const linkStyle = {
    color: "#282c3f",
    textDecoration: "none",

    padding: "25px 12px",
    borderBottom: "2px solid transparent",

    fontSize: "14px",
    fontWeight: "600",

    transition: "all 0.2s ease",

    whiteSpace: "nowrap"
};

const adminLinkStyle = {
    ...linkStyle,

    color: "#ffffff",
    backgroundColor: "#7c3aed",

    padding: "9px 12px",
    borderRadius: "6px",

    borderBottom: "none"
};

const authLinkStyle = {
    ...linkStyle,

    color: "#282c3f",

    padding: "9px 15px",
    border: "1px solid #d8d9df",
    borderRadius: "5px",

    borderBottom: "1px solid #d8d9df"
};

const registerLinkStyle = {
    ...linkStyle,

    color: "#ffffff",
    backgroundColor: "#ff3f6c",

    padding: "9px 16px",
    borderRadius: "5px",

    borderBottom: "none"
};

const logoutButtonStyle = {
    backgroundColor: "#dc2626",
    color: "#ffffff",

    border: "none",
    padding: "9px 15px",
    borderRadius: "5px",

    cursor: "pointer",

    fontSize: "14px",
    fontWeight: "600",

    whiteSpace: "nowrap"
};

export default Navbar;

