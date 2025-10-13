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
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/feed", {
        withCredentials: true,
      });
      if (res.data && Array.isArray(res.data)) {
        dispatch(addFeed(res.data));
        setLocalFeed(res.data);
      } else {
        setError("Invalid feed data received");
      }
    } catch (err) {
      setError("Failed to fetch feed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, userId) => {
    try {
      await axios.post(
        `/api/request/send/${action}/${userId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error sending action:", err.response?.data || err.message);
    } finally {
      // Always move to the next user
      const currentFeedData = localFeed || feed;
      if (currentUserIndex < currentFeedData.length - 1) {
        setCurrentUserIndex((prev) => prev + 1);
      } else {
        await getFeed();
        setCurrentUserIndex(0);
      }
    }
  };

  useEffect(() => {
    if (!feed && !localFeed) {
      getFeed();
    } else {
      setLoading(false);
    }
  }, []);

  const currentFeedData = localFeed || feed;

  if (loading) {
    return (
      <div className="feed-container">
        <div className="themed-loader-container">
          <div className="themed-loader"></div>
          <p className="themed-loader-text">Finding users for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="feed-state-card">
          <h2 className="feed-state-title error">Oops! An Error Occurred</h2>
          <p className="feed-state-message">{error}</p>
          <button className="feed-state-button" onClick={getFeed}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentFeedData || currentFeedData.length === 0) {
    return (
      <div className="feed-container">
        <div className="feed-state-card">
          <h2 className="feed-state-title">No Users Found</h2>
          <p className="feed-state-message">
            There are no new users available in your area right now.
          </p>
          <button className="feed-state-button" onClick={getFeed}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (currentUserIndex >= currentFeedData.length) {
    return (
      <div className="feed-container">
        <div className="feed-state-card">
          <h2 className="feed-state-title">That's Everyone!</h2>
          <p className="feed-state-message">
            You've seen all available users. Check back later for new profiles!
          </p>
          <button
            className="feed-state-button"
            onClick={() => {
              setCurrentUserIndex(0);
              getFeed();
            }}
          >
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  const currentUser = currentFeedData[currentUserIndex];

  return (
    <div className="feed-container">
      <UserCard user={currentUser} onUserAction={handleUserAction} />
    </div>
  );
};

export default Feed;
