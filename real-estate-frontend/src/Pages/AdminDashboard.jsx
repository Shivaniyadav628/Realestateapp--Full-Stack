
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/API";

function AdminDashboard() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState(null);

  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {
    checkAdmin();
  }, []);

  // =========================
  // GET TOKEN
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // CHECK ADMIN
  // =========================

  const checkAdmin = async () => {
    const token = getToken();

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

      const user = response.data?.user;

      console.log("Logged-in User:", user);

      if (!user) {
        setMessage("Unable to identify the logged-in user.");
        return;
      }

      if (user.role !== "admin") {
        setMessage("Access denied. Admins only.");
        return;
      }

      // Keep user information updated
      localStorage.setItem("user", JSON.stringify(user));

      await fetchAdminData();
    } catch (error) {
      console.error("Admin Check Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setMessage("Access denied. Admins only.");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to access admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH ADMIN DATA
  // =========================

  const fetchAdminData = async () => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        usersResponse,
        propertiesResponse,
        bookingsResponse,
        inquiriesResponse,
      ] = await Promise.all([
        API.get("/admin/users", config),
        API.get("/admin/properties", config),
        API.get("/admin/bookings", config),
        API.get("/admin/inquiries", config),
      ]);

      console.log("Users:", usersResponse.data);
      console.log("Properties:", propertiesResponse.data);
      console.log("Bookings:", bookingsResponse.data);
      console.log("Inquiries:", inquiriesResponse.data);

      // Support direct arrays and object responses
      const usersData = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : usersResponse.data?.users || [];

      const propertiesData = Array.isArray(
        propertiesResponse.data
      )
        ? propertiesResponse.data
        : propertiesResponse.data?.properties || [];

      const bookingsData = Array.isArray(
        bookingsResponse.data
      )
        ? bookingsResponse.data
        : bookingsResponse.data?.bookings || [];

      const inquiriesData = Array.isArray(
        inquiriesResponse.data
      )
        ? inquiriesResponse.data
        : inquiriesResponse.data?.inquiries || [];

      setUsers(usersData);
      setProperties(propertiesData);
      setBookings(bookingsData);
      setInquiries(inquiriesData);
    } catch (error) {
      console.error("Admin Data Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setMessage("Access denied. Admins only.");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to load admin data."
      );
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const handleDeleteUser = async (userId, userName) => {
    const currentUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    // Prevent deleting yourself
    if (
      currentUser &&
      Number(currentUser.id) === Number(userId)
    ) {
      alert("You cannot delete your own admin account.");
      return;
    }

    // Prevent deleting another admin
    const selectedUser = users.find(
      (user) => Number(user.id) === Number(userId)
    );

    if (selectedUser?.role === "admin") {
      alert(
        "Admin accounts cannot be deleted from this dashboard."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const token = getToken();

      await API.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User deleted successfully.");

      await fetchAdminData();
    } catch (error) {
      console.error("Delete User Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // DELETE PROPERTY
  // =========================

  const handleDeleteProperty = async (
    propertyId,
    propertyTitle
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${propertyTitle}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const token = getToken();

      await API.delete(
        `/admin/properties/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Property deleted successfully.");

      await fetchAdminData();
    } catch (error) {
      console.error(
        "Delete Property Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete property."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // UPDATE BOOKING STATUS
  // =========================

  const handleUpdateBookingStatus = async (
    bookingId,
    status
  ) => {
    try {
      setUpdatingBooking(bookingId);

      const token = getToken();

      /*
        IMPORTANT:

        MySQL bookings.status is:

        ENUM('Pending', 'Approved', 'Rejected')

        Therefore we send exactly those values.
      */

      await API.patch(
        `/admin/bookings/${bookingId}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking status updated successfully.");

      await fetchAdminData();
    } catch (error) {
      console.error(
        "Update Booking Status Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update booking status."
      );
    } finally {
      setUpdatingBooking(null);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={loadingCardStyle}>
          <div style={spinnerStyle}></div>

          <h2 style={{ marginTop: "20px" }}>
            Loading Admin Dashboard...
          </h2>

          <p style={{ color: "#64748b" }}>
            Please wait while we load your data.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR / ACCESS DENIED
  // =========================

  if (message) {
    return (
      <div style={errorContainerStyle}>
        <div style={errorCardStyle}>
          <div style={errorIconStyle}>⚠️</div>

          <h2>{message}</h2>

          <p style={{ color: "#64748b" }}>
            You do not have permission to access this page.
          </p>

          <button
            onClick={() => navigate("/")}
            style={primaryButtonStyle}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div style={dashboardContainerStyle}>
      <div style={dashboardWrapperStyle}>

        {/* =========================
            HEADER
        ========================= */}

        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>
              🏠 Admin Dashboard
            </h1>

            <p style={subtitleStyle}>
              Manage users, properties, bookings and inquiries
            </p>
          </div>

          <div style={headerButtonsStyle}>
            <button
              onClick={() => navigate("/")}
              style={homeButtonStyle}
            >
              🏡 Home
            </button>

            <button
              onClick={handleLogout}
              style={logoutButtonStyle}
            >
              Logout
            </button>
          </div>
        </div>

        {/* =========================
            STATISTICS
        ========================= */}

        <div style={statsGridStyle}>

          <div style={statCardStyle}>
            <div style={statIconStyle}>👥</div>

            <div>
              <p style={statLabelStyle}>
                Total Users
              </p>

              <h2
                style={{
                  ...statNumberStyle,
                  color: "#2563eb",
                }}
              >
                {users.length}
              </h2>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle}>🏠</div>

            <div>
              <p style={statLabelStyle}>
                Total Properties
              </p>

              <h2
                style={{
                  ...statNumberStyle,
                  color: "#16a34a",
                }}
              >
                {properties.length}
              </h2>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle}>📅</div>

            <div>
              <p style={statLabelStyle}>
                Total Bookings
              </p>

              <h2
                style={{
                  ...statNumberStyle,
                  color: "#9333ea",
                }}
              >
                {bookings.length}
              </h2>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle}>💬</div>

            <div>
              <p style={statLabelStyle}>
                Total Inquiries
              </p>

              <h2
                style={{
                  ...statNumberStyle,
                  color: "#ea580c",
                }}
              >
                {inquiries.length}
              </h2>
            </div>
          </div>

        </div>

        {/* =========================
            USERS
        ========================= */}

        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>
                👥 Users
              </h2>

              <p style={sectionSubtitleStyle}>
                View and manage registered users
              </p>
            </div>

            <span style={countBadgeStyle}>
              {users.length} Users
            </span>
          </div>

          {users.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>👤</div>
              <p>No users found.</p>
            </div>
          ) : (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeader}>ID</th>
                    <th style={tableHeader}>Name</th>
                    <th style={tableHeader}>Email</th>
                    <th style={tableHeader}>Phone</th>
                    <th style={tableHeader}>Role</th>
                    <th style={tableHeader}>Created</th>
                    <th style={tableHeader}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={tableRowStyle}>

                      <td style={tableCell}>
                        {user.id}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          fontWeight: "600",
                        }}
                      >
                        {user.name || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {user.email || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {user.phone || "N/A"}
                      </td>

                      <td style={tableCell}>
                        <span
                          style={
                            user.role === "admin"
                              ? adminBadgeStyle
                              : userBadgeStyle
                          }
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      <td style={tableCell}>
                        {user.created_at
                          ? new Date(
                              user.created_at
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td style={tableCell}>
                        <button
                          onClick={() =>
                            handleDeleteUser(
                              user.id,
                              user.name
                            )
                          }
                          disabled={
                            deleting ||
                            user.role === "admin"
                          }
                          style={{
                            ...deleteButtonStyle,
                            backgroundColor:
                              user.role === "admin"
                                ? "#cbd5e1"
                                : "#dc2626",
                            cursor:
                              user.role === "admin" ||
                              deleting
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {user.role === "admin"
                            ? "Admin"
                            : deleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
            PROPERTIES
        ========================= */}

        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>
                🏠 Properties
              </h2>

              <p style={sectionSubtitleStyle}>
                Manage all properties listed on the platform
              </p>
            </div>

            <span style={countBadgeStyle}>
              {properties.length} Properties
            </span>
          </div>

          {properties.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>🏠</div>
              <p>No properties found.</p>
            </div>
          ) : (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeader}>ID</th>
                    <th style={tableHeader}>Title</th>
                    <th style={tableHeader}>Owner</th>
                    <th style={tableHeader}>Location</th>
                    <th style={tableHeader}>Price</th>
                    <th style={tableHeader}>Purpose</th>
                    <th style={tableHeader}>Status</th>
                    <th style={tableHeader}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {properties.map((property) => (
                    <tr
                      key={property.id}
                      style={tableRowStyle}
                    >

                      <td style={tableCell}>
                        {property.id}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          fontWeight: "600",
                        }}
                      >
                        {property.title || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {property.owner_name || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {property.location || "N/A"}
                      </td>

                      <td style={tableCell}>
                        ₹
                        {Number(
                          property.price || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td style={tableCell}>
                        <span style={purposeBadgeStyle}>
                          {property.purpose || "N/A"}
                        </span>
                      </td>

                      <td style={tableCell}>
                        <span style={statusBadgeStyle}>
                          {property.status || "N/A"}
                        </span>
                      </td>

                      <td style={tableCell}>
                        <button
                          onClick={() =>
                            handleDeleteProperty(
                              property.id,
                              property.title
                            )
                          }
                          disabled={deleting}
                          style={{
                            ...deleteButtonStyle,
                            cursor: deleting
                              ? "not-allowed"
                              : "pointer",
                          }}
                        >
                          {deleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
            BOOKINGS
        ========================= */}

        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>
                📅 Bookings
              </h2>

              <p style={sectionSubtitleStyle}>
                Manage property visit bookings
              </p>
            </div>

            <span style={countBadgeStyle}>
              {bookings.length} Bookings
            </span>
          </div>

          {bookings.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>📅</div>
              <p>No bookings found.</p>
            </div>
          ) : (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeader}>
                      Booking ID
                    </th>

                    <th style={tableHeader}>
                      Customer
                    </th>

                    <th style={tableHeader}>
                      Customer Email
                    </th>

                    <th style={tableHeader}>
                      Property
                    </th>

                    <th style={tableHeader}>
                      Location
                    </th>

                    <th style={tableHeader}>
                      Owner
                    </th>

                    <th style={tableHeader}>
                      Visit Date
                    </th>

                    <th style={tableHeader}>
                      Visit Time
                    </th>

                    <th style={tableHeader}>
                      Status
                    </th>

                    <th style={tableHeader}>
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.booking_id}
                      style={tableRowStyle}
                    >

                      <td style={tableCell}>
                        {booking.booking_id}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          fontWeight: "600",
                        }}
                      >
                        {booking.customer_name || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {booking.customer_email || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {booking.title || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {booking.location || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {booking.owner_name || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {booking.visit_date
                          ? new Date(
                              booking.visit_date
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td style={tableCell}>
                        {booking.visit_time || "N/A"}
                      </td>

                      <td style={tableCell}>
                        <select
                          value={
                            booking.status || "Pending"
                          }
                          onChange={(e) =>
                            handleUpdateBookingStatus(
                              booking.booking_id,
                              e.target.value
                            )
                          }
                          disabled={
                            updatingBooking ===
                            booking.booking_id
                          }
                          style={{
                            ...statusSelectStyle,
                            opacity:
                              updatingBooking ===
                              booking.booking_id
                                ? 0.6
                                : 1,
                          }}
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Approved">
                            Approved
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>
                        </select>

                        {updatingBooking ===
                          booking.booking_id && (
                          <small
                            style={{
                              display: "block",
                              marginTop: "5px",
                              color: "#64748b",
                            }}
                          >
                            Updating...
                          </small>
                        )}
                      </td>

                      <td style={tableCell}>
                        {booking.created_at
                          ? new Date(
                              booking.created_at
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
            INQUIRIES
        ========================= */}

        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>
                💬 Inquiries
              </h2>

              <p style={sectionSubtitleStyle}>
                View customer inquiries about properties
              </p>
            </div>

            <span style={countBadgeStyle}>
              {inquiries.length} Inquiries
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>💬</div>
              <p>No inquiries found.</p>
            </div>
          ) : (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeader}>
                      Inquiry ID
                    </th>

                    <th style={tableHeader}>
                      Customer
                    </th>

                    <th style={tableHeader}>
                      Customer Email
                    </th>

                    <th style={tableHeader}>
                      Property
                    </th>

                    <th style={tableHeader}>
                      Owner
                    </th>

                    <th style={tableHeader}>
                      Owner Email
                    </th>

                    <th style={tableHeader}>
                      Message
                    </th>

                    <th style={tableHeader}>
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.inquiry_id}
                      style={tableRowStyle}
                    >

                      <td style={tableCell}>
                        {inquiry.inquiry_id}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          fontWeight: "600",
                        }}
                      >
                        {inquiry.customer_name || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {inquiry.customer_email || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {inquiry.title || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {inquiry.owner_name || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {inquiry.owner_email || "N/A"}
                      </td>

                      <td
                        style={{
                          ...tableCell,
                          whiteSpace: "normal",
                          minWidth: "250px",
                          maxWidth: "400px",
                          lineHeight: "1.5",
                        }}
                      >
                        {inquiry.message || "N/A"}
                      </td>

                      <td style={tableCell}>
                        {inquiry.created_at
                          ? new Date(
                              inquiry.created_at
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div style={footerStyle}>
          <p>🏠 Real Estate Admin Panel</p>

          <p>
            Manage your platform efficiently
          </p>
        </div>

      </div>
    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

const dashboardContainerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  padding: "30px 20px",
};

const dashboardWrapperStyle = {
  maxWidth: "1400px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  padding: "25px",
  backgroundColor: "white",
  borderRadius: "14px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
  flexWrap: "wrap",
  gap: "20px",
};

const titleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "30px",
};

const subtitleStyle = {
  color: "#64748b",
  marginTop: "8px",
  marginBottom: 0,
  fontSize: "15px",
};

const headerButtonsStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const homeButtonStyle = {
  padding: "10px 18px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

const logoutButtonStyle = {
  padding: "10px 18px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const statCardStyle = {
  backgroundColor: "white",
  padding: "22px",
  borderRadius: "14px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
  display: "flex",
  alignItems: "center",
  gap: "18px",
};

const statIconStyle = {
  fontSize: "34px",
};

const statLabelStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600",
};

const statNumberStyle = {
  margin: "5px 0 0",
  fontSize: "32px",
};

const sectionStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "14px",
  marginBottom: "30px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
};

const sectionTitleStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: "22px",
};

const sectionSubtitleStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const countBadgeStyle = {
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  padding: "7px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "700",
};

const tableContainerStyle = {
  width: "100%",
  overflowX: "auto",
  marginTop: "18px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "900px",
};

const tableHeader = {
  textAlign: "left",
  padding: "13px",
  borderBottom: "2px solid #e2e8f0",
  color: "#334155",
  backgroundColor: "#f8fafc",
  whiteSpace: "nowrap",
  fontSize: "14px",
};

const tableCell = {
  padding: "13px",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
  color: "#475569",
  fontSize: "14px",
};

const tableRowStyle = {
  transition: "background-color 0.2s",
};

const adminBadgeStyle = {
  padding: "5px 10px",
  borderRadius: "20px",
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  fontWeight: "700",
  fontSize: "12px",
};

const userBadgeStyle = {
  padding: "5px 10px",
  borderRadius: "20px",
  backgroundColor: "#f1f5f9",
  color: "#475569",
  fontWeight: "600",
  fontSize: "12px",
};

const purposeBadgeStyle = {
  padding: "5px 10px",
  borderRadius: "20px",
  backgroundColor: "#ecfdf5",
  color: "#047857",
  fontWeight: "600",
  fontSize: "12px",
};

const statusBadgeStyle = {
  padding: "5px 10px",
  borderRadius: "20px",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  fontWeight: "600",
  fontSize: "12px",
};

const deleteButtonStyle = {
  padding: "8px 13px",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "600",
  backgroundColor: "#dc2626",
};

const statusSelectStyle = {
  padding: "7px 10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  cursor: "pointer",
  fontWeight: "600",
  backgroundColor: "white",
};

const emptyStateStyle = {
  textAlign: "center",
  padding: "40px 20px",
  color: "#64748b",
};

const emptyIconStyle = {
  fontSize: "40px",
  marginBottom: "10px",
};

const footerStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#64748b",
  fontSize: "13px",
};

const loadingContainerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const loadingCardStyle = {
  backgroundColor: "white",
  padding: "45px",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const spinnerStyle = {
  width: "42px",
  height: "42px",
  border: "4px solid #e2e8f0",
  borderTop: "4px solid #2563eb",
  borderRadius: "50%",
  margin: "0 auto",
  animation: "spin 1s linear infinite",
};

const errorContainerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const errorCardStyle = {
  backgroundColor: "white",
  padding: "45px",
  borderRadius: "14px",
  textAlign: "center",
  maxWidth: "500px",
  width: "100%",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const errorIconStyle = {
  fontSize: "45px",
  marginBottom: "10px",
};

const primaryButtonStyle = {
  marginTop: "20px",
  padding: "11px 22px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
};

export default AdminDashboard;

