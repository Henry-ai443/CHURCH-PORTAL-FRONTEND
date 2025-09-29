import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EventsPage = () => {
  const BASE_URL = "https://church-portal-backend.onrender.com";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("No auth token found. Please login.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${BASE_URL}/api/events/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched events data:", data);

        // Handle data format (array or wrapped)
        const eventsArray = Array.isArray(data) ? data : data.events || data.results || [];
        setEvents(eventsArray);
      } catch (err) {
        console.error("An error occurred fetching events: ", err);
        setError(err.message || "Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />

      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, rgba(30, 144, 255, 0.08), rgba(0, 51, 102, 0.08))",
        }}
      >
        <div className="container text-center">
          <h2 className="fw-bold text-dark mb-4">Upcoming Events</h2>

          {loading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p style={{ color: "red" }}>Error: {error}</p>
          ) : events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="row g-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="col-12 col-md-6 col-lg-4"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div
                    className="card h-100 shadow-sm border-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(12px)",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      borderRadius: "8px",
                    }}
                  >
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="card-img-top"
                        style={{
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "160px",
                          background: "#e0e0e0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#777",
                          borderRadius: "8px",
                        }}
                      >
                        No Image
                      </div>
                    )}
                    <div className="card-body text-start px-2 py-3">
                      <h5 className="card-title fs-6 fw-bold">{event.title}</h5>
                      <p className="card-text text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                        {new Date(event.date_time).toLocaleString()}
                      </p>
                      {event.location && (
                        <p className="card-text text-muted mb-1" style={{ fontSize: "0.85rem" }}>
                          {event.location}
                        </p>
                      )}
                      <p className="card-text" style={{ fontSize: "0.85rem" }}>
                        {event.description?.length > 100
                          ? event.description.substring(0, 100) + "..."
                          : event.description}
                      </p>
                      <Link to={`/events/${event.id}`} className="text-primary fw-semibold">
                        See More
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default EventsPage;
