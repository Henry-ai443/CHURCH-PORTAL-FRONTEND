import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://church-portal-backend.onrender.com/api/profile/me/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "church_portal");

    try {
      setLoading(true);

      const res = await fetch("https://api.cloudinary.com/v1_1/dcftzqhx7/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Update profile with uploaded image URL
      const updateRes = await fetch("https://church-portal-backend.onrender.com/api/profile/me/", {
        method: "PATCH",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_picture: data.secure_url }),
      });

      const updatedProfile = await updateRes.json();
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error uploading image:", err);
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

  if (!profile) {
    return (
      <div className="container text-center mt-5">
        <p className="text-danger fw-bold">No profile found.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h2 className="mb-4 text-primary">My Profile</h2>

        <div className="row align-items-center mb-3">
          <div className="col-md-4 text-center">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: "180px", height: "180px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle mb-3"
                style={{ width: "180px", height: "180px" }}
              >
                No Image
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageUpload}
            />
          </div>

          <div className="col-md-8">
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio || "No bio provided."}</p>
            <p><strong>Joined:</strong> {new Date(profile.created).toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> {new Date(profile.updated).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
