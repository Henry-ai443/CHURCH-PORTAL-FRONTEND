
import { useEffect, useState } from "react";
import React from "react";

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const isStaff = localStorage.getItem("isStaff");

    useEffect(() => {
        if(!token) return

        const fetchUsers = async () => {
            try{
                const response = await fetch("https://church-portal-backend.onrender.com/api/registered_users", {
                    method:"GET",
                    headers:{
                        "Content-Type": "application/json",
                        Authorization:`Token ${token}`
                    }
                })

                const data = await response.json();
                setUsers(data)
            }catch(error){
                console.error(error)
            }
        }

        fetchUsers();
    }, [token])

    if(isStaff !== "true"){
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    You are not authorized to view this page
                </div>
            </div>
        );
    }

    return(
        <div className="container mt-4">
            <h3 className="text-center mb-4">Users Management</h3>
            <div className="card shadow">
                <div className="card-body">
                    <table className="table table-hover table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Staff</th>
                                <th>Active</th>
                                <th>Date Joined</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.isStaff ? (
                                            <span className="badge bg-success">Admin</span>
                                        ): (
                                            <span className="badge bg-secondary">User</span>
                                        )}
                                    </td>

                                    <td>
                                        {user.is_active ? (
                                            <span className="badge bg-success">Active</span>
                                        ): (
                                            <span className="badge bg-danger">Inactive</span>
                                        )}
                                    </td>

                                    <td>{new Date(user.date_joined).toDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <p className="No users found..."></p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UsersManagement;