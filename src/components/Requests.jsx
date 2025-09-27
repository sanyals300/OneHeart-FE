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

      const res = await axios.get(
        "http://localhost:3000/user/requests/received",
        {
          withCredentials: true,
        }
      );

      console.log("API Response:", res.data);
      console.log("Requests data:", res.data.data);

      // Ensure we're dispatching an array
      const requestsData = res.data?.data || res.data || [];
      if (Array.isArray(requestsData)) {
        dispatch(addRequests(requestsData));
      } else {
        console.error("API response is not an array:", requestsData);
        dispatch(addRequests([]));
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message || "Failed to fetch requests");
      dispatch(addRequests([])); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (request) => {
    try {
      console.log("Accept request:", request);
      // Use the request ID, not user ID
      const requestId = request._id;

      const res = await axios.post(
        `http://localhost:3000/request/review/accepted/${requestId}`,
        {},
        { withCredentials: true }
      );
      console.log("Request accepted successfully:", res.data);
      // Refresh requests after accepting
      fetchRequests();
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleReject = async (request) => {
    try {
      console.log("Reject request:", request);
      // Use the request ID, not user ID
      const requestId = request._id;

      const res = await axios.post(
        `http://localhost:3000/request/review/rejected/${requestId}`,
        {},
        { withCredentials: true }
      );
      console.log("Request rejected successfully:", res.data);
      // Refresh requests after rejecting
      fetchRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold mb-4">Connection Requests</h1>
        <p className="text-red-600">Error: {error}</p>
        <button className="btn btn-primary mt-4" onClick={fetchRequests}>
          Retry
        </button>
      </div>
    );
  }

  if (!requests || !Array.isArray(requests) || requests.length === 0) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold mb-4">Connection Requests</h1>
        <p className="text-gray-600">No pending requests found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center my-10">
      <h1 className="font-bold text-2xl text-center mb-6">
        Connection Requests
      </h1>
      {requests.map((request) => {
        // Add safety checks for request structure
        if (!request || !request._id) {
          console.warn("Invalid request object:", request);
          return null;
        }

        const user = request.fromUserId; // This contains the populated user data

        return (
          <div
            key={request._id}
            className="flex items-center justify-between p-4 m-2 bg-base-300 rounded-lg shadow-md max-w-4xl mx-auto"
          >
            <div className="flex items-center">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.firstName || "User"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center">
                      <span className="text-neutral-content text-xl">
                        {user?.firstName?.[0] || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">
                  {user?.firstName || "Unknown"} {user?.lastName || ""}
                </h2>
                <p className="text-sm opacity-70">
                  {user?.age ? `${user.age}, ` : ""}
                  {user?.gender || ""}
                </p>
                {user?.about && <p className="text-sm mt-1">{user.about}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleAccept(request)}
              >
                Accept
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleReject(request)}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
