import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  // Login fields
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  // Signup fields
  const [firstName, setFirstName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "/api/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!firstName || !signupEmail || !signupPassword) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "/api/signup",
        { firstName, emailId: signupEmail, password: signupPassword },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    if (isSignup) {
      setFirstName("");
      setSignupEmail("");
      setSignupPassword("");
    }
  };

  const currentFormFields = isSignup ? (
    // Signup Form
    <>
      <div className="auth-form-group">
        <label className="auth-label">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="auth-input"
        />
      </div>
      <div className="auth-form-group">
        <label className="auth-label">Email ID</label>
        <input
          type="email"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          placeholder="Enter your email"
          className="auth-input"
        />
      </div>
      <div className="auth-form-group">
        <label className="auth-label">Password</label>
        <input
          type="password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          placeholder="Create a password"
          className="auth-input"
        />
      </div>
    </>
  ) : (
    // Login Form
    <>
      <div className="auth-form-group">
        <label className="auth-label">Email ID</label>
        <input
          type="email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          placeholder="Enter your email"
          className="auth-input"
        />
      </div>
      <div className="auth-form-group">
        <label className="auth-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="auth-input"
        />
      </div>
    </>
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {currentFormFields}

        <div className="auth-actions">
          {error && <p className="auth-error">{error}</p>}
          <button
            className="auth-button"
            onClick={isSignup ? handleSignup : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : isSignup ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </button>
        </div>

        <div className="auth-toggle">
          <p>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <span className="auth-toggle-link" onClick={toggleMode}>
              {isSignup ? "Login" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
