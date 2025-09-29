import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://church-portal-backend.onrender.com/api/profile/me/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_upload_preset"); // Replace with your actual preset

      // Upload image to Cloudinary
      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dcftzqhx7/image/upload", // Replace your_cloud_name
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudRes.ok) throw new Error("Cloudinary upload failed");

      const cloudData = await cloudRes.json();

      // Update profile on your backend
      const backendRes = await fetch("https://church-portal-backend.onrender.com/api/profile/me/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_picture: cloudData.secure_url }),
      });

      if (!backendRes.ok) throw new Error("Failed to update profile image");

      const updatedProfile = await backendRes.json();

      // Update local state
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>Profile Page</h1>

      {profile.profile_picture ? (
        <img
          src={profile.profile_picture}
          alt="Profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            backgroundColor: "#ccc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#666",
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          No Image
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <label
          htmlFor="imageUpload"
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
        >
          {uploading ? "Uploading..." : "Upload New Profile Image"}
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          disabled={uploading}
        />
      </div>

      <h2>{profile.username}</h2>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Bio:</strong> {profile.bio || "No bio available"}
      </p>
    </div>
  );
};

export default Profile;

