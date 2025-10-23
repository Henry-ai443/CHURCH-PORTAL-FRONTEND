import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaBullhorn, FaUsers } from "react-icons/fa";

const QuickStats = () => {
  const [stats, setStats] = useState({
    events: 0,
    announcements: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authorization token not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        };

        const [resEvents, resAnnouncements, resUsers] = await Promise.all([
          fetch("https://church-portal-backend.onrender.com/api/events", { headers }),
          fetch("https://church-portal-backend.onrender.com/api/announcements/all/", { headers }),
          fetch("https://church-portal-backend.onrender.com/api/registered_users", { headers }),
        ]);

        if (!resEvents.ok || !resAnnouncements.ok || !resUsers.ok) {
          const message =
            resEvents.status === 401 ||
            resAnnouncements.status === 401 ||
            resUsers.status === 401
              ? "Unauthorized access. Please log in again."
              : "Failed to fetch data from server.";
          throw new Error(message);
        }

        const [eventData, announcementsData, usersData] = await Promise.all([
          resEvents.json(),
          resAnnouncements.json(),
          resUsers.json(),
        ]);

        setStats({
          events: eventData.length,
          announcements: announcementsData.length,
          users: usersData.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, label, icon: Icon, colorClass, manageLink, manageText }) => (
    <div className="col-sm-6 col-lg-3">
      <div
        className={`stat-card ${colorClass} text-white shadow-sm`}
        style={{
          overflow: "hidden",
          boxSizing: "border-box",
          padding: "1rem", // Added padding around the entire card
          borderRadius: "0.5rem",
        }}
      >
        <div
          className="card-body d-flex flex-column justify-content-between py-0 px-0"
          style={{ minHeight: "150px" }}
        >
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ gap: "0.5rem", flexWrap: "nowrap" }}
          >
            <div
              style={{
                flex: "1 1 auto",
                minWidth: 0, // important for truncation inside flex
                overflowWrap: "break-word",
                wordWrap: "break-word",
                paddingRight: "0.5rem", // prevent text getting close to icon
              }}
            >
              <h6
                className="card-title mb-1"
                style={{
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  marginBottom: "0.25rem",
                }}
              >
                {title}
              </h6>
              <h4
                className="fw-bold mb-0"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                }}
              >
                {value}
              </h4>
              <small
                style={{
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                }}
              >
                {label}
              </small>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Icon className="fs-3 opacity-75" />
            </div>
          </div>
          <div>
            <Link
              to={manageLink}
              className="text-decoration-underline"
              style={{
                cursor: "pointer",
                fontSize: "0.75rem",
                display: "inline-block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                paddingTop: "6px",
                fontWeight: "700", // bold text
                color: "#FFEB3B", // bright yellow for visibility
              }}
              aria-label={`Manage ${title}`}
              title={`Manage ${title}`}
            >
              {manageText || `Manage ${title}`}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingCard = () => (
    <div className="col-sm-6 col-lg-3">
      <div className="stat-card skeleton-card shadow-sm">
        <div className="card-body py-3 px-3">
          <div className="skeleton-title mb-2"></div>
          <div className="skeleton-number mb-2"></div>
          <div className="skeleton-label"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="row g-3 mb-4 quick-stats">
      {error && (
        <div className="col-12">
          <div className="alert alert-danger py-2 mb-3" role="alert">
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      ) : (
        <>
          <StatCard
            title="Events"
            value={stats.events}
            label="Total Created"
            icon={FaCalendarAlt}
            colorClass="bg-gradient-blue"
            manageLink="/admin/manage-events"
            manageText="Manage Events"
          />
          <StatCard
            title="Announcements"
            value={stats.announcements}
            label="Total Created"
            icon={FaBullhorn}
            colorClass="bg-gradient-purple"
            manageLink="/admin/manage-announcements"
            manageText="Manage Announcements"
          />
          <StatCard
            title="Users"
            value={stats.users}
            label="Registered Members"
            icon={FaUsers}
            colorClass="bg-gradient-green"
            manageLink="/admin/manage-users"
            manageText="Manage Users"
          />
        </>
      )}
    </div>
  );
};

export default QuickStats;
