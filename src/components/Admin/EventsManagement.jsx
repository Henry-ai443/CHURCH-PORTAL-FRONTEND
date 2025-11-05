import React, { useEffect, useState } from "react";

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [entry, setEntry] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [editEvent, setEditEvent] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await fetch("https://church-portal-backend.onrender.com/api/admin/events/", {
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

  // Create Event (with image upload)
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("zoom_link", zoomLink);
    formData.append("entry", entry);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch("https://church-portal-backend.onrender.com/api/admin/events/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      if (res.ok) {
        setTitle("");
        setDate("");
        setLocation("");
        setZoomLink("");
        setEntry("");
        setImageFile(null);
        fetchEvents();
      } else {
        console.error("Error creating event");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Event
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await fetch(`https://church-portal-backend.onrender.com/api/admin/events/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      fetchEvents();
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-center mb-4">Events Management</h2>

      {/* CREATE FORM */}
      <div className="card p-4 shadow mb-4">
        <h5 className="fw-bold mb-3">Add New Event</h5>

        <form onSubmit={handleCreate} encType="multipart/form-data">
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
              <label className="form-label">Image File</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
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
    </div>
  );
};

export default EventsManagement;
