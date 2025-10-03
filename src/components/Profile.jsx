import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form state for editing profile
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  // Password change form state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
  });

  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const authHeaders = {
    Authorization: `Token ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://church-portal-backend.onrender.com/api/profile/me/",
          { headers: authHeaders }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Failed to fetch profile");
        }
        const data = await res.json();
        setProfile(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formDataCloudinary = new FormData();
      formDataCloudinary.append("file", file);
      formDataCloudinary.append("upload_preset", "church_portal");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcftzqhx7/image/upload",
        {
          method: "POST",
          body: formDataCloudinary,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      // Update profile with new image URL
      const updateRes = await fetch(
        "https://church-portal-backend.onrender.com/api/profile/me/",
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ image: data.secure_url }),
        }
      );

      const updatedProfile = await updateRes.json();
      if (!updateRes.ok) {
        throw new Error(updatedProfile.detail || "Failed to update profile");
      }

      setProfile(updatedProfile);
      setSuccessMessage("Profile image updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes in profile edit form
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(
        "https://church-portal-backend.onrender.com/api/profile/me/",
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to update profile");
      }

      setProfile(data);
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingProfile(false);
    }
  };

  // Handle password form input change
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmittingPassword(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(
        "https://church-portal-backend.onrender.com/api/profile/change_password/",
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(passwordData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to change password");
      }

      setPasswordData({ current_password: "", new_password: "" });
      setSuccessMessage("Password changed successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 fw-bold fs-5">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <p className="text-danger fw-bold">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container text-center mt-5">
        <p className="text-danger fw-bold">No profile found.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4 text-primary text-center">My Profile</h2>

      {/* Profile image centered on top */}
      <div className="d-flex flex-column align-items-center mb-4">
        {profile.image ? (
          <img
            src={profile.image}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{
              width: "180px",
              height: "180px",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <div
            className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle mb-3"
            style={{
              width: "180px",
              height: "180px",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            No Image
          </div>
        )}

        <label
          htmlFor="upload-image"
          className="btn btn-outline-primary btn-sm w-50 mt-2"
          style={{ cursor: "pointer" }}
        >
          Upload New Picture
        </label>
        <input
          id="upload-image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          disabled={loading}
          aria-label="Upload profile picture"
        />
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="alert alert-success text-center">{successMessage}</div>
      )}

      {/* Error message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Two-column layout */}
      <div className="d-flex flex-column flex-md-row gap-4">
        {/* Left card: Personal info display */}
        <div
          className="card p-4 shadow-sm"
          style={{ backgroundColor: "white", flex: 1 }}
          aria-label="Personal information"
        >
          <h5 className="mb-3 text-primary">Personal Information</h5>
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
            {new Date(profile.created).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(profile.updated).toLocaleDateString()}
          </p>
        </div>

        {/* Right card: Settings - edit profile + change password */}
        <div
          className="card p-4 shadow-sm"
          style={{ backgroundColor: "white", flex: 1 }}
          aria-label="Settings"
        >
          <h5 className="mb-3 text-primary">Edit Profile</h5>
          <form onSubmit={handleProfileSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleProfileChange}
                disabled={submittingProfile}
                required
                aria-required="true"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleProfileChange}
                disabled={submittingProfile}
                required
                aria-required="true"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                rows="3"
                value={formData.bio}
                onChange={handleProfileChange}
                disabled={submittingProfile}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingProfile}
              aria-disabled={submittingProfile}
            >
              {submittingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <hr className="my-4" />

          <h5 className="mb-3 text-primary">Change Password</h5>
          <form onSubmit={handlePasswordSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="current_password" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                className="form-control"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                disabled={submittingPassword}
                required
                aria-required="true"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="new_password" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                className="form-control"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                disabled={submittingPassword}
                required
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submittingPassword}
              aria-disabled={submittingPassword}
            >
              {submittingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

