import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Error & success messages
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Editable form data for profile info
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    email: "",
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Helper to get auth headers fresh on every request
  const getAuthHeaders = () => ({
    Authorization: `Token ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setError(null);
      try {
        const res = await fetch(
          "https://church-portal-backend.onrender.com/api/profile/me/",
          { headers: getAuthHeaders() }
        );

        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch profile");
        }

        const data = await res.json();
        setProfile(data);
        setFormData({
          username: data.username || "",
          bio: data.bio || "",
          email: data.email || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", "church_portal");

    setLoadingImage(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcftzqhx7/image/upload",
        {
          method: "POST",
          body: formDataCloud,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      // Update profile image URL
      const updateRes = await fetch(
        "https://church-portal-backend.onrender.com/api/profile/me/",
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ image: data.secure_url }),
        }
      );

      const updatedProfile = await updateRes.json();

      if (!updateRes.ok) {
        throw new Error(updatedProfile.detail || "Failed to update profile");
      }

      setProfile(updatedProfile);
      setSuccessMessage("Profile picture updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingImage(false);
    }
  };

  // Handle input change for profile info form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit profile info update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(
        "https://church-portal-backend.onrender.com/api/profile/me/",
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to update profile");
      }

      setProfile(data);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingInfo(false);
    }
  };

  // Handle password form input change
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password change form submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setError(null);
    setSuccessMessage(null);

    const { current_password, new_password, confirm_password } = passwordData;

    // Basic validation
    if (!current_password || !new_password || !confirm_password) {
      setError("Please fill out all password fields.");
      setLoadingPassword(false);
      return;
    }
    if (new_password !== confirm_password) {
      setError("New password and confirmation do not match.");
      setLoadingPassword(false);
      return;
    }

    try {
      // Assuming backend endpoint for password change is /api/profile/change_password/
      const res = await fetch(
        "https://church-portal-backend.onrender.com/api/profile/change_password/",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ current_password, new_password }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.detail || "Failed to change password. Please try again."
        );
      }

      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="text-center my-3">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  if (loadingProfile && !profile) {
    // Show loading spinner on initial load
    return (
      <div className="container text-center mt-5">
        <LoadingSpinner />
        <p className="mt-3 fw-bold fs-5">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      {/* Global error & success messages */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      {!profile ? (
        <div className="text-center mt-5">
          <p className="text-danger fw-bold">No profile found.</p>
        </div>
      ) : (
        <div
          className="card shadow p-4"
          style={{ borderRadius: "12px", backgroundColor: "#f9f9f9" }}
        >
          <h2 className="mb-4 text-primary text-center">My Profile</h2>

          {/* Profile Image at the Top */}
          <div className="text-center mb-4">
            {profile.image ? (
              <img
                src={profile.image}
                alt="Profile"
                className="rounded-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <div
                className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle"
                style={{
                  width: "150px",
                  height: "150px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                }}
              >
                No Image
              </div>
            )}

            {/* Upload Button */}
            <div className="mt-2">
              <label
                htmlFor="upload-image"
                className={`btn btn-outline-primary btn-sm ${
                  loadingImage ? "disabled" : ""
                }`}
                style={{ cursor: loadingImage ? "not-allowed" : "pointer" }}
              >
                {loadingImage ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Uploading...
                  </>
                ) : (
                  "Upload New Picture"
                )}
              </label>
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                disabled={loadingImage}
                aria-label="Upload profile picture"
              />
            </div>
          </div>

          {/* Two-column layout */}
          <div className="row">
            {/* Left Column - Personal Info */}
            <div className="col-md-6 mb-4">
              <h5 className="text-secondary">Personal Information</h5>
              <p>
                <strong>Username:</strong> {profile.username}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Bio:</strong> {profile.bio || "No bio provided."}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {profile.created
                  ? new Date(profile.created).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {profile.updated
                  ? new Date(profile.updated).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            {/* Right Column - Edit Forms */}
            <div className="col-md-6">
              {/* Edit Profile Info */}
              <h5 className="text-secondary mb-3">Edit Profile</h5>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={loadingInfo}
                    autoComplete="username"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loadingInfo}
                    autoComplete="email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-control"
                    rows="3"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={loadingInfo}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loadingInfo}
                >
                  {loadingInfo ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>

              {/* Password Change */}
              <hr className="my-4" />
              <h5 className="text-secondary mb-3">Change Password</h5>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="current_password">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    className="form-control"
                    value={passwordData.current_password}
                    onChange={handlePasswordInputChange}
                    required
                    disabled={loadingPassword}
                    autoComplete="current-password"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="new_password">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    className="form-control"
                    value={passwordData.new_password}
                    onChange={handlePasswordInputChange}
                    required
                    disabled={loadingPassword}
                    autoComplete="new-password"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="confirm_password">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    className="form-control"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordInputChange}
                    required
                    disabled={loadingPassword}
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-warning w-100"
                  disabled={loadingPassword}
                >
                  {loadingPassword ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
