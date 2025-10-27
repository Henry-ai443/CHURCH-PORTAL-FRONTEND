import React, { useEffect, useState } from "react";
import "./AnnouncementsManagement.css"; // 👈 custom styles

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [success, setSuccess] = useState("");
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const [viewMessage, setViewMessage] = useState(null); // 👈 for viewing full message

  const token = localStorage.getItem("token");

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(
        "https://church-portal-backend.onrender.com/api/admin/announcements/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // CREATE
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://church-portal-backend.onrender.com/api/admin/announcements/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ title, message, time }),
        }
      );

      if (res.ok) {
        setTitle("");
        setMessage("");
        setTime("");
        setSuccess("✅ Announcement created successfully!");
        fetchAnnouncements();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      await fetch(
        `https://church-portal-backend.onrender.com/api/admin/announcements/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );
      fetchAnnouncements();
    }
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(
      `https://church-portal-backend.onrender.com/api/admin/announcements/${editAnnouncement.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          title: editAnnouncement.title,
          message: editAnnouncement.message,
          time: editAnnouncement.time,
        }),
      }
    );

    setEditAnnouncement(null);
    fetchAnnouncements();
  };

  return (
    <div className="container my-5 announcements-page">
      <div className="card shadow-lg p-4 border-0 rounded-4">
        <h2 className="text-center fw-bold mb-4 text-primary">
          📢 Announcements Management
        </h2>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success text-center py-2">{success}</div>
        )}

        {/* CREATE FORM */}
        <div className="card border-0 shadow-sm p-4 mb-5">
          <h5 className="fw-bold mb-3 text-secondary">
            ➕ Add New Announcement
          </h5>
          <form onSubmit={handleCreateAnnouncement}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Write announcement title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="col-md-5">
                <label className="form-label fw-semibold">Message</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Announcement message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold">Time</label>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <button className="btn btn-primary mt-4 w-100">
              Create Announcement
            </button>
          </form>
        </div>

        {/* LIST TABLE */}
        <div className="card border-0 shadow-sm p-4">
          <h5 className="fw-bold text-secondary mb-3">
            📋 Existing Announcements
          </h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((a, index) => (
                  <tr key={a.id}>
                    <td>{index + 1}</td>
                    <td>{a.title}</td>
                    <td
                      title={a.message}
                      className="truncate"
                      onClick={() => setViewMessage(a.message)}
                      style={{ cursor: "pointer" }}
                    >
                      {a.message.length > 100
                        ? a.message.slice(0, 100) + "..."
                        : a.message}
                    </td>
                    <td>{new Date(a.time).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => setEditAnnouncement(a)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(a.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {announcements.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editAnnouncement && (
          <div
            className="modal show fade d-block bg-dark bg-opacity-50"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-3">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Edit Announcement</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setEditAnnouncement(null)}
                  ></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editAnnouncement.title}
                        onChange={(e) =>
                          setEditAnnouncement({
                            ...editAnnouncement,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editAnnouncement.message}
                        onChange={(e) =>
                          setEditAnnouncement({
                            ...editAnnouncement,
                            message: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={editAnnouncement.time?.slice(0, 16)}
                        onChange={(e) =>
                          setEditAnnouncement({
                            ...editAnnouncement,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setEditAnnouncement(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* VIEW FULL MESSAGE MODAL */}
        {viewMessage && (
          <div
            className="modal show fade d-block bg-dark bg-opacity-50"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-3">
                <div className="modal-header bg-secondary text-white">
                  <h5 className="modal-title">Full Message</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setViewMessage(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted">{viewMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsManagement;
