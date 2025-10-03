import React, { useState, useRef } from "react";

const UserCard = ({ user, onUserAction, isLoading }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Minimum swipe distance (in px) to trigger action
  const minSwipeDistance = 100;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };

    const diffX = currentTouch.x - touchStart.x;
    const diffY = currentTouch.y - touchStart.y;

    setOffsetX(diffX);
    setOffsetY(diffY);
    setRotation(diffX * 0.1);
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      resetPosition();
      return;
    }

    const distance = touchEnd.x - touchStart.x;
    const isLeftSwipe = distance < -minSwipeDistance;
    const isRightSwipe = distance > minSwipeDistance;

    if (isLeftSwipe) {
      animateSwipeOut("left");
      setTimeout(() => handleIgnore(), 300);
    } else if (isRightSwipe) {
      animateSwipeOut("right");
      setTimeout(() => handleInterested(), 300);
    } else {
      resetPosition();
    }
  };

  const animateSwipeOut = (direction) => {
    const distance = direction === "left" ? -1000 : 1000;
    setOffsetX(distance);
    setRotation(direction === "left" ? -45 : 45);
    setTimeout(resetPosition, 300);
  };

  const resetPosition = () => {
    setIsSwiping(false);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleIgnore = () => {
    if (onUserAction && !isLoading) {
      onUserAction("ignored", user._id);
    }
  };

  const handleInterested = () => {
    if (onUserAction && !isLoading) {
      onUserAction("interested", user._id);
    }
  };

  const getOpacity = () => {
    if (!isSwiping) return 1;
    const absOffset = Math.abs(offsetX);
    return Math.max(1 - absOffset / 300, 0.3);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Swipe indicators - only visible on mobile during swipe */}
      {isSwiping && offsetX < -50 && (
        <div className="absolute top-8 right-8 z-10 rotate-12 md:hidden">
          <div className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold text-2xl border-4 border-red-600">
            IGNORE
          </div>
        </div>
      )}
      {isSwiping && offsetX > 50 && (
        <div className="absolute top-8 left-8 z-10 -rotate-12 md:hidden">
          <div className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-2xl border-4 border-green-600">
            LIKE
          </div>
        </div>
      )}

      {/* Card */}
      <div
        className="card bg-base-300 w-full shadow-lg border-2 touch-none select-none md:touch-auto md:select-auto"
        style={{
          transform: `translateX(${offsetX}px) translateY(${
            offsetY * 0.3
          }px) rotate(${rotation}deg)`,
          opacity: getOpacity(),
          transition: isSwiping ? "none" : "all 0.3s ease-out",
          cursor: isSwiping ? "grabbing" : "default",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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

      {/* Mobile instruction text */}
      <p className="md:hidden text-center text-gray-600 mt-4 text-sm">
        👈 Swipe left to ignore • Swipe right to like 👉
      </p>
    </div>
  );
};

// Demo component
export default function App() {
  const [users, setUsers] = useState([
    {
      _id: "1",
      firstName: "Sarah Johnson",
      age: 28,
      photoUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      about: "Love hiking, coffee, and good conversations!",
    },
    {
      _id: "2",
      firstName: "Mike Chen",
      age: 32,
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      about: "Software engineer by day, chef by night.",
    },
    {
      _id: "3",
      firstName: "Emma Davis",
      age: 26,
      photoUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      about: "Artist and yoga enthusiast.",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserAction = (action, userId) => {
    console.log(`${action}: ${userId}`);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentIndex((prev) => (prev + 1) % users.length);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <UserCard
        user={users[currentIndex]}
        onUserAction={handleUserAction}
        isLoading={isLoading}
      />
    </div>
  );
}
