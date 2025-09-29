import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true); // start loading
        const token = localStorage.getItem("token");
        const res = await fetch("https://church-portal-backend.onrender.com/api/announcements/latest/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        const data = await res.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <>
      <section className="container py-5" data-aos="fade-up">
        <h2 className="text-center mb-4 fw-bold">Latest Announcements:</h2>

        {loading ? (
          <p className="text-center">Loading announcements...</p>
        ) : (
          <div className="row">
            {announcements.map((item) => (
              <div className="col-md-4 mb-4" key={item.id}>
                <div
                  className="card shadow-lg h-100"
                  style={{
                    borderRadius: "15px",
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title text-primary">{item.title}</h5>
                    <p className="card-text">{item.message}</p>
                    <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                      {new Date(item.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BUTTON TO VIEW ALL ANNOUNCEMENTS */}
        <div className="text-center mt-4" data-aos="fade-up">
          <Link
            to="/announcements"
            className="btn btn-outline-primary px-4 py-2 fw-bold"
            style={{
              borderRadius: "30px",
              background: "linear-gradient(135deg, #3b82f6 #06b6d4)",
            }}
          >
            View All Announcements
          </Link>
        </div>
      </section>
    </>
  );
};

export default Announcements;
