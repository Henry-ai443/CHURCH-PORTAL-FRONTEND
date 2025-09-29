import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AllAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Add loading state

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem("token");
        const response = await fetch("https://church-portal-backend.onrender.com/api/announcements/all/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements: ", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAnnouncements();
  }, []); // <-- Add empty deps array to avoid infinite fetch loop

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">ALL Announcements</h2>

      {loading ? (
        <p className="text-center">Loading announcements...</p> // <-- Show while loading
      ) : announcements.length > 0 ? (
        <div className="row">
          {announcements.map((item, index) => (
            <motion.div
              key={index}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div
                className="card h-100 shadow-lg border-1"
                style={{
                  background: "rgba(0, 51, 102, 0.35)",
                  backdropFilter: "blur(10px)", // corrected from backgroundFilter
                  borderRadius: "15px",
                  color: "white",
                }}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold">{item.title}</h5>
                  <p className="card-text">{item.message}</p>
                </div>
                <div className="card-footer text-muted small">
                  {new Date(item.time).toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center">No announcements available</p>
      )}

      <style>
        {`
          .announcements-page {
            min-height: 50vh !important;
            background: linear-gradient(
              135deg,
              rgba(0, 51, 102, 0.9),
              rgba(30, 144, 255, 0.7),
              rgba(135, 206, 250, 0.4)
            );
          }
        `}
      </style>
    </div>
  );
};

export default AllAnnouncements;
