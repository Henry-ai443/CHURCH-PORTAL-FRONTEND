import React, { useEffect, useState } from "react";

const EventsManagement = () => {
  const [events, setEvents] = useState([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [entry, setEntry] = useState("");
  const [image, setImage] = useState("");

  // Editing state
  const [editEvent, setEditEvent] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin-events/", {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Create Event
  const handleCreate = async (e) => {
    e.preventDefault();

    const newEvent = { title, date, location, zoom_link: zoomLink, entry, image };

    const res = await fetch("http://127.0.0.1:8000/api/admin-events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(newEvent),
    });

    if (res.ok) {
      setTitle("");
      setDate("");
      setLocation("");
      setZoomLink("");
      setEntry("");
      setImage("");
      fetchEvents();
    }
  };

  // Delete Event
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await fetch(`http://127.0.0.1:8000/api/admin-events/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      fetchEvents();
    }
  };

  // Update Event
  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(`http://127.0.0.1:8000/api/admin-events/${editEvent.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(editEvent),
    });

    setEditEvent(null);
    fetchEvents();
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-center mb-4">Events Management</h2>

      {/* CREATE FORM */}
      <div className="card p-4 shadow mb-4">
        <h5 className="fw-bold mb-3">Add New Event</h5>

        <form onSubmit={handleCreate}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input
                type="datetime-local"
                className="form-control"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Youth Hall or Church Grounds"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Zoom Link (optional)</label>
              <input
                type="url"
                className="form-control"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                placeholder="https://zoom.us/..."
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Image URL (Cloudinary)</label>
              <input
                type="url"
                className="form-control"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://res.cloudinary.com/..."
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Entry Description</label>
              <textarea
                className="form-control"
                rows="3"
                required
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Describe the event..."
              ></textarea>
            </div>
          </div>

          <button className="btn btn-primary mt-3 w-100">Create Event</button>
        </form>
      </div>

      {/* EVENTS TABLE */}
      <div className="card p-3 shadow">
        <h5 className="fw-bold mb-3">Existing Events</h5>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, index) => (
              <tr key={e.id}>
                <td>{index + 1}</td>
                <td>{e.title}</td>
                <td>{new Date(e.date).toLocaleString()}</td>
                <td>{e.location}</td>
                <td>
                  <img
                    src={e.image}
                    alt={e.title}
                    width="70"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => setEditEvent(e)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editEvent && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Event</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditEvent(null)}
                />
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editEvent.title}
                      onChange={(e) =>
                        setEditEvent({ ...editEvent, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={editEvent.date?.slice(0, 16)}
                      onChange={(e) =>
                        setEditEvent({ ...editEvent, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editEvent.location}
                      onChange={(e) =>
                        setEditEvent({ ...editEvent, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Zoom Link</label>
                    <input
                      type="url"
                      className="form-control"
                      value={editEvent.zoom_link || ""}
                      onChange={(e) =>
                        setEditEvent({ ...editEvent, zoom_link: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={editEvent.image}
                      onChange={(e) =>
                        setEditEvent({ ...editEvent, image: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Entry Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editEvent.entry}
                      onChange={(e) =>
                        setEditEvent({ ...editEvent, entry: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditEvent(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Update Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;
