import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // <-- add loading
  const BASE_URL = "https://church-portal-backend.onrender.com";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true); // <-- start loading
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/events/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("Fetched events: ", data);
        setEvents(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="py-5" style={{ background: "linear-gradient(135deg, rgba(30, 144, 255, 0.08), rgba(0, 51, 102, 0.08))" }}>
      <div className="container text-center">
        <h2 className="text-3xl fw-bold text-dark mb-4">Upcoming Events</h2>

        {loading ? (
          <p>Loading events...</p> // <-- Loading UI
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
                {/* Your card code here */}
              </motion.div>
            ))}
          </div>
        )}

        {/* rest of your section */}
      </div>
    </section>
  );
};


export default EventsSection;
