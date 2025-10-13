import React from "react";

const UserCard = ({ user, onUserAction, isLoading }) => {
  const handleIgnore = () => {
    if (onUserAction) {
      onUserAction("ignored", user._id);
    }
  };

  const handleInterested = () => {
    if (onUserAction) {
      onUserAction("interested", user._id);
    }
  };

  // Combine first name and last name if it exists
  const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return (
    <div className="glass-user-card">
      <figure>
        <img
          src={user.photoUrl || "https://via.placeholder.com/400"} // Added a fallback image
          alt={displayName}
        />
      </figure>

      <div className="glass-card-body">
        <h2 className="glass-card-title">
          {displayName},{" "}
          <span style={{ fontWeight: "normal", opacity: 0.9 }}>{user.age}</span>
        </h2>
        <p className="glass-card-info">{user.about}</p>
      </div>

      <div className="glass-card-actions">
        <button
          className="action-button action-button-ignore"
          onClick={handleIgnore}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Ignore"}
        </button>
        <button
          className="action-button action-button-interested"
          onClick={handleInterested}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Interested"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
