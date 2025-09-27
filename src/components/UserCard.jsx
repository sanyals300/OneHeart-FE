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

  return (
    <div className="card bg-base-300 w-96 shadow-lg border-2">
      <figure>
        <img
          src={user.photoUrl}
          alt={user.firstName}
          className="h-80 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{user.firstName}</h2>
        <p>{user.age}</p>
        <p>{user.about}</p>
        <div className="card-actions justify-center my-3">
          <button
            className="btn btn-primary"
            onClick={handleIgnore}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Ignore"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleInterested}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Interested"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
