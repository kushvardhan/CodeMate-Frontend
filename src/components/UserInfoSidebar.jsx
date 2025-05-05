import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBirthdayCake,
  FaCode,
  FaComments,
  FaEnvelope,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaUser,
  FaVenusMars,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection } from "../slice/ConnectionSlice";
import { removeRequest } from "../slice/RequestSlice";
import SuccessPopup from "./ui/SuccessPopup";

const UserInfoSidebar = () => {
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
  const [activeTab, setActiveTab] = useState("overview");

  // Get state from location
  const { fromConnection, fromRequest, requestId } = location.state || {};

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

  // Tab content components
  const tabContent = {
    overview: (
      <motion.div
        key="overview"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <FaUser className="inline mr-2" /> Overview
        </h2>

        <div
          className={`mb-6 p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          <div className="flex items-center mb-4">
            <FaEnvelope
              className={`mr-3 ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <div>
              <h3
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                Email
              </h3>
              <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>
                {user.email}
              </p>
            </div>
          </div>

          {user.age && (
            <div className="flex items-center mb-4">
              <FaBirthdayCake
                className={`mr-3 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <div>
                <h3
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Age
                </h3>
                <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>
                  {user.age} years
                </p>
              </div>
            </div>
          )}

          {user.gender && (
            <div className="flex items-center mb-4">
              <FaVenusMars
                className={`mr-3 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <div>
                <h3
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Gender
                </h3>
                <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>
                  {user.gender}
                </p>
              </div>
            </div>
          )}

          {user.address && (
            <div className="flex items-center">
              <FaMapMarkerAlt
                className={`mr-3 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <div>
                <h3
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Location
                </h3>
                <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>
                  {user.address}
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className={`mb-6 p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          <h3
            className={`text-lg font-medium mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            <FaInfoCircle className="inline mr-2" /> About
          </h3>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {user.about || "No information provided."}
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          {fromConnection && (
            <button
              onClick={handleMessageUser}
              className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <FaComments className="mr-2" /> Message
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
        </div>
      </motion.div>
    ),

    skills: (
      <motion.div
        key="skills"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <FaCode className="inline mr-2" /> Skills
        </h2>

        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          {user.skills && user.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className={`p-3 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 border border-gray-600"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.03, y: -2 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                  <div
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {skill}
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 60 + 40}%` }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              No skills listed.
            </p>
          )}
        </div>
      </motion.div>
    ),

    contact: (
      <motion.div
        key="contact"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <FaComments className="inline mr-2" /> Contact
        </h2>

        <div
          className={`p-6 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm text-center`}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
            <img
              src={user.profilePicture || "https://via.placeholder.com/150"}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>

          <h3
            className={`text-lg font-medium mb-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {user.firstName} {user.lastName}
          </h3>

          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {user.email}
          </p>

          {fromConnection ? (
            <button
              onClick={handleMessageUser}
              className="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <FaComments className="mr-2" /> Start Conversation
            </button>
          ) : (
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                You need to be connected with this user to start a conversation.
              </p>

              {fromRequest && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAcceptRequest}
                    className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={handleRejectRequest}
                    className="flex-1 py-2 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    ),
  };

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: <FaUser /> },
    { id: "skills", label: "Skills", icon: <FaCode /> },
    { id: "contact", label: "Contact", icon: <FaComments /> },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
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

      <div className="container mx-auto px-4 py-8">
        <div
          className={`flex flex-col md:flex-row rounded-xl overflow-hidden ${
            darkMode ? "bg-gray-800 shadow-xl" : "bg-white shadow-lg"
          }`}
        >
          {/* Sidebar */}
          <div
            className={`md:w-64 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 flex flex-col`}
          >
            {/* Profile image and name */}
            <div className="text-center mb-8">
              <motion.div
                className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-indigo-500 mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.h1
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {user.firstName} {user.lastName}
              </motion.h1>
            </div>

            {/* Navigation tabs */}
            <nav className="flex flex-col space-y-2 flex-grow">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? darkMode
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-100 text-indigo-800"
                      : darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}

                  {activeTab === tab.id && (
                    <motion.div
                      className="ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        width="6"
                        height="10"
                        viewBox="0 0 6 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 9L5 5L1 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div
            className={`flex-1 p-6 ${
              darkMode ? "bg-gray-900" : "bg-gray-50"
            } min-h-[500px]`}
          >
            <AnimatePresence mode="wait">
              {tabContent[activeTab]}
            </AnimatePresence>
          </div>
        </div>
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

export default UserInfoSidebar;
