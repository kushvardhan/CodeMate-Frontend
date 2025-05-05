import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { removeRequest } from "../slice/RequestSlice";
import "./ui/EnhancedUserInfo.css";
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
      <div
        className={`user-info-page ${darkMode ? "dark-mode" : "light-mode"}`}
      >
        <div className="background-pattern"></div>
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
            className="theme-toggle"
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
          <motion.div
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
            <motion.p
              className="loading-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Loading user information...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`user-info-page ${darkMode ? "dark-mode" : "light-mode"}`}
      >
        <div className="background-pattern"></div>
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
            className="theme-toggle"
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
          <motion.div
            className="error-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </motion.svg>
            <motion.h2
              className="error-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Error Loading User
            </motion.h2>
            <motion.p
              className="error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {error}
            </motion.p>
            <motion.button
              className="error-button"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Go Back
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Code symbols for background
  const codeSymbols = [
    { symbol: "</>", x: "10%", y: "20%", size: "2rem", rotation: -15 },
    { symbol: "{ }", x: "85%", y: "15%", size: "2.5rem", rotation: 10 },
    { symbol: "[]", x: "75%", y: "75%", size: "2rem", rotation: -5 },
    { symbol: "=>", x: "15%", y: "85%", size: "2.2rem", rotation: 15 },
    { symbol: "&&", x: "50%", y: "90%", size: "1.8rem", rotation: -10 },
    { symbol: "function()", x: "20%", y: "40%", size: "2rem", rotation: 5 },
    { symbol: "const", x: "80%", y: "35%", size: "1.7rem", rotation: -8 },
    { symbol: "return", x: "40%", y: "15%", size: "1.9rem", rotation: 12 },
    { symbol: "import", x: "65%", y: "60%", size: "1.8rem", rotation: 8 },
    { symbol: "export", x: "25%", y: "55%", size: "1.7rem", rotation: -12 },
    { symbol: "async", x: "70%", y: "25%", size: "1.9rem", rotation: 7 },
    { symbol: "await", x: "30%", y: "70%", size: "1.8rem", rotation: -7 },
  ];

  // User info display
  return (
    <div className={`user-info-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      <AnimatePresence>
        {popup.isVisible && (
          <SuccessPopup
            message={popup.message}
            onClose={() =>
              setPopup({ isVisible: false, message: "", color: "" })
            }
            color={popup.color}
          />
        )}
      </AnimatePresence>

      {/* Background pattern */}
      <div className="background-pattern"></div>

      {/* Floating code symbols */}
      <div className="floating-symbols">
        {codeSymbols.map((symbol, index) => (
          <motion.div
            key={index}
            className="symbol"
            style={{
              left: symbol.x,
              top: symbol.y,
              fontSize: symbol.size,
              transform: `rotate(${symbol.rotation}deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 0.1,
              scale: 1,
              rotate: [
                symbol.rotation,
                symbol.rotation + 5,
                symbol.rotation - 5,
                symbol.rotation,
              ],
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              rotate: {
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            }}
          >
            {symbol.symbol}
          </motion.div>
        ))}
      </div>
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
        <motion.div className="user-info-card" variants={itemVariants}>
          <motion.div className="user-info-header" variants={itemVariants}>
            <motion.div
              className="user-info-image-container"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={user?.profilePicture || "/default-avatar.png"}
                alt={`${user?.firstName || "Unknown"} ${
                  user?.lastName || "User"
                }`}
                className="user-info-image"
              />
            </motion.div>
            <h1 className="user-info-name">
              {`${user?.firstName || "Unknown"} ${user?.lastName || "User"}`}
            </h1>
            <div className="user-info-meta">
              {user?.age && (
                <span className="user-info-age">
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
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {user.age} years
                </span>
              )}
              {user?.gender && (
                <span className="user-info-gender">
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                  {user.gender}
                </span>
              )}
              {user?.address && (
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
                  {user.address}
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
                  <motion.span
                    className="user-info-skill-tag"
                    key={index}
                    whileHover={{ y: -5, scale: 1.05 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div className="user-info-actions" variants={itemVariants}>
            {fromConnection && (
              <motion.button
                className="user-info-action-button message"
                onClick={handleMessage}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                title="Message this user"
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
                <span className="button-text">Message</span>
              </motion.button>
            )}

            {fromRequest && (
              <>
                <motion.button
                  className="user-info-action-button accept"
                  onClick={handleAcceptRequest}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  title="Accept request"
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
                  <span className="button-text">Accept</span>
                </motion.button>
                <motion.button
                  className="user-info-action-button reject"
                  onClick={handleRejectRequest}
                  whileHover={{ scale: 1.05, y: -3 }}
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
                  <span className="button-text">Reject</span>
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserInfo;
