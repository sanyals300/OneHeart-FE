import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get("/api/user/connections", {
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
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>
        Loading connections...
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>Connections</h1>
        <p style={{ opacity: 0.7 }}>No connections found yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="connections-header">
        <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>My Connections</h1>
      </div>

      <div className="connections-container">
        {connections.map((connection) => (
          <div key={connection._id} className="profile-card">
            <div className="profile-image">
              {connection.photoUrl ? (
                <img src={connection.photoUrl} alt={connection.firstName} />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {connection.firstName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>

            <div className="profile-content">
              <h2>
                {connection.firstName} {connection.lastName}
              </h2>

              <div className="profile-info">
                {connection.age && <span>{connection.age} years old</span>}
                {connection.age && connection.gender && <span> • </span>}
                {connection.gender && <span>{connection.gender}</span>}
              </div>

              {connection.about && (
                <div className="profile-about">{connection.about}</div>
              )}

              <div className="social-links">
                <Link to={`/messages/${connection._id}`} title="Message">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </Link>
                <a href="#" title="View Profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="connections-stats">
        <div className="stat-title">Total Connections</div>
        <div className="stat-value">{connections.length}</div>
        <div className="stat-desc">Active connections</div>
      </div>
    </div>
  );
};

export default Connections;
