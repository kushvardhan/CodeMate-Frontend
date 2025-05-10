import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";

const Connection = () => {
  const connections = useSelector((store) => store.connection || []);
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
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

  const fetchConnection = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/user/request/connections", {
        withCredentials: true,
      });
      console.log("API response:", response.data.data);
      console.log("Current state:", JSON.stringify(connections));
      dispatch(addConnection(response.data.data)); // Replace the state with the new data
    } catch (error) {
      console.error("Error fetching connections:", error);
      dispatch(addConnection([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

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

  const truncateText = (text, wordLimit = 10) => {
    if (!text) return ""; // Return an empty string if text is undefined or null
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`connection-page ${darkMode ? "dark-mode" : ""}`}>
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
        <div className="connection-container">
          <h1 className="connection-title">Connections</h1>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading connections...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!connections || connections.length === 0) {
    return (
      <div className={`connection-page ${darkMode ? "dark-mode" : ""}`}>
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
          className="connection-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="connection-title" variants={itemVariants}>
            Connections
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
              </svg>
            </div>
            <h2 className="empty-state-title">No Connections Yet</h2>
            <p className="empty-state-message">
              You haven't connected with any developers yet. Start swiping to
              find and connect with developers who share your interests.
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

  // Connections list
  return (
    <div className={`connection-page ${darkMode ? "dark-mode" : ""}`}>
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
        className="connection-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="connection-title" variants={itemVariants}>
          Your Connections
        </motion.h1>
        <motion.p className="connection-subtitle" variants={itemVariants}>
          Developers you've connected with
        </motion.p>

        <motion.div className="connection-grid" variants={containerVariants}>
          {connections.map((connection, index) => (
            <motion.div
              className="connection-card"
              key={connection._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              onClick={() => {
                // Only navigate on mobile devices
                if (window.innerWidth <= 480) {
                  navigate(`/user/info/${connection._id}`, {
                    state: {
                      fromConnection: true,
                      userData: connection,
                    },
                  });
                }
              }}
            >
              <div className="connection-card-header">
                <div className="connection-card-image-container">
                  <img
                    src={connection.photoUrl || "/default-avatar.png"}
                    alt={`${connection.firstName || "Unknown"} ${
                      connection.lastName || "User"
                    }`}
                    className="connection-card-image"
                  />
                  <div className="connection-card-badge">
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
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                    <span>Connected</span>
                  </div>
                </div>
              </div>

              <div className="connection-card-content">
                <h2 className="connection-card-name">{`${
                  connection.firstName || "Unknown"
                } ${connection.lastName || "User"}`}</h2>

                <div className="connection-card-meta">
                  {connection.age && (
                    <span className="connection-card-age">
                      {connection.age} years
                    </span>
                  )}
                  {connection.gender && (
                    <span className="connection-card-gender">
                      {getGenderSymbol(connection.gender)}
                      {connection.gender}
                    </span>
                  )}
                </div>

                {connection.about && (
                  <p className="connection-card-about">
                    {truncateText(connection.about, 10)}
                  </p>
                )}

                {connection.skills && connection.skills.length > 0 && (
                  <div className="connection-card-skills">
                    {connection.skills.slice(0, 2).map((skill, index) => (
                      <span className="connection-skill-tag" key={index}>
                        {skill}
                      </span>
                    ))}
                    {connection.skills.length > 2 && (
                      <span className="connection-skill-more">
                        +{connection.skills.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="connection-card-footer">
                <Link to={`/chat/${connection._id}`} style={{ flex: 1 }}>
                  <motion.button
                    className="connection-action-button message"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      alert("Messaging feature coming soon!");
                    }}
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
                </Link>

                <motion.button
                  className="connection-action-button profile"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    navigate(`/user/info/${connection._id}`, {
                      state: {
                        fromConnection: true,
                        userData: connection,
                      },
                    });
                  }}
                  style={{ flex: 1 }}
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>View Profile</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Connection;
