import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import axios from "axios";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [localFeed, setLocalFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFeed = async () => {
    console.log("getFeed called, current feed:", feed);
    setLoading(true);
    setError(null);

    try {
      console.log("Making API call to /feed...");
      const res = await axios.get("http://localhost:3000/feed", {
        withCredentials: true,
      });

      console.log("Feed API response:", res.data);
      console.log("Response length:", res.data?.length);

      if (res.data && Array.isArray(res.data)) {
        dispatch(addFeed(res.data));
        setLocalFeed(res.data);
        console.log("Feed updated in Redux and local state");
      } else {
        console.log("Invalid feed data format:", res.data);
        setError("Invalid feed data received");
      }
    } catch (err) {
      console.log("Error fetching feed:", err);
      setError("Failed to fetch feed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, userId) => {
    console.log("Action:", action, "for user:", userId);

    try {
      const response = await axios.post(
        `http://localhost:3000/request/send/${action}/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Backend response:", response.data);

      const currentFeedData = localFeed || feed;
      console.log(
        "Current feed length:",
        currentFeedData?.length,
        "Current index:",
        currentUserIndex
      );

      // Move to next user
      if (currentUserIndex < currentFeedData.length - 1) {
        setCurrentUserIndex((prev) => prev + 1);
        console.log("Moving to next user, new index:", currentUserIndex + 1);
      } else {
        console.log("No more users in current feed, fetching new ones...");
        await getFeed();
        setCurrentUserIndex(0);
      }
    } catch (err) {
      console.log("Error sending action:", err.response?.data || err.message);
      // Move to next user even on error
      const currentFeedData = localFeed || feed;
      if (currentUserIndex < currentFeedData.length - 1) {
        setCurrentUserIndex((prev) => prev + 1);
      } else {
        setCurrentUserIndex(currentFeedData.length);
      }
    }
  };

  useEffect(() => {
    console.log("Feed component mounted");
    if (!feed && !localFeed) {
      getFeed();
    } else {
      setLoading(false);
    }
  }, []);

  // Use local feed if available, otherwise use Redux feed
  const currentFeedData = localFeed || feed;

  console.log(
    "Render - Loading:",
    loading,
    "Error:",
    error,
    "Feed length:",
    currentFeedData?.length,
    "Current index:",
    currentUserIndex
  );

  if (loading) {
    return (
      <div className="flex justify-center my-10">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 w-96 shadow-lg border-2">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-error">Error</h2>
            <p>{error}</p>
            <div className="card-actions justify-center my-3">
              <button className="btn btn-primary" onClick={getFeed}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentFeedData || currentFeedData.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 w-96 shadow-lg border-2">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">No Users Found</h2>
            <p>No users available in your feed.</p>
            <div className="card-actions justify-center my-3">
              <button className="btn btn-primary" onClick={getFeed}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentUserIndex >= currentFeedData.length) {
    return (
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 w-96 shadow-lg border-2">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">No More Users!</h2>
            <p>
              You've seen all available users. Check back later for new
              profiles!
            </p>
            <div className="card-actions justify-center my-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setCurrentUserIndex(0);
                  getFeed();
                }}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = currentFeedData[currentUserIndex];
  console.log(
    "Rendering user:",
    currentUser?.firstName,
    "at index:",
    currentUserIndex
  );

  return (
    <div className="flex justify-center my-10">
      <UserCard user={currentUser} onUserAction={handleUserAction} />
    </div>
  );
};

export default Feed;
