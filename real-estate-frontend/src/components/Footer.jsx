
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer
            style={{
                backgroundColor: "#0f172a",
                color: "#ffffff",
                marginTop: "auto",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "20px 30px 15px",
                    display: "grid",
                    gridTemplateColumns:
                        "2fr 1fr 1fr 1.3fr",
                    gap: "30px",
                }}
            >

                {/* =========================================
                    BRAND
                ========================================= */}

                <div>
                    <Link
                        to="/"
                        style={{
                            textDecoration:
                                "none",
                            color:
                                "#ffffff",
                        }}
                    >
                        <h2
                            style={{
                                margin:
                                    "0 0 15px",
                                fontSize:
                                    "24px",
                                fontWeight:
                                    "700",
                            }}
                        >
                            🏡 EstateHub
                        </h2>
                    </Link>

                    <p
                        style={{
                            color:
                                "#cbd5e1",
                            lineHeight:
                                "1.7",
                            fontSize:
                                "14px",
                            margin:
                                "0",
                            maxWidth:
                                "350px",
                        }}
                    >
                        Find your perfect home with
                        EstateHub. Explore properties,
                        connect with sellers, book
                        visits, and discover a place
                        you'll love.
                    </p>
                </div>


                {/* =========================================
                    QUICK LINKS
                ========================================= */}

                <div>
                    <h3
                        style={
                            footerHeading
                        }
                    >
                        Quick Links
                    </h3>

                    <FooterLink to="/">
                        Home
                    </FooterLink>

                    <FooterLink to="/properties">
                        Properties
                    </FooterLink>

                    <FooterLink to="/favorites">
                        ❤️ Favorites
                    </FooterLink>

                    <FooterLink to="/profile">
                        👤 My Profile
                    </FooterLink>
                </div>


                {/* =========================================
                    PROPERTY
                ========================================= */}

                <div>
                    <h3
                        style={
                            footerHeading
                        }
                    >
                        Property
                    </h3>

                    <p
                        style={
                            footerText
                        }
                    >
                        🏠 Buy Property
                    </p>

                    <p
                        style={
                            footerText
                        }
                    >
                        🏢 Rent Property
                    </p>

                    <p
                        style={
                            footerText
                        }
                    >
                        🔑 Find Your Home
                    </p>

                    <p
                        style={
                            footerText
                        }
                    >
                        📅 Book a Visit
                    </p>
                </div>


                {/* =========================================
                    CONTACT
                ========================================= */}

                <div>
                    <h3
                        style={
                            footerHeading
                        }
                    >
                        Contact Us
                    </h3>

                    <p
                        style={
                            footerText
                        }
                    >
                        📍 Hyderabad, India
                    </p>

                    <p
                        style={
                            footerText
                        }
                    >
                        📧 support@estatehub.com
                    </p>

                    <p
                        style={
                            footerText
                        }
                    >
                        📞 +91 98765 43210
                    </p>
                </div>

            </div>


            {/* =============================================
                FOOTER BOTTOM
            ============================================= */}

            <div
                style={{
                    borderTop:
                        "1px solid #334155",
                    padding:
                        "10px 20px 8px",
                    textAlign:
                        "center",
                    color:
                        "#94a3b8",
                    fontSize:
                        "12px",
                }}
            >
                <p
                    style={{
                        margin:
                            "0 0 3px",
                    }}
                >
                    © 2026 EstateHub.
                    All rights reserved.
                </p>

                <p
                    style={{
                        margin:
                            "0",
                    }}
                >
                    Built with ❤️ using
                    React & Node.js
                </p>
            </div>


            {/* =============================================
                RESPONSIVE
            ============================================= */}

            <style>
                {`
                    @media (max-width: 900px) {
                        footer > div:first-child {
                            grid-template-columns:
                                1fr 1fr !important;
                            gap: 35px !important;
                        }
                    }

                    @media (max-width: 550px) {
                        footer > div:first-child {
                            grid-template-columns:
                                1fr !important;
                            padding:
                                40px 22px 30px !important;
                        }
                    }
                `}
            </style>

        </footer>
    );
}


/* =====================================================
   FOOTER LINK
===================================================== */

function FooterLink({
    to,
    children,
}) {
    return (
        <Link
            to={to}
            style={{
                display:
                    "block",
                color:
                    "#cbd5e1",
                textDecoration:
                    "none",
                marginBottom:
                    "11px",
                fontSize:
                    "14px",
                transition:
                    "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.color =
                    "#ffffff";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color =
                    "#cbd5e1";
            }}
        >
            {children}
        </Link>
    );
}


/* =====================================================
   STYLES
===================================================== */

const footerHeading = {
    fontSize:
        "13px",

    fontWeight:
        "700",

    margin:
        "0 0 10px",

    color:
        "#ffffff",
};


const footerText = {
    color:
        "#cbd5e1",

    margin:
        "0 0 6px",

    fontSize:
        "13px",

    lineHeight:
        "1.4",
};


export default Footer;

