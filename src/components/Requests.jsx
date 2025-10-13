import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addRequests } from "../utils/requestsSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests?.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/user/requests/received", {
        withCredentials: true,
      });
      const requestsData = res.data?.data || [];
      if (Array.isArray(requestsData)) {
        dispatch(addRequests(requestsData));
      } else {
        dispatch(addRequests([]));
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message || "Failed to fetch requests");
      dispatch(addRequests([]));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, requestId) => {
    const url = `/api/request/review/${action}/${requestId}`;
    try {
      await axios.post(url, {}, { withCredentials: true });
      fetchRequests(); // Refresh the list after any action
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div className="requests-state-container">Loading requests...</div>;
  }

  if (error) {
    return (
      <div className="requests-state-container">
        <h2>Error Fetching Requests</h2>
        <p style={{ opacity: 0.7, marginTop: "10px" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="requests-container">
      <div className="requests-list-card">
        <h1 className="requests-header">Connection Requests</h1>
        {!requests || requests.length === 0 ? (
          <div className="requests-state-container" style={{ padding: "20px" }}>
            <p>No pending requests found.</p>
          </div>
        ) : (
          requests.map((request) => {
            if (!request || !request._id) return null;
            const user = request.fromUserId;

            return (
              <div key={request._id} className="request-item">
                <div className="request-user-info">
                  <div className="request-avatar">
                    {user?.photoUrl ? (
                      <img src={user.photoUrl} alt={user.firstName || "User"} />
                    ) : (
                      <div className="request-avatar-initials">
                        <span>
                          {user?.firstName?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="request-text-content">
                    <h2 className="request-name">
                      {user?.firstName || "Unknown"} {user?.lastName || ""}
                    </h2>
                    <p className="request-details">
                      {user?.age ? `${user.age}, ` : ""}
                      {user?.gender || ""}
                    </p>
                    {user?.about && (
                      <p className="request-about">{user.about}</p>
                    )}
                  </div>
                </div>
                <div className="request-actions">
                  <button
                    className="request-btn request-btn-accept"
                    onClick={() => handleAction("accepted", request._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="request-btn request-btn-reject"
                    onClick={() => handleAction("rejected", request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Requests;
