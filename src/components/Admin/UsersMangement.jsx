import { useEffect, useState } from "react";
import React from "react";
import "./UsersManagement.css"; // <-- import custom styles

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        const fetchUsers = async () => {
            try {
                const response = await fetch("https://church-portal-backend.onrender.com/api/registered_users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                const data = await response.json();
                console.log(data)
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, [token]);

    return (
        <div className="users-container container mt-5">
            <h2 className="text-center mb-4 title">Users Management</h2>

            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-body p-4">
                    <div className="table-responsive">
                        <table className="table align-middle table-hover users-table">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Staff</th>
                                    <th>Status</th>
                                    <th>Date Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td className="fw-semibold text-primary">{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.isStaff ? (
                                                <span className="badge bg-gradient bg-success px-3 py-2">Admin</span>
                                            ) : (
                                                <span className="badge bg-gradient bg-secondary px-3 py-2">User</span>
                                            )}
                                        </td>
                                        <td>
                                            {user.is_active ? (
                                                <span className="badge bg-gradient bg-success px-3 py-2">Active</span>
                                            ) : (
                                                <span className="badge bg-gradient bg-danger px-3 py-2">Inactive</span>
                                            )}
                                        </td>
                                        <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <p className="text-center text-muted mt-3">No users found...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
