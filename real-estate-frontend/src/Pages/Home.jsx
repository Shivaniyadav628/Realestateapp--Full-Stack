import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "white",
          padding: "80px 30px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              margin: "0 0 20px",
            }}
          >
            🏡 Find Your Dream Property
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#cbd5e1",
              marginBottom: "30px",
              lineHeight: "1.6",
            }}
          >
            Discover thousands of properties, from cozy apartments to luxurious villas.
            Your perfect home is just a click away.
          </p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/properties" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "14px 40px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#2563eb")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
              >
                Explore Properties
              </button>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "14px 40px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "#0f172a";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "white";
                }}
              >
                List Your Property
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS SECTION
      ===================================================== */}
      <section
        style={{
          padding: "60px 30px",
          backgroundColor: "#f8fafc",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <StatCard number="10K+" label="Happy Customers" />
        <StatCard number="50K+" label="Properties Listed" />
        <StatCard number="98%" label="Customer Satisfaction" />
        <StatCard number="24/7" label="Customer Support" />
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}
      <section
        style={{
          padding: "80px 30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "50px",
            color: "#1e293b",
          }}
        >
          Why Choose EstateHub?
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
          }}
        >
          <FeatureCard
            icon="🔍"
            title="Advanced Search"
            description="Find properties with advanced filters for location, price, type, and more."
          />
          <FeatureCard
            icon="🏠"
            title="Verified Properties"
            description="All listings are verified to ensure authenticity and quality information."
          />
          <FeatureCard
            icon="📱"
            title="Easy Bookings"
            description="Book property visits instantly and chat with sellers directly."
          />
          <FeatureCard
            icon="💰"
            title="Best Prices"
            description="Find competitive prices from verified sellers and agents."
          />
          <FeatureCard
            icon="⭐"
            title="Ratings & Reviews"
            description="Read honest reviews from other customers to make informed decisions."
          />
          <FeatureCard
            icon="🛡️"
            title="Secure Transactions"
            description="Your data is encrypted and protected with industry-leading security."
          />
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section
        style={{
          padding: "80px 30px",
          backgroundColor: "#f1f5f9",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "50px",
              color: "#1e293b",
            }}
          >
            How It Works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "40px",
              textAlign: "center",
            }}
          >
            <StepCard step="1" title="Search" description="Browse thousands of properties" />
            <StepCard
              step="2"
              title="Compare"
              description="Compare prices and features"
            />
            <StepCard
              step="3"
              title="Connect"
              description="Chat with sellers/agents"
            />
            <StepCard step="4" title="Book" description="Schedule a property visit" />
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PROPERTIES (Call to Action)
      ===================================================== */}
      <section
        style={{
          padding: "80px 30px",
          textAlign: "center",
          backgroundColor: "#0f172a",
          color: "white",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Ready to Find Your Home?
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "#cbd5e1",
              marginBottom: "30px",
              lineHeight: "1.6",
            }}
          >
            Browse our extensive collection of properties and find the one that
            matches your lifestyle and budget.
          </p>
          <Link to="/properties" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "14px 50px",
                fontSize: "16px",
                fontWeight: "600",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "#2563eb")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "#3b82f6")
              }
            >
              View All Properties
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

// ======================================================
// HELPER COMPONENTS
// ======================================================

function StatCard({ number, label }) {
  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow =
          "0 8px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      <h3
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#3b82f6",
          margin: "0 0 10px",
        }}
      >
        {number}
      </h3>
      <p
        style={{
          margin: "0",
          color: "#64748b",
          fontSize: "16px",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "white";
        e.currentTarget.style.borderColor = "#3b82f6";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(59, 130, 246, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#f8fafc";
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          fontSize: "40px",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#1e293b",
          margin: "0 0 10px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "#64748b",
          margin: "0",
          lineHeight: "1.6",
        }}
      >
        {description}
      </p>
    </div>
  );
}

function StepCard({ step, title, description }) {
  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: "#3b82f6",
          color: "white",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          fontWeight: "700",
          margin: "0 auto 15px",
        }}
      >
        {step}
      </div>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: "#1e293b",
          margin: "0 0 10px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "#64748b",
          margin: "0",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default Home;