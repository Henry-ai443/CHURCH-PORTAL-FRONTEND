import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile on mount
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
            Authorization: `Token ${token}`, // Adjust if your backend uses Bearer
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

  // Handle image upload to Cloudinary + update profile picture URL
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

      // Upload to Cloudinary
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!cloudRes.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const cloudData = await cloudRes.json();

      // Update profile with new image URL
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

  if (loading) return <p>Loading...</p>;

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (!profile) return <p>No profile found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>Profile Page</h1>

      <div style={{ marginBottom: "1rem" }}>
        {profile.profile_picture ? (
          <img
            src={profile.profile_picture}
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <p>No profile picture set</p>
        )}
      </div>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <h2>{profile.username}</h2>
      <p>Email: {profile.email}</p>
      <p>Bio: {profile.bio || "No bio available."}</p>
    </div>
  );
};

export default Profile;
