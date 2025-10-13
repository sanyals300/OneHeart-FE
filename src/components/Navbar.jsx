import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import axios from "axios";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="glass-navbar">
      <Link to="/" className="navbar-brand relative z-50">
        OneHeart
      </Link>

      {user && (
        <div className="navbar-user-section" ref={dropdownRef}>
          <p className="navbar-welcome">Welcome, {user.firstName}</p>
          <div
            className="navbar-avatar"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img alt="User Avatar" src={user.photoUrl} />
          </div>

          <ul className={`navbar-dropdown ${isDropdownOpen ? "open" : ""}`}>
            <li className="dropdown-item">
              <Link to="/profile">
                Profile <span className="dropdown-badge">New</span>
              </Link>
            </li>
            <li className="dropdown-item">
              <Link to="/connections">Connections</Link>
            </li>
            <li className="dropdown-item">
              <Link to="/requests">Requests</Link>
            </li>
            <li className="dropdown-item">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
