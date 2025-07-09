import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // Import the custom axios instance with correct baseURL
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { addRequest, removeRequest } from "../slice/RequestSlice";
import SuccessPopup from "./ui/SuccessPopup";

const Request = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const requests = useSelector((store) => store.request);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(true);

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

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const fetchRequest = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/user/request/received", {
          withCredentials: true,
        });
        console.log("Request:", response.data.data);
        dispatch(addRequest(response.data.data)); 
      } catch (error) {
        console.error("Error fetching requests:", error);
        dispatch(addRequest([])); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [dispatch, navigate]);

  const handleRequestAction = async (status, request) => {
    try {
      const response = await axios.post(
        `/request/review/${status === "accepted" ? "accepted" : "rejected"}/${
          request._id
        }`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        if (status === "accepted") {
          dispatch(addConnection([request.fromUserId])); // Ensure it's an array
          setPopup({
            isVisible: true,
            message: `You accepted ${request.fromUserId?.firstName}'s request.`,
            color: "green",
          });
        } else if (status === "rejected") {
          setPopup({
            isVisible: true,
            message: `You rejected ${request.fromUserId?.firstName}'s request.`,
            color: "red",
          });
        }

        dispatch(removeRequest(request._id));
      }
    } catch (err) {
      console.error("Error handling request action:", err);
      setPopup({
        isVisible: true,
        message: `Failed to ${
          status === "accepted" ? "accept" : "reject"
        } request. Please try again.`,
        color: "red",
      });
    }
  };

  const getGenderSymbol = (gender) => {
    if (!gender) {
      return <span className="info-icon bold-light"></span>; // Default symbol for undefined gender
    }
    if (gender.toLowerCase() === "male") {
      return <span className="info-icon bold-light">♂</span>;
    } else if (gender.toLowerCase() === "female") {
      return <span className="info-icon bold-light">♀</span>;
    } else {
      return <span className="info-icon bold-light">⚧</span>; // Gender-neutral symbol
    }
  };

const truncateText = (bio) => {
  if (!bio) return "";

  if (bio.length <= 50) return bio;

  return bio.slice(0, 50) + "...";
};


  // Loading state
  if (isLoading) {
    return (
      <div className={`request-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="profile-top-nav">
          <button
            onClick={() => navigate("/")}
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
            <span>Home</span>
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
        <div className="request-container">
          <h1 className="request-title">Requests</h1>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!requests || requests.length === 0) {
    return (
      <div className={`request-page ${darkMode ? "dark-mode" : ""}`}>
        <div className="profile-top-nav">
          <button
            onClick={() => navigate("/")}
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
            <span>Home</span>
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
        <motion.div
          className="request-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="request-title" variants={itemVariants}>
            Requests
          </motion.h1>
          <motion.div
            className="empty-state-container"
            variants={emptyStateVariants}
          >
            <div className="empty-state-icon">
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <line x1="17" y1="8" x2="22" y2="13"></line>
                <line x1="17" y1="13" x2="22" y2="8"></line>
              </svg>
            </div>
            <h2 className="empty-state-title">No Connection Requests</h2>
            <p className="empty-state-message">
              You don't have any connection requests at the moment. When
              developers send you requests, they'll appear here.
            </p>
            <motion.button
              className="empty-state-button"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Discover Developers
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Requests list
  return (
    <div className={`request-page ${darkMode ? "dark-mode" : ""}`}>
      <SuccessPopup
        isVisible={popup.isVisible}
        message={popup.message}
        onClose={() => setPopup({ isVisible: false, message: "", color: "" })}
        color={popup.color}
      />
      <div className="profile-top-nav">
        <button
          onClick={() => navigate("/")}
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
          <span>Home</span>
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
        className="request-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="request-title" variants={itemVariants}>
          Connection Requests
        </motion.h1>
        <motion.p className="request-subtitle" variants={itemVariants}>
          Developers who want to connect with you
        </motion.p>

        <motion.div
          className="request-cards-container"
          variants={containerVariants}
        >
          {requests.map((req, index) => (
            <motion.div
              className="request-card"
              key={req._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="request-card-left">
                <div className="request-card-image-container">
                  <img
                    src={req?.fromUserId?.photoUrl || "/default-avatar.png"} 
                    alt={`${req?.fromUserId?.firstName || "Unknown"} ${
                      req.fromUserId?.lastName || ""
                    }`}
                    className="request-card-image"
                  />
                  <div className="request-card-status">
                    <span className="status-dot"></span>
                    <span className="status-text">Wants to connect</span>
                  </div>
                </div>
              </div>

              <div className="request-card-content">
                <div className="request-card-header">
                  <h2 className="request-card-name">{`${
                    req.fromUserId?.firstName || "Unknown"
                  } ${req.fromUserId?.lastName || "User"}`}</h2>

                  <div className="request-card-meta">
                    {req.fromUserId?.age && (
                      <span className="request-card-age">
                        {req.fromUserId?.age} years
                      </span>
                    )}
                    {req.fromUserId?.gender && (
                      <span className="request-card-gender">
                        {getGenderSymbol(req.fromUserId?.gender)}
                        {req.fromUserId?.gender}
                      </span>
                    )}
                  </div>
                </div>

                {req.fromUserId?.about && (
                  <p className="request-card-about">
                    {truncateText(req.fromUserId?.about)}
                  </p>
                )}

                {req.fromUserId?.skills && req.fromUserId?.skills.length > 0 && (
                  <div className="request-card-skills">
                    {req.fromUserId?.skills?.slice(0, 2).map((skill, index) => (
                      <span className="request-skill-tag" key={index}>
                        {skill}
                      </span>
                    ))}
                    {req.fromUserId?.skills?.length > 2 && (
                      <span className="request-skill-more">
                        +{req.fromUserId?.skills?.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="request-card-actions">
                <motion.button
                  className="request-action-button view-profile"
                  onClick={() =>
                    navigate(`/user/info/${req.fromUserId._id}`, {
                      state: {
                        fromRequest: true,
                        requestId: req._id,
                        userData: req.fromUserId,
                      },
                    })
                  }
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View Profile</span>
                </motion.button>
                <div className="request-quick-actions">
                  <motion.button
                    className="request-action-button accept"
                    onClick={() => handleRequestAction("accepted", req)}
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
                    className="request-action-button reject"
                    onClick={() => handleRequestAction("rejected", req)}
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
                    <span>Decline</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Request;
