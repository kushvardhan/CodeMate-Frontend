import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const UserInfoSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const { darkMode } = useTheme();
  
  // Get the state from location
  const { fromConnection, fromRequest, requestId, userData } = location.state || {};

  const designs = [
    {
      id: "glassmorphism",
      name: "Glassmorphism Profile Card",
      description: "Modern, elegant profile with frosted glass effect and visual appeal",
      sources: ["WIRED"],
      image: "https://i.imgur.com/JKLUeHh.png"
    },
    {
      id: "sidebar",
      name: "Sidebar Layout with Animated Tabs",
      description: "Organized user information with distinct, navigable sections",
      sources: ["Reddit", "Dribbble", "Pinterest"],
      image: "https://i.imgur.com/R8PQO5L.png"
    },
    {
      id: "hero",
      name: "Full-Width Hero Profile",
      description: "Visually engaging profile with strong personal brand presence",
      sources: ["The Verge", "SVGator", "Pinterest"],
      image: "https://i.imgur.com/XcXR4vV.png"
    },
    {
      id: "minimalist",
      name: "Minimalist Card with Microinteractions",
      description: "Content simplicity with subtle animations and information clarity",
      sources: ["The Interaction Design Foundation"],
      image: "https://i.imgur.com/dQmJGHk.png"
    }
  ];

  const handleSelectDesign = (designId) => {
    navigate(`/user/info/${userId}/${designId}`, { 
      state: { 
        fromConnection, 
        fromRequest, 
        requestId,
        userData
      } 
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Select a Profile Design
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {designs.map((design, index) => (
            <motion.div
              key={design.id}
              className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={design.image} 
                  alt={design.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{design.name}</h2>
                <p className={`mb-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {design.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {design.sources.map(source => (
                    <span 
                      key={source} 
                      className={`text-xs px-2 py-1 rounded-full ${
                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {source}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleSelectDesign(design.id)}
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    darkMode 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                      : "bg-indigo-500 hover:bg-indigo-600 text-white"
                  }`}
                >
                  Select This Design
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserInfoSelector;
