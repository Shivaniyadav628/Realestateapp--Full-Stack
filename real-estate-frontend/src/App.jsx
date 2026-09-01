
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import Properties from "./Pages/Properties";
import PropertyDetails from "./Pages/PropertyDetails";

import AddProperty from "./Pages/AddProperty";
import MyProperties from "./Pages/MyProperties";
import EditProperty from "./Pages/EditProperty";

import Favorites from "./Pages/Favorites";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";

import Dashboard from "./Pages/Dashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import APIDebug from "./Pages/APIDebug";
import ImageDiagnostics from "./Pages/ImageDiagnostics";

function App() {
    return (
        <div style={appStyle}>

            {/* =========================================
                NAVBAR
            ========================================= */}
            <Navbar />

            {/* =========================================
                MAIN CONTENT

                flex: 1 makes the footer stay at the
                bottom when the page has little content.
                When there is more content, the page
                naturally grows and the footer moves down.
            ========================================= */}
            <main style={mainStyle}>
                <Routes>

                    {/* =================================
                        PUBLIC PAGES
                    ================================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/properties"
                        element={<Properties />}
                    />

                    {/* =================================
                        PROPERTY DETAILS

                        IMPORTANT:
                        Supports /property/1
                        AND /properties/1

                        This prevents the 404 problem
                        if PropertyCard uses either URL.
                    ================================= */}

                    <Route
                        path="/property/:id"
                        element={<PropertyDetails />}
                    />

                    <Route
                        path="/properties/:id"
                        element={<PropertyDetails />}
                    />


                    {/* =================================
                        PROPERTY MANAGEMENT
                    ================================= */}

                    <Route
                        path="/add-property"
                        element={<AddProperty />}
                    />

                    <Route
                        path="/my-properties"
                        element={<MyProperties />}
                    />

                    <Route
                        path="/edit-property/:id"
                        element={<EditProperty />}
                    />


                    {/* =================================
                        USER PAGES
                    ================================= */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/favorites"
                        element={<Favorites />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/edit-profile"
                        element={<EditProfile />}
                    />


                    {/* =================================
                        ADMIN
                    ================================= */}

                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />


                    {/* =================================
                        DEBUG PAGE (Remove before production)
                    ================================= */}

                    <Route
                        path="/api-debug"
                        element={<APIDebug />}
                    />

                    <Route
                        path="/image-diagnostics"
                        element={<ImageDiagnostics />}
                    />


                    {/* =================================
                        404 PAGE
                    ================================= */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>
            </main>

            {/* =========================================
                FOOTER
            ========================================= */}
            <Footer />

        </div>
    );
}


/* =====================================================
   404 COMPONENT
===================================================== */

function NotFound() {
    return (
        <div style={notFoundStyle}>

            <div style={notFoundCardStyle}>

                <div style={errorNumberStyle}>
                    404
                </div>

                <h2
                    style={{
                        margin: "10px 0",
                        color: "#282c3f"
                    }}
                >
                    Page Not Found
                </h2>

                <p
                    style={{
                        color: "#696b79",
                        marginBottom: "25px"
                    }}
                >
                    The page you are looking for
                    does not exist.
                </p>

                <a
                    href="/"
                    style={homeButtonStyle}
                >
                    Go to Home
                </a>

            </div>

        </div>
    );
}


/* =====================================================
   APP LAYOUT STYLES
===================================================== */

const appStyle = {
    minHeight: "100vh",

    display: "flex",
    flexDirection: "column",

    backgroundColor: "#ffffff"
};

const mainStyle = {
    flex: 1,
    width: "100%",

    display: "flex",
    flexDirection: "column"
};

const notFoundStyle = {
    flex: 1,

    minHeight: "55vh",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    padding: "50px 20px",

    backgroundColor: "#f8fafc"
};

const notFoundCardStyle = {
    textAlign: "center",

    backgroundColor: "#ffffff",

    padding: "45px 50px",

    borderRadius: "12px",

    boxShadow:
        "0 4px 20px rgba(0, 0, 0, 0.08)"
};

const errorNumberStyle = {
    fontSize: "64px",

    fontWeight: "800",

    color: "#ff3f6c",

    lineHeight: 1
};

const homeButtonStyle = {
    display: "inline-block",

    backgroundColor: "#ff3f6c",

    color: "#ffffff",

    textDecoration: "none",

    padding: "11px 22px",

    borderRadius: "6px",

    fontWeight: "600"
};

export default App;

