import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaBullhorn } from "react-icons/fa";
import './admin.css'

const QuickStats = () => {
  const [stats, setStats] = useState({
    events: 0,
    announcements: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resEvents, resAnnouncements] = await Promise.all([
          fetch("https://church-portal-backend.onrender.com/api/events"),
          fetch("https://church-portal-backend.onrender.com/api/announcements/all/"),
        ]);

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
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="row g-3 mb-4 quick-stats">
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
