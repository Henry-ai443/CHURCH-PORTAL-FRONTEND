import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaBullhorn } from "react-icons/fa";

const QuickStats = () => {
  const [stats, setStats] = useState({
    events: 0,
    announcements: 0,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token"); 

      if (!token) {
        setError("Authorization token not found. Please log in again.");
        return;
      }

      try {
        const headers = {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        };

        const [resEvents, resAnnouncements] = await Promise.all([
          fetch("https://church-portal-backend.onrender.com/api/events", { headers }),
          fetch("https://church-portal-backend.onrender.com/api/announcements/all/", { headers }),
        ]);

        // Check for unauthorized or failed responses
        if (!resEvents.ok || !resAnnouncements.ok) {
          const message = resEvents.status === 401 || resAnnouncements.status === 401
            ? "Unauthorized access. Please log in again."
            : "Failed to fetch data from server.";
          throw new Error(message);
        }

        const [eventData, announcementsData] = await Promise.all([
          resEvents.json(),
          resAnnouncements.json(),
        ]);

        setStats({
          events: eventData.length,
          announcements: announcementsData.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="row g-3 mb-4 quick-stats">
      {error && (
        <div className="col-12">
          <div className="alert alert-danger py-2 mb-3" role="alert">
            {error}
          </div>
        </div>
      )}

      {/* EVENTS */}
      <div className="col-sm-6 col-lg-3">
        <div className="stat-card bg-gradient-blue text-white shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center py-3 px-3">
            <div>
              <h6 className="card-title mb-1">Events</h6>
              <h4 className="fw-bold mb-0">{stats.events}</h4>
              <small>Total Created</small>
            </div>
            <FaCalendarAlt className="fs-3 opacity-75" />
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="col-sm-6 col-lg-3">
        <div className="stat-card bg-gradient-purple text-white shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center py-3 px-3">
            <div>
              <h6 className="card-title mb-1">Announcements</h6>
              <h4 className="fw-bold mb-0">{stats.announcements}</h4>
              <small>Total Created</small>
            </div>
            <FaBullhorn className="fs-3 opacity-75" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
