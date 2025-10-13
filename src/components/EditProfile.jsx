import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice"; // Assuming this adds/updates the user in Redux
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";

const EditProfile = () => {
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    about: "",
    photoUrl: "", // Existing or new photo URL
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false); // New state for photo upload
  const [photoError, setPhotoError] = useState(null); // New state for photo upload error

  // --- Cloudinary Configuration ---
  const CLOUD_NAME = "dknemunak"; // <<< Replace with your Cloudinary Cloud Name
  const UPLOAD_PRESET = "oneheart"; // <<< Replace with your Unsigned Upload Preset Name

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        age: currentUser.age || "",
        gender: currentUser.gender || "",
        about: currentUser.about || "",
        photoUrl: currentUser.photoUrl || "", // Initialize with existing photo
      });
    } else {
      // If no user in Redux, try to fetch or redirect to login
      // For this example, we'll assume currentUser is always available after login
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    setPhotoError(null);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newPhotoUrl = response.data.secure_url;
      setFormData((prev) => ({ ...prev, photoUrl: newPhotoUrl }));
      // Optionally, you might want to save this immediately or wait for full form submit
      // For now, it just updates the local form state.
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setPhotoError("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send updated formData to your backend's user update endpoint
      const res = await axios.put(
        "/api/profile/edit", // Adjust this endpoint if needed
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res.data.data)); // Update Redux store with new user data
      // Optionally, navigate somewhere or show a success message
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err?.response?.data || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2 className="form-title">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Photo Upload Section */}
          <div className="form-group photo-upload-group">
            <label className="form-label">Profile Photo</label>
            <div className="current-photo-preview">
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Profile" />
              ) : (
                <div className="photo-placeholder">No Photo</div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="photo-input-field"
              disabled={uploadingPhoto}
            />
            {uploadingPhoto && (
              <p className="upload-status-text">Uploading...</p>
            )}
            {photoError && <p className="error-message">{photoError}</p>}
          </div>

          {/* Existing form fields */}
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="age" className="form-label">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="about" className="form-label">
              About Me
            </label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="form-input"
            ></textarea>
          </div>

          <div className="form-actions">
            {error && <p className="error-message">{error}</p>}
            <button
              type="submit"
              className="form-button"
              disabled={loading || uploadingPhoto}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
      {/* Your UserCard Preview component would go here, receiving formData as prop */}
      {currentUser && <UserCard user={formData} />}{" "}
      {/* Pass formData for live preview */}
    </div>
  );
};

export default EditProfile;
