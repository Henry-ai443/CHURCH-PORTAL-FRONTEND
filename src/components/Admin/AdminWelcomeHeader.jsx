import React from "react";
import { motion } from "framer-motion";
import { FaUserShield } from "react-icons/fa";
import './admin.css'

const AdminWelcomeHeader = () => {
  const username = localStorage.getItem("username") || "Admin";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      className="admin-header card border-0 shadow-sm mb-4 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
        {/* LEFT */}
        <div>
          <h3 className="fw-bold mb-1 text-gradient">
            Welcome Back, <span className="username">{username}</span>
          </h3>
          <small className="text-muted">
            Today is <strong>{today}</strong>
          </small>
        </div>

        {/* RIGHT */}
        <div className="mt-3 mt-md-0 d-flex align-items-center gap-2">
          <FaUserShield className="text-primary fs-4" />
          <span className="badge bg-gradient text-white fw-semibold">
            Staff Admin
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminWelcomeHeader;
