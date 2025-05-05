import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBirthdayCake,
  FaEnvelope,
  FaMapMarkerAlt,
  FaVenusMars,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { removeRequest } from "../slice/RequestSlice";
import SuccessPopup from "./ui/SuccessPopup";

const UserInfoGlassmorphism = () => {
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
    color: "green",
  });

  // Get state from location
  const { fromConnection, fromRequest, requestId } = location.state || {};

  // Floating code symbols for background
  const codeSymbols = [
    {
      symbol: "</>",
      x: "10%",
      y: "20%",
      size: "3rem",
      color: "var(--color-primary)",
      rotation: -15,
    },
    {
      symbol: "{ }",
      x: "85%",
      y: "15%",
      size: "2.5rem",
      color: "var(--color-accent)",
      rotation: 10,
    },
    {
      symbol: "[]",
      x: "75%",
      y: "75%",
      size: "2rem",
      color: "var(--color-primary-light)",
      rotation: -5,
    },
    {
      symbol: "=>",
      x: "15%",
      y: "85%",
      size: "2.2rem",
      color: "var(--color-accent-light)",
      rotation: 15,
    },
    {
      symbol: "&&",
      x: "50%",
      y: "90%",
      size: "1.8rem",
      color: "var(--color-primary)",
      rotation: -10,
    },
  ];

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

  const handleMessageUser = () => {
    // Placeholder for message functionality
    setPopup({
      isVisible: true,
      message: `Opening chat with ${user?.firstName || "this user"}.`,
      color: "blue",
    });

    // Navigate to messages page (to be implemented)
    setTimeout(() => {
      navigate("/messages");
    }, 2000);
  };

  const handleGoBack = () => {
    if (fromConnection) {
      navigate("/connections");
    } else if (fromRequest) {
      navigate("/requests");
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="loading-spinner"
        />
        <p
          className={`ml-4 text-lg ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-500 text-5xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
            </svg>
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Error Loading Profile
          </h2>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {error}
          </p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2
            className={`text-2xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            User Not Found
          </h2>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            The user you're looking for could not be found.
          </p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Floating code symbols */}
      {codeSymbols.map((symbol, index) => (
        <motion.div
          key={index}
          className="absolute opacity-20 pointer-events-none"
          style={{
            left: symbol.x,
            top: symbol.y,
            fontSize: symbol.size,
            color: symbol.color,
            transform: `rotate(${symbol.rotation}deg)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.2,
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

      {/* Top navigation */}
      <div className="profile-top-nav">
        <button onClick={handleGoBack} className="back-button">
          <FaArrowLeft /> Back
        </button>
        <button
          onClick={toggleDarkMode}
          className={`theme-toggle ${darkMode ? "dark" : ""}`}
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
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
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

      <div className="container mx-auto px-4 py-12">
        <motion.div
          className={`max-w-lg mx-auto rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-gray-800/40 backdrop-blur-lg border border-gray-700/50"
              : "bg-white/40 backdrop-blur-lg border border-gray-200/50"
          } shadow-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile header with image */}
          <div
            className={`relative h-40 ${
              darkMode
                ? "bg-gradient-to-r from-indigo-900/40 to-purple-900/40"
                : "bg-gradient-to-r from-indigo-500/40 to-purple-500/40"
            }`}
          >
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 -bottom-16"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* User info */}
          <div className="pt-20 pb-8 px-8">
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {user.firstName} {user.lastName}
              </h1>
              <p
                className={`mt-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <FaEnvelope className="inline mr-2" />
                {user.email}
              </p>
            </motion.div>

            <motion.div
              className={`flex justify-center gap-4 mb-6 text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {user.age && (
                <div className="flex items-center">
                  <FaBirthdayCake className="mr-1" />
                  <span>{user.age} years</span>
                </div>
              )}
              {user.gender && (
                <div className="flex items-center">
                  <FaVenusMars className="mr-1" />
                  <span>{user.gender}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{user.address}</span>
                </div>
              )}
            </motion.div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                About
              </h2>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {user.about || "No information provided."}
              </p>
            </motion.div>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h2
                className={`text-lg font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode
                          ? "bg-indigo-900/50 text-indigo-200 border border-indigo-700/50"
                          : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                    >
                      {skill}
                    </motion.span>
                  ))
                ) : (
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No skills listed.
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {fromConnection && (
                <button
                  onClick={handleMessageUser}
                  className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  Message
                </button>
              )}

              {fromRequest && (
                <>
                  <button
                    onClick={handleAcceptRequest}
                    className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleRejectRequest}
                    className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {popup.isVisible && (
          <SuccessPopup
            message={popup.message}
            onClose={() => setPopup({ ...popup, isVisible: false })}
            color={popup.color}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserInfoGlassmorphism;
