import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please login.");
          setLoading(false);
          return;
        }

        const res = await fetch("https://church-portal-backend.onrender.com/api/profile/me/", {
          headers: {
            Authorization: `Token ${token}`, // or Bearer depending on your backend
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.detail || "Failed to fetch profile");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
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

    setLoading(true);
    setError(null);

    try {
      setImage(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_upload_preset"); // Replace with your preset

      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!cloudRes.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const cloudData = await cloudRes.json();

      const token = localStorage.getItem("token");
      const updateRes = await fetch("https://church-portal-backend.onrender.com/api/profile/me/", {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_picture: cloudData.secure_url }),
      });

      if (!updateRes.ok) {
        const updateError = await updateRes.json();
        throw new Error(updateError.detail || "Failed to update profile image");
      }

      const updatedProfile = await updateRes.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="sr-only ms-2">Loading...</span>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger mt-5 text-center" role="alert">
        Error: {error}
      </div>
    );

  if (!profile)
    return (
      <div className="alert alert-warning mt-5 text-center" role="alert">
        No profile found.
      </div>
    );

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-header text-center bg-primary text-white">
          <h3>User Profile</h3>
        </div>
        <div className="card-body text-center">
          {profile.profile_picture ? (
            <img
              src={profile.profile_picture}
              alt="Profile"
              className="rounded-circle img-thumbnail mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-secondary rounded-circle mb-3 d-flex align-items-center justify-content-center text-white"
              style={{ width: "150px", height: "150px", fontSize: "3rem" }}
            >
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="profileImage" className="form-label">
              Update Profile Picture
            </label>
            <input
              type="file"
              className="form-control"
              id="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </div>

          <h4 className="card-title">{profile.username}</h4>
          <p className="card-text mb-1">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="card-text">
            <strong>Bio:</strong> {profile.bio ? profile.bio : <em>No bio available.</em>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
