import React from "react";
import { useState } from "react";
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
        "http://localhost:3000/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res.data));
      return navigate("/");
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
        "http://localhost:3000/signup",
        {
          firstName,
          emailId: signupEmail,
          password: signupPassword,
        },
        {
          withCredentials: true,
        }
      );

      // After successful signup, navigate to profile page to complete details
      dispatch(addUser(res.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    // Clear signup fields when switching to login
    if (isSignup) {
      setFirstName("");
      setSignupEmail("");
      setSignupPassword("");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-sm border-2 my-2">
        <div className="card-body">
          <h2 className="card-title">{isSignup ? "Sign Up" : "Login"}</h2>

          {isSignup ? (
            // Signup Form
            <>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="input border-2 shadow-sm bg-base-300 my-0.5"
                  />
                </fieldset>
              </div>

              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email ID</legend>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input border-2 shadow-sm bg-base-300 my-0.5"
                  />
                </fieldset>
              </div>

              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Password</legend>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="input border-2 shadow-sm bg-base-300 my-0.5"
                  />
                </fieldset>
              </div>
            </>
          ) : (
            // Login Form
            <>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email ID</legend>
                  <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="Type here"
                    className="input border-2 shadow-sm bg-base-300 my-0.5"
                  />
                </fieldset>
              </div>

              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Password</legend>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type here"
                    className="input border-2 shadow-sm bg-base-300 my-0.5"
                  />
                </fieldset>
              </div>
            </>
          )}

          <div className="card-actions justify-end">
            {error && <p className="text-red-600">{error}</p>}
            <button
              className="btn btn-primary"
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : isSignup ? (
                "Sign Up"
              ) : (
                "Login"
              )}
            </button>
          </div>

          {/* Toggle between login and signup */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {isSignup
                ? "Already have an account? "
                : "Don't have an account? "}
              <span
                className="text-primary cursor-pointer hover:underline font-semibold"
                onClick={toggleMode}
              >
                {isSignup ? "Login here" : "Sign up here"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
