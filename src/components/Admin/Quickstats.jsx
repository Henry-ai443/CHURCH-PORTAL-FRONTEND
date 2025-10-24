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
      <div className={`stat-card ${colorClass} text-white shadow-sm`}>
        <div className="card-body d-flex justify-content-between align-items-start">
          <div className="text-content">
            <h6 className="card-title">{title}</h6>
            <h4 className="fw-bold">{value}</h4>
            <small>{label}</small>
            {manageLink && (
              <div className="mt-2">
                <Link to={manageLink} className="text-white text-decoration-underline small">
                  {manageText}
                </Link>
              </div>
            )}
          </div>
          <Icon className="fs-3 opacity-75 icon" />
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
            colorClass="bg-primary"
            manageLink="/manage-events"
            manageText="Manage Events"
          />
          <StatCard
            title="Announcements"
            value={stats.announcements}
            label="Total Created"
            icon={FaBullhorn}
            colorClass="bg-info"
            manageLink="/manage-announcements"
            manageText="Manage Announcements"
          />
          <StatCard
            title="Users"
            value={stats.users}
            label="Registered Members"
            icon={FaUsers}
            colorClass="bg-success"
            manageLink="/users_management"
            manageText="Manage Users"
          />
        </>
      )}
    </div>
  );
};

export default QuickStats;
