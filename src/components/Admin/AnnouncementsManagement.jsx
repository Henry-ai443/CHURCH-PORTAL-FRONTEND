
import React, { useEffect, useState } from "react";

const AnnouncementsManagement = () => {
    const [announcements, setAnnouncements] = useState([]);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [time, setTime] = useState("");
    const [success, setSuccess] = useState("");
    const [editAnnouncement, setEditAnnouncement] = useState(null);

    const token = localStorage.getItem("token");

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch("https://church-portal-backend.onrender.com/api/admin/announcements/", {
                headers:{
                    Authorization:`Token ${token}`,
                }
            });

            const data = await res.json();
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);


    //CREATE
    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();

        try{
            const res = await fetch("https://church-portal-backend.onrender.com/api/admin/announcements/", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Token ${token}`
                },
                body:JSON.stringify({title, message, time})
            });

            if(res.ok){
                setTitle("");
                setMessage("")
                setTime("")
                setSuccess("Announcement Created Successfully");
            }
        }catch(error){
            console.error(error)
        }

    }

    //DELETE
    const handleDelete = async (id) => {
        if(window.confirm("Delete this announcement? ")){
            await fetch(`https://church-portal-backend.onrender.com/api/admin/announcements/${id}/`, {
                method:"DELETE",
                headers:{
                    Authorization:`Token ${token}`,
                },
            });
            fetchAnnouncements();
        }
    }

    //UPDATE
    const handleUpdate = async (e) => {
        e.preventDefault();
        await fetch(`https://church-portal-backend.onrender.com/api/admin/announcements/${editAnnouncement.id}/`, {
            method:"PATCH",
            headers:{
                'Content-Type':"application/json",
                Authorization:`Token ${token}`,
            },
            body:JSON.stringify({
                title:editAnnouncement.title,
                message:editAnnouncement.message,
                time: editAnnouncement.time
            }),
        });

        setEditAnnouncement(null)
        fetchAnnouncements();
    }

    return(
        <div className="container mt-5">
            <h2 className="text-center fw-bold mb-4">Announcements Management</h2>

            {/**CREATE FORM */}
            <div className="card p-4 mb-4 shadow">
                <h5 className="fw-bold mb-3">Add Announcement</h5>

                <form action="" onSubmit={handleCreateAnnouncement}>
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Title</label>
                        <input type="text"
                        required
                        className="form-control"
                        placeholder="Write announcement title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Message</label>
                        <textarea name="" id=""
                        required
                        className="form-control"
                        placeholder="Announcement message"
                        rows="3"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Time</label>
                        <input type="datetime-local"
                        required
                        className="form-control"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-primary w-100">Create Announcement</button>

                </form>
            </div>

            {/**LIST */}
            <div className="card p-3 shadow">
                <h5 className="fw-bold">Existing Announcements</h5>
                <table className="table table-striped table-hover mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Message</th>
                            <th>Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {announcements.map((a, index) => (
                            <tr
                            key={a.id}
                             >
                                <td>{index + 1}</td>
                                <td>{a.title}</td>
                                <td>{a.message}</td>
                                <td>{new Date(a.time).toLocaleString()}</td>
                                <td>
                                <button className="btn btn-warning btn-sm me-2"
                                onClick={() => setAnnouncements(a)}
                                >
                                    Edit
                                </button>

                                <button className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(a.id)}
                                >Delete</button>
                                </td>
                             </tr>
                        ))}

                        {announcements.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-3 text-muted">
                                    No announcements Found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/**EDIT MODAL */}
            {editAnnouncement && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Announcement</h5>
                            <button className="btn-close" onClick={() => setEditAnnouncement(null)}></button>
                        </div>

                        <form action="" onSubmit={handleUpdate}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="" className="form-label">Title</label>
                                    <input type="text"
                                    required
                                    className="form-control"
                                    value={editAnnouncement.title}
                                    onChange={(e) => setEditAnnouncement({...editAnnouncement, title: e.target.value})}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="" className="form-label">Message</label>
                                    <textarea name="" id=""
                                    required
                                    className="form-control"
                                    rows="3"
                                    value={editAnnouncement.message}
                                    onChange={setEditAnnouncement({...editAnnouncement, message: e.target.value})}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="" className="form-label">Time</label>
                                    <input type="datetime-local" 
                                    className="form-control"
                                    value={editAnnouncement.time?.slice(0, 16)}
                                    onChange={(e) => setEditAnnouncement({...editAnnouncement, time: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={setEditAnnouncement(null)}>Cancel</button>

                                <button className="btn btn-success" onClick="submit">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )

}

export default AnnouncementsManagement;