import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaBullhorn, FaUsers } from "react-icons/fa";
import "./QuickStats.css";

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
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, label, icon: Icon, colorClass, manageLink, manageText }) => (
    <div className="stat-card-wrapper">
      <div className={`stat-card ${colorClass}`}>
        <div className="stat-content">
          <div className="stat-text">
            <h6>{title}</h6>
            <h3>{value}</h3>
            <small>{label}</small>
            {manageLink && (
              <Link to={manageLink} className="stat-link">
                {manageText}
              </Link>
            )}
          </div>
          <Icon className="stat-icon" />
        </div>
      </div>
    </div>
  );

  const LoadingCard = () => (
    <div className="stat-card-wrapper">
      <div className="stat-card skeleton-card">
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-number"></div>
          <div className="skeleton-label"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="quick-stats-container">
      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
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
              colorClass="stat-primary"
              manageLink="/manage-events"
              manageText="Manage Events"
            />
            <StatCard
              title="Announcements"
              value={stats.announcements}
              label="Total Created"
              icon={FaBullhorn}
              colorClass="stat-info"
              manageLink="/announcements_management"
              manageText="Manage Announcements"
            />
            <StatCard
              title="Users"
              value={stats.users}
              label="Registered Members"
              icon={FaUsers}
              colorClass="stat-success"
              manageLink="/users_management"
              manageText="Manage Users"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default QuickStats;
