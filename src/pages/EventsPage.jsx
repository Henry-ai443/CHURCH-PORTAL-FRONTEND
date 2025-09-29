import React, {useState, useEffect} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const EventsPage = () => {
  const BASE_URL = "https://church-portal-backend.onrender.com";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // add loading state

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/events/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("An error occured fetching events: ", error);
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
          <h2 className="fw-bold text-dark">Upcoming Events</h2>

          {loading ? (
            <p>Loading events...</p> // Loading message
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
                  {/* Your card code */}
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

export default EventsPage