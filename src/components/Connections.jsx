import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/connections", {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return <div className="text-center mt-10">Loading connections...</div>;
  }

  if (connections.length === 0) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold mb-4">Connections</h1>
        <p className="text-gray-600">No connections found yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-10 px-4">
      <h1 className="font-bold text-3xl text-center mb-8">My Connections</h1>
      <div className="w-full max-w-4xl space-y-4">
        {connections.map((connection) => (
          <div
            key={connection._id}
            className="flex flex-col md:flex-row items-center md:items-start p-6 bg-base-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Avatar Section */}
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="avatar">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full">
                  {connection.photoUrl ? (
                    <img
                      src={connection.photoUrl}
                      alt={connection.firstName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {connection.firstName?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 text-center md:text-left">
              {/* Name and Basic Info */}
              <div className="mb-3">
                <h2 className="text-2xl font-bold text-base-content mb-1">
                  {connection.firstName} {connection.lastName}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
                  {connection.age && (
                    <span className="badge badge-outline badge-primary">
                      {connection.age} years old
                    </span>
                  )}
                  {connection.gender && (
                    <span className="badge badge-outline badge-secondary">
                      {connection.gender}
                    </span>
                  )}
                </div>
              </div>

              {/* About Section */}
              {connection.about && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-base-content/80 mb-2">
                    About
                  </h3>
                  <p className="text-base-content/70 leading-relaxed">
                    {connection.about}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs">
                {connection.skills && connection.skills.length > 0 && (
                  <>
                    {connection.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="badge badge-ghost badge-sm">
                        {skill}
                      </span>
                    ))}
                    {connection.skills.length > 3 && (
                      <span className="badge badge-ghost badge-sm">
                        +{connection.skills.length - 3} more
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Action Section */}
            <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-4">
              <div className="flex flex-col gap-2">
                <button className="btn btn-secondary btn-sm">Message</button>
                <button className="btn btn-ghost btn-sm">View Profile</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Stats */}
      <div className="mt-8 text-center">
        <div className="stats stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Total Connections</div>
            <div className="stat-value text-primary">{connections.length}</div>
            <div className="stat-desc">Active connections</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;
