import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EventDetailPage = () => {
  const { id } = useParams();  // get event id from URL
  const BASE_URL = "https://church-portal-backend.onrender.com";

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/events/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch event with status ${response.status}`);
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center py-5">Loading event details...</p>;
  if (error) return <p className="text-center py-5 text-danger">Error: {error}</p>;
  if (!event) return <p className="text-center py-5">Event not found</p>;

  return (
    <>
      <Navbar />
      <section className="py-5 container">
        <Link to="/events" className="btn btn-link mb-3">
          &larr; Back to Events
        </Link>

        <div className="card shadow-lg" style={{ backdropFilter: "blur(12px)" }}>
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="card-img-top"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                height: "400px",
                background: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
              }}
            >
              No Image Available
            </div>
          )}

          <div className="card-body">
            <h1 className="card-title fw-bold">{event.title}</h1>
            <p className="text-muted">
              {new Date(event.date_time).toLocaleString()}
              {event.location && ` — ${event.location}`}
            </p>
            <p>{event.description}</p>

            {/* Add more fields if your event data has them, e.g. organizer, contact info */}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default EventDetailPage;
