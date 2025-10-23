import { div } from "framer-motion/client";
import React from "react";
import { FaDeaf } from "react-icons/fa";

const AdminWelcomeHeader = () => {
    const username = localStorage.getItem("username");
    const today = new Date.toLocaleDateString('en-US', {
        weekday: "long",
        month:"long",
        day:"numeric",
        year:"numeric",
    });

    return(
        <div className="card shadow-sm mb-4">
            <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                {/**LEFT */}
                <h3 className="fw-bold mb-1">
                    Welcome Back, <span className="text-primary">{username}</span>
                </h3>
                <small className="text-muted">Today is <strong>{today}</strong></small>
            </div>

            {/**RIGHT */}
            <div className="mt-3 mt-md-0 d-flex align-items-center gap-2">
                <span className="badge bg-primary text-white">Staff Admin</span>
            </div>
        </div>
    )
}
export default AdminWelcomeHeader