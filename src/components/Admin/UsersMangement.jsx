import React, { useEffect, useState, useRef, useCallback } from "react";
import "./UsersManagement.css"; 
import debounce from "lodash.debounce";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const observer = useRef();

  // Fetch users function
  const fetchUsers = async (pageNum = 1, searchTerm = "") => {
    if (!token) {
      setError("Authorization token not found. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://church-portal-backend.onrender.com/api/registered_users/?page=${pageNum}&limit=20&search=${searchTerm}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users.");

      const data = await response.json();

      if (pageNum === 1) {
        setUsers(data.users);
      } else {
        setUsers((prev) => [...prev, ...data.users]);
      }

      setHasNext(data.has_next);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      fetchUsers(1, value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Load more when scrolling
  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasNext]
  );

  // Fetch users on page change
  useEffect(() => {
    if (page === 1) return; // Already fetched on search or initial load
    fetchUsers(page, search);
  }, [page]);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Users Management</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by username or email..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-4">
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
                {users.map((user, index) => {
                  const isLast = index === users.length - 1;
                  return (
                    <tr key={user.id} ref={isLast ? lastUserRef : null}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.is_staff ? (
                          <span className="badge bg-success">Admin</span>
                        ) : (
                          <span className="badge bg-secondary">User</span>
                        )}
                      </td>
                      <td>
                        {user.is_active ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Inactive</span>
                        )}
                      </td>
                      <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="text-center p-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && users.length === 0 && (
            <p className="text-center my-3 text-muted">No users found...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
