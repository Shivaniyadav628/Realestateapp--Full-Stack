import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/API";

function Dashboard() {

  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loadingInquiries, setLoadingInquiries] =
    useState(true);

  const [loadingBookings, setLoadingBookings] =
    useState(true);

  const [inquiryMessage, setInquiryMessage] =
    useState("");

  const [bookingMessage, setBookingMessage] =
    useState("");


  // ======================================================
  // CHECK LOGIN
  // ======================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchInquiries();
    fetchBookings();

  }, [navigate]);


  // ======================================================
  // FETCH INQUIRIES
  // ======================================================

  const fetchInquiries = async () => {

    try {

      setLoadingInquiries(true);
      setInquiryMessage("");

      const response =
        await API.get("/inquiries");

      console.log(
        "My Inquiries:",
        response.data
      );

      setInquiries(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Inquiry Error:",
        error
      );

      if (
        error.response?.status === 401
      ) {

        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      setInquiryMessage(
        error.response?.data?.message ||
        "Unable to load inquiries."
      );

    } finally {

      setLoadingInquiries(false);
    }
  };


  // ======================================================
  // FETCH BOOKINGS
  // ======================================================

  const fetchBookings = async () => {

    try {

      setLoadingBookings(true);
      setBookingMessage("");

      const response =
        await API.get("/bookings");

      console.log(
        "My Bookings:",
        response.data
      );

      setBookings(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Booking Error:",
        error
      );

      if (
        error.response?.status === 401
      ) {

        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      setBookingMessage(
        error.response?.data?.message ||
        "Unable to load bookings."
      );

    } finally {

      setLoadingBookings(false);
    }
  };


  // ======================================================
  // CANCEL BOOKING
  // ======================================================

  const handleCancelBooking =
    async (bookingId) => {

      const confirmCancel =
        window.confirm(
          "Are you sure you want to cancel this visit?"
        );

      if (!confirmCancel) {
        return;
      }

      try {

        await API.delete(
          `/bookings/${bookingId}`
        );

        alert(
          "Booking cancelled successfully."
        );

        fetchBookings();

      } catch (error) {

        console.error(
          "Cancel Booking Error:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to cancel booking."
        );
      }
    };


  // ======================================================
  // DELETE INQUIRY
  // ======================================================

  const handleDeleteInquiry =
    async (inquiryId) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this inquiry?"
        );

      if (!confirmDelete) {
        return;
      }

      try {

        await API.delete(
          `/inquiries/${inquiryId}`
        );

        alert(
          "Inquiry deleted successfully."
        );

        fetchInquiries();

      } catch (error) {

        console.error(
          "Delete Inquiry Error:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to delete inquiry."
        );
      }
    };


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };


  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "40px 20px"
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "30px"
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                color: "#1e3a8a"
              }}
            >
              🏠 My Dashboard
            </h1>

            <p
              style={{
                color: "#64748b",
                marginTop: "8px"
              }}
            >
              Manage your property activities
            </p>

          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
              fontSize: "15px"
            }}
          >
            Logout
          </button>

        </div>


        {/* QUICK ACTIONS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "35px"
          }}
        >

          <Link
            to="/properties"
            style={{
              textDecoration: "none",
              backgroundColor: "#1e3a8a",
              color: "white",
              padding: "22px",
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: "600"
            }}
          >
            🏠 Browse Properties
          </Link>

          <div
            style={cardStyle}
          >

            <div
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "#2563eb"
              }}
            >
              {bookings.length}
            </div>

            <div style={labelStyle}>
              My Visits
            </div>

          </div>

          <div
            style={cardStyle}
          >

            <div
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "#16a34a"
              }}
            >
              {inquiries.length}
            </div>

            <div style={labelStyle}>
              My Inquiries
            </div>

          </div>

        </div>


        {/* BOOKINGS */}

        <div style={sectionStyle}>

          <h2 style={headingStyle}>
            📅 My Property Visits
          </h2>

          {bookingMessage && (
            <p style={{ color: "#dc2626" }}>
              {bookingMessage}
            </p>
          )}

          {loadingBookings ? (

            <p>Loading bookings...</p>

          ) : bookings.length === 0 ? (

            <p style={{ color: "#64748b" }}>
              You haven't booked any property visits yet.
            </p>

          ) : (

            bookings.map((booking) => (

              <div
                key={booking.booking_id}
                style={itemStyle}
              >

                <h3
                  style={{
                    marginTop: 0,
                    color: "#334155"
                  }}
                >
                  {booking.title}
                </h3>

                <p>
                  <strong>📍 Location:</strong>{" "}
                  {booking.location}
                </p>

                <p>
                  <strong>📅 Date:</strong>{" "}
                  {booking.visit_date}
                </p>

                <p>
                  <strong>⏰ Time:</strong>{" "}
                  {booking.visit_time}
                </p>

                <p>
                  <strong>Owner:</strong>{" "}
                  {booking.owner_name ||
                    "Not available"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {booking.status ||
                    "Pending"}
                </p>

                <button
                  onClick={() =>
                    handleCancelBooking(
                      booking.booking_id
                    )
                  }
                  style={dangerButtonStyle}
                >
                  Cancel Visit
                </button>

              </div>

            ))
          )}

        </div>


        {/* INQUIRIES */}

        <div style={sectionStyle}>

          <h2 style={headingStyle}>
            📩 My Inquiries
          </h2>

          {inquiryMessage && (
            <p style={{ color: "#dc2626" }}>
              {inquiryMessage}
            </p>
          )}

          {loadingInquiries ? (

            <p>Loading inquiries...</p>

          ) : inquiries.length === 0 ? (

            <p style={{ color: "#64748b" }}>
              You haven't sent any inquiries yet.
            </p>

          ) : (

            inquiries.map((inquiry) => (

              <div
                key={inquiry.inquiry_id}
                style={itemStyle}
              >

                <h3
                  style={{
                    marginTop: 0,
                    color: "#334155"
                  }}
                >
                  {inquiry.title}
                </h3>

                <p>
                  <strong>📍 Location:</strong>{" "}
                  {inquiry.location}
                </p>

                <p>
                  <strong>💰 Price:</strong>{" "}
                  ₹
                  {Number(
                    inquiry.price || 0
                  ).toLocaleString("en-IN")}
                </p>

                <p>
                  <strong>Owner:</strong>{" "}
                  {inquiry.owner_name ||
                    "Not available"}
                </p>

                <p>
                  <strong>Message:</strong>
                </p>

                <p
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "12px",
                    borderRadius: "6px",
                    lineHeight: "1.5"
                  }}
                >
                  {inquiry.message}
                </p>

                <small
                  style={{
                    color: "#94a3b8"
                  }}
                >
                  {inquiry.created_at
                    ? new Date(
                        inquiry.created_at
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : ""}
                </small>

                <br />

                <button
                  onClick={() =>
                    handleDeleteInquiry(
                      inquiry.inquiry_id
                    )
                  }
                  style={dangerButtonStyle}
                >
                  Delete Inquiry
                </button>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const cardStyle = {
  backgroundColor: "white",
  padding: "22px",
  borderRadius: "12px",
  boxShadow:
    "0 3px 12px rgba(0,0,0,0.08)",
  textAlign: "center"
};

const labelStyle = {
  color: "#64748b",
  marginTop: "5px"
};

const sectionStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow:
    "0 3px 12px rgba(0,0,0,0.08)",
  marginBottom: "30px"
};

const headingStyle = {
  color: "#1e3a8a",
  marginTop: 0
};

const itemStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "15px"
};

const dangerButtonStyle = {
  marginTop: "12px",
  padding: "10px 18px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Dashboard;