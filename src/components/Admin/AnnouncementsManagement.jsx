import React, { useEffect, useState } from "react";
import "./AnnouncementsManagement.css";

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [success, setSuccess] = useState("");
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const [viewMessage, setViewMessage] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch Announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(
        "https://church-portal-backend.onrender.com/api/admin/announcements/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
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

  // Create Announcement
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
        setSuccess("✅ Announcement Created Successfully");
        fetchAnnouncements();
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Announcement
  const handleDelete = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      await fetch(
        `https://church-portal-backend.onrender.com/api/admin/announcements/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      fetchAnnouncements();
    }
  };

  // Update Announcement
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
    <div className="announcements-page container mt-5">
      <h2 className="text-center fw-bold mb-4">📢 Announcements Management</h2>

      {success && <div className="alert alert-success text-center">{success}</div>}

      {/* CREATE FORM */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="fw-bold mb-3">Add New Announcement</h5>

        <form onSubmit={handleCreateAnnouncement}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Write announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              required
              className="form-control"
              placeholder="Announcement message"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Time</label>
            <input
              type="datetime-local"
              required
              className="form-control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100">
            Create Announcement
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="card p-3 shadow-sm">
        <h5 className="fw-bold">Existing Announcements</h5>
        <table className="table table-striped table-hover mt-3">
          <thead>
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
                <td data-label="#">{index + 1}</td>
                <td data-label="Title">{a.title}</td>
                <td
                  data-label="Message"
                  className="truncate"
                  title={a.message}
                  onClick={() => setViewMessage(a.message)}
                >
                  {a.message.length > 100
                    ? a.message.slice(0, 100) + "..."
                    : a.message}
                </td>
                <td data-label="Time">{new Date(a.time).toLocaleString()}</td>
                <td data-label="Actions">
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
                <td colSpan="5" className="text-center py-3 text-muted">
                  No announcements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editAnnouncement && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Announcement</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditAnnouncement(null)}
                ></button>
              </div>

              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      required
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
                      required
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
                    className="btn btn-secondary"
                    onClick={() => setEditAnnouncement(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MESSAGE MODAL */}
      {viewMessage && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Full Message</h5>
                <button
                  className="btn-close"
                  onClick={() => setViewMessage(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{viewMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManagement;
