import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = {
    Authorization: `Token ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching profile data...");
        const res = await fetch(
          "https://church-portal-backend.onrender.com/api/profile/me/",
          { headers: authHeaders }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch profile");
        }

        const data = await res.json();
        console.log("Profile fetched:", data);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "church_portal");

    setLoading(true);
    setError(null);

    try {
      console.log("Uploading image to Cloudinary...");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcftzqhx7/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Cloudinary response:", data);

      if (!res.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      console.log("Updating profile with new image URL:", data.secure_url);
      const updateRes = await fetch(
        "https://church-portal-backend.onrender.com/api/profile/me/",
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ profile_picture: data.secure_url }),
        }
      );

      const updatedProfile = await updateRes.json();
      console.log("Profile update response:", updatedProfile);

      if (!updateRes.ok) {
        throw new Error(updatedProfile.detail || "Failed to update profile");
      }

      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error uploading image or updating profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
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
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div
        className="card shadow p-4"
        style={{ borderRadius: "12px", backgroundColor: "#f9f9f9" }}
      >
        <h2 className="mb-4 text-primary text-center">My Profile</h2>
        <div className="d-flex flex-column flex-md-row align-items-center gap-4">
          <div className="text-center" style={{ flexShrink: 0 }}>
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
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
              className="btn btn-outline-primary btn-sm w-100"
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

          <div style={{ flexGrow: 1 }}>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
