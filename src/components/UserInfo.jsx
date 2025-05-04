import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { removeRequest } from "../slice/RequestSlice";
import SuccessPopup from "./ui/SuccessPopup";

const UserInfo = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    color: "",
  });

  // Check if we're coming from connections or requests
  const fromConnection = location.state?.fromConnection || false;
  const fromRequest = location.state?.fromRequest || false;
  const requestId = location.state?.requestId || null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        // First try to get user from location state if available
        if (location.state?.userData) {
          setUser(location.state.userData);
          setIsLoading(false);
          return;
        }

        // If we're coming from connections, we can try to fetch from connections list
        if (fromConnection) {
          const connectionsResponse = await axios.get(
            "/user/request/connections",
            {
              withCredentials: true,
            }
          );

          if (connectionsResponse.data && connectionsResponse.data.data) {
            const foundUser = connectionsResponse.data.data.find(
              (connection) => connection._id === userId
            );

            if (foundUser) {
              setUser(foundUser);
              setIsLoading(false);
              return;
            }
          }
        }

        // If we're coming from requests, we can try to fetch from requests list
        if (fromRequest) {
          const requestsResponse = await axios.get("/user/request/received", {
            withCredentials: true,
          });

          if (requestsResponse.data && requestsResponse.data.data) {
            const foundRequest = requestsResponse.data.data.find(
              (request) => request.fromUserId._id === userId
            );

            if (foundRequest) {
              setUser(foundRequest.fromUserId);
              setIsLoading(false);
              return;
            }
          }
        }

        // If we couldn't find the user from the above methods, try to get from profile endpoint
        // This is a fallback and might not work depending on backend implementation
        const profileResponse = await axios.get("/profile", {
          withCredentials: true,
        });

        if (
          profileResponse.data &&
          profileResponse.data.data &&
          profileResponse.data.data._id === userId
        ) {
          setUser(profileResponse.data.data);
        } else {
          setError(
            "User information not found. The user may not be in your connections or requests."
          );
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to load user information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    } else {
      setError("Invalid user ID");
      setIsLoading(false);
    }
  }, [userId, fromConnection, fromRequest, location.state]);

  const handleAcceptRequest = async () => {
    if (!requestId) {
      setPopup({
        isVisible: true,
        message:
          "Request ID not found. Please try again from the requests page.",
        color: "red",
      });
      return;
    }

    try {
      const response = await axios.post(
        `/request/review/accepted/${requestId}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        // Only update the store if the API call was successful
        if (user) {
          dispatch(addConnection([user]));
          dispatch(removeRequest(requestId));
        }

        setPopup({
          isVisible: true,
          message: `You accepted ${user?.firstName || "this user"}'s request.`,
          color: "green",
        });

        // Navigate back to requests page after a delay
        setTimeout(() => {
          navigate("/requests");
        }, 2000);
      } else {
        throw new Error("Failed to accept request");
      }
    } catch (err) {
      console.error("Error accepting request:", err);
      setPopup({
        isVisible: true,
        message: "Failed to accept request. Please try again.",
        color: "red",
      });
    }
  };

  const handleRejectRequest = async () => {
    if (!requestId) {
      setPopup({
        isVisible: true,
        message:
          "Request ID not found. Please try again from the requests page.",
        color: "red",
      });
      return;
    }

    try {
      const response = await axios.post(
        `/request/review/rejected/${requestId}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        // Only update the store if the API call was successful
        dispatch(removeRequest(requestId));

        setPopup({
          isVisible: true,
          message: `You rejected ${user?.firstName || "this user"}'s request.`,
          color: "red",
        });

        // Navigate back to requests page after a delay
        setTimeout(() => {
          navigate("/requests");
        }, 2000);
      } else {
        throw new Error("Failed to reject request");
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      setPopup({
        isVisible: true,
        message: "Failed to reject request. Please try again.",
        color: "red",
      });
    }
  };

  const handleMessage = () => {
    setPopup({
      isVisible: true,
      message: "Messaging feature coming soon!",
      color: "blue",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`user-info-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="profile-top-nav">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className={`theme-toggle ${darkMode ? "dark" : "light"}`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>
        <div className="user-info-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`user-info-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="profile-top-nav">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className={`theme-toggle ${darkMode ? "dark" : "light"}`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>
        <div className="user-info-container">
          <div className="error-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2 className="error-title">Error Loading User</h2>
            <p className="error-message">{error}</p>
            <motion.button
              className="error-button"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // User info display
  return (
    <div className={`user-info-page ${darkMode ? "dark-mode" : ""}`}>
      <SuccessPopup
        isVisible={popup.isVisible}
        message={popup.message}
        onClose={() => setPopup({ isVisible: false, message: "", color: "" })}
        color={popup.color}
      />
      <div className="profile-top-nav">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <button
          onClick={toggleDarkMode}
          className={`theme-toggle ${darkMode ? "dark" : "light"}`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

      <motion.div
        className="user-info-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="user-info-header" variants={itemVariants}>
          <div className="user-info-image-container">
            <img
              src={user?.photoUrl || "/default-avatar.png"}
              alt={`${user?.firstName || "Unknown"} ${
                user?.lastName || "User"
              }`}
              className="user-info-image"
            />
          </div>
          <h1 className="user-info-name">
            {`${user?.firstName || "Unknown"} ${user?.lastName || "User"}`}
          </h1>
          <div className="user-info-meta">
            {user?.age && (
              <span className="user-info-age">{user.age} years</span>
            )}
            {user?.gender && (
              <span className="user-info-gender">{user.gender}</span>
            )}
            {user?.location && (
              <span className="user-info-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {user.location}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div className="user-info-section" variants={itemVariants}>
          <h2 className="user-info-section-title">About</h2>
          <p className="user-info-about">
            {user?.about || "No information provided."}
          </p>
        </motion.div>

        {user?.skills && user.skills.length > 0 && (
          <motion.div className="user-info-section" variants={itemVariants}>
            <h2 className="user-info-section-title">Skills</h2>
            <div className="user-info-skills">
              {user.skills.map((skill, index) => (
                <span className="user-info-skill-tag" key={index}>
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div className="user-info-actions" variants={itemVariants}>
          {fromConnection && (
            <motion.button
              className="user-info-action-button message"
              onClick={handleMessage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Message</span>
            </motion.button>
          )}

          {fromRequest && (
            <>
              <motion.button
                className="user-info-action-button accept"
                onClick={handleAcceptRequest}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Accept</span>
              </motion.button>
              <motion.button
                className="user-info-action-button reject"
                onClick={handleRejectRequest}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>Reject</span>
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserInfo;
