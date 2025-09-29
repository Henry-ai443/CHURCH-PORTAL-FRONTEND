import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "https://church-portal-backend.onrender.com";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log("Fetching events started...");

        const token = localStorage.getItem("token");
        console.log("Token retrieved:", token);

        const res = await fetch(`${BASE_URL}/api/events/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched data:", data);

        // Adjust this if your API wraps data differently
        setEvents(data.slice(0, 3));
        console.log("Events set to state:", data.slice(0, 3));

      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
        console.log("Fetching events finished, loading set to false");
      }
    };

    fetchEvents();
  }, []);

  console.log("Rendering EventsSection - loading:", loading, "events count:", events.length);

  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(135deg, rgba(30, 144, 255, 0.08), rgba(0, 51, 102, 0.08))",
      }}
    >
      <div className="container text-center">
        <h2 className="text-3xl fw-bold text-dark mb-4">Upcoming Events</h2>

        {loading ? (
          <p>Loading events...</p> /* Loading UI */
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="row g-3 g-md-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className="col-12 col-sm-12 col-md-6 col-lg-4"
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
  );
};

export default EventsSection;

