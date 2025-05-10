import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { removeRequest } from "../slice/RequestSlice";
import DefaultAvatar from "./ui/DefaultAvatar";
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

  // This function is no longer needed as the Link component handles navigation
  const handleMessage = () => {
    // Navigation to chat is handled by the Link component
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

  // Code symbols with different colors - evenly distributed across the screen
  const codeSymbols = [
    // Purple family
    {
      symbol: "</>",
      x: "5%",
      y: "5%",
      size: "2rem",
      rotation: -15,
      lightColor: "#7c3aed",
      darkColor: "#b4a7ea", // Slightly more muted in dark mode
    }, // Violet

    // Blue family
    {
      symbol: "{ }",
      x: "25%",
      y: "8%",
      size: "2.2rem",
      rotation: 10,
      lightColor: "#3b82f6",
      darkColor: "#8ab0e0", // Slightly more muted in dark mode
    }, // Blue

    // Teal/Cyan family
    {
      symbol: "function()",
      x: "45%",
      y: "12%",
      size: "1.8rem",
      rotation: 5,
      lightColor: "#0ea5e9",
      darkColor: "#92d8e0", // Slightly more muted in dark mode
    }, // Sky blue

    // Green family
    {
      symbol: "import",
      x: "75%",
      y: "5%",
      size: "1.7rem",
      rotation: 8,
      lightColor: "#10b981",
      darkColor: "#94d3b8", // Slightly more muted in dark mode
    }, // Emerald

    // Yellow/Orange family
    {
      symbol: "[]",
      x: "92%",
      y: "10%",
      size: "2rem",
      rotation: -5,
      lightColor: "#f59e0b",
      darkColor: "#d9b84d", // Slightly more muted in dark mode
    }, // Amber

    // Middle-left area
    {
      symbol: "=>",
      x: "8%",
      y: "30%",
      size: "1.9rem",
      rotation: 15,
      lightColor: "#ec4899",
      darkColor: "#fbcfe8",
    }, // Pink

    {
      symbol: "const",
      x: "15%",
      y: "45%",
      size: "1.7rem",
      rotation: -8,
      lightColor: "#8b5cf6",
      darkColor: "#ddd6fe",
    }, // Purple

    // Middle-right area
    {
      symbol: "export",
      x: "85%",
      y: "35%",
      size: "1.6rem",
      rotation: -12,
      lightColor: "#06b6d4",
      darkColor: "#cffafe",
    }, // Cyan

    {
      symbol: "&&",
      x: "92%",
      y: "50%",
      size: "1.8rem",
      rotation: -10,
      lightColor: "#14b8a6",
      darkColor: "#99f6e4",
    }, // Teal

    // Center area (positioned to not be hidden by the card)
    {
      symbol: "let",
      x: "30%",
      y: "30%",
      size: "1.6rem",
      rotation: 9,
      lightColor: "#6366f1",
      darkColor: "#c7d2fe",
    }, // Indigo

    {
      symbol: "var",
      x: "70%",
      y: "70%",
      size: "1.7rem",
      rotation: -7,
      lightColor: "#0284c7",
      darkColor: "#bae6fd",
    }, // Light Blue

    // Bottom area
    {
      symbol: "return",
      x: "10%",
      y: "85%",
      size: "1.8rem",
      rotation: 12,
      lightColor: "#2563eb",
      darkColor: "#bfdbfe",
    }, // Blue

    {
      symbol: "await",
      x: "30%",
      y: "92%",
      size: "1.7rem",
      rotation: -7,
      lightColor: "#7c3aed",
      darkColor: "#c4b5fd",
    }, // Violet

    {
      symbol: "async",
      x: "55%",
      y: "88%",
      size: "1.9rem",
      rotation: 7,
      lightColor: "#0d9488",
      darkColor: "#99f6e4",
    }, // Teal

    {
      symbol: "class",
      x: "75%",
      y: "80%",
      size: "1.8rem",
      rotation: -5,
      lightColor: "#4f46e5",
      darkColor: "#c7d2fe",
    }, // Indigo

    {
      symbol: "this",
      x: "90%",
      y: "90%",
      size: "1.7rem",
      rotation: 10,
      lightColor: "#db2777",
      darkColor: "#fbcfe8",
    }, // Pink
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
              color: darkMode ? symbol.darkColor : symbol.lightColor,
              textShadow: darkMode
                ? `0 0 5px ${symbol.darkColor}` // Reduced glow in dark mode
                : `0 0 8px ${symbol.lightColor}`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: darkMode ? 0.2 : 0.35, // Even less prominent in dark mode
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
          title="Go back to previous page"
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
          <span className="button-text">Back</span>
        </button>
        <button
          onClick={toggleDarkMode}
          className="theme-toggle"
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
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={`${user?.firstName || "Unknown"} ${
                    user?.lastName || "User"
                  }`}
                  className="user-info-image"
                />
              ) : (
                <div className="user-info-image">
                  <DefaultAvatar />
                </div>
              )}
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
                    whileHover={{ y: -2, scale: 1.02 }}
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
              <div
                className="message-button-container"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Link
                  to={`/chat/${user._id}`}
                  style={{ display: "block", width: "100%", maxWidth: "200px" }}
                >
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
                </Link>
              </div>
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
                  title="Reject request"
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
