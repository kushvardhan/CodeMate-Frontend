import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaVenusMars, 
  FaBirthdayCake, 
  FaEnvelope, 
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaCode
} from "react-icons/fa";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { addConnection, removeRequest } from "../slice/RequestSlice";
import SuccessPopup from "./ui/SuccessPopup";

const UserInfoHero = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({ isVisible: false, message: "", color: "green" });
  const [expandedBio, setExpandedBio] = useState(false);

  // Get state from location
  const { fromConnection, fromRequest, requestId } = location.state || {};

  // Hero background patterns
  const heroPatterns = {
    light: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    dark: "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
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
          const connectionsResponse = await axios.get("/user/request/connections", {
            withCredentials: true,
          });
          
          if (connectionsResponse.data && connectionsResponse.data.data) {
            const foundUser = connectionsResponse.data.data.find(
              connection => connection._id === userId
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
              request => request.fromUserId._id === userId
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
        
        if (profileResponse.data && profileResponse.data.data && profileResponse.data.data._id === userId) {
          setUser(profileResponse.data.data);
        } else {
          setError("User information not found. The user may not be in your connections or requests.");
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
        message: "Request ID not found. Please try again from the requests page.",
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
        message: "Request ID not found. Please try again from the requests page.",
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
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="loading-spinner"
        />
        <p className={`ml-4 text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Error Loading Profile</h2>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
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
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>User Not Found</h2>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>The user you're looking for could not be found.</p>
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

  // Mock social links (would be replaced with real data)
  const socialLinks = [
    { icon: <FaGithub />, url: "#", label: "GitHub" },
    { icon: <FaLinkedin />, url: "#", label: "LinkedIn" },
    { icon: <FaTwitter />, url: "#", label: "Twitter" },
    { icon: <FaGlobe />, url: "#", label: "Website" }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Top navigation */}
      <div className="profile-top-nav">
        <button onClick={handleGoBack} className="back-button">
          <FaArrowLeft /> Back
        </button>
        <button onClick={toggleDarkMode} className={`theme-toggle ${darkMode ? "dark" : ""}`}>
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Hero header */}
      <motion.div 
        className="relative w-full h-64 md:h-80 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background pattern with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${darkMode ? heroPatterns.dark : heroPatterns.light})`,
            backgroundSize: '200px'
          }}
        />
        <div className={`absolute inset-0 ${
          darkMode 
            ? "bg-gradient-to-b from-indigo-900/80 to-purple-900/80" 
            : "bg-gradient-to-b from-indigo-500/80 to-purple-500/80"
        }`} />
        
        {/* Parallax effect on scroll */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          style={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center text-white">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Developer Profile
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl opacity-90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Connect, collaborate, and code together
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Profile content */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Profile card */}
        <motion.div 
          className={`max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Profile header with image */}
          <div className="relative pt-16 pb-8 px-6 text-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-20">
              <motion.div 
                className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <img 
                  src={user.profilePicture || "https://via.placeholder.com/150"} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
            <motion.h1 
              className={`text-3xl font-bold mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {user.firstName} {user.lastName}
            </motion.h1>
            
            <motion.div 
              className="flex items-center justify-center mt-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <FaEnvelope className={`mr-2 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{user.email}</p>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center mt-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              {user.address && (
                <>
                  <FaMapMarkerAlt className={`mr-2 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{user.address}</p>
                </>
              )}
            </motion.div>
            
            {/* Social links */}
            <motion.div 
              className="flex justify-center mt-4 space-x-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    darkMode 
                      ? "bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                  } transition-colors`}
                  whileHover={{ y: -3 }}
                  title={link.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 + (index * 0.1), duration: 0.3 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
          
          {/* About section */}
          <motion.div 
            className={`px-6 py-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>About</h2>
            <div className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              <motion.div
                initial={{ height: "80px" }}
                animate={{ height: expandedBio ? "auto" : "80px" }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden relative"
              >
                <p>{user.about || "No information provided."}</p>
                {!expandedBio && (
                  <div className={`absolute bottom-0 left-0 right-0 h-12 ${
                    darkMode 
                      ? "bg-gradient-to-t from-gray-700 to-transparent" 
                      : "bg-gradient-to-t from-gray-50 to-transparent"
                  }`} />
                )}
              </motion.div>
              
              {(user.about && user.about.length > 150) && (
                <button
                  onClick={() => setExpandedBio(!expandedBio)}
                  className={`mt-2 text-sm font-medium ${
                    darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
                  }`}
                >
                  {expandedBio ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          </motion.div>
          
          {/* Skills section */}
          <motion.div 
            className="px-6 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Skills</h2>
            
            {user.skills && user.skills.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {user.skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    className={`flex flex-col items-center p-3 rounded-lg ${
                      darkMode 
                        ? "bg-gray-700 hover:bg-gray-600" 
                        : "bg-gray-100 hover:bg-gray-200"
                    } transition-colors`}
                    whileHover={{ y: -5, scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + (index * 0.05), duration: 0.3 }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      darkMode ? "bg-indigo-900 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                    }`}>
                      <FaCode />
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>No skills listed.</p>
            )}
          </motion.div>
          
          {/* Action buttons */}
          <motion.div 
            className={`px-6 py-6 ${darkMode ? "bg-gray-700" : "bg-gray-50"} border-t ${
              darkMode ? "border-gray-600" : "border-gray-200"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {fromConnection && (
                <motion.button
                  onClick={handleMessageUser}
                  className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaComments className="mr-2" /> Message
                </motion.button>
              )}

              {fromRequest && (
                <>
                  <motion.button
                    onClick={handleAcceptRequest}
                    className="flex-1 py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Accept Request
                  </motion.button>
                  <motion.button
                    onClick={handleRejectRequest}
                    className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reject
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
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

export default UserInfoHero;
