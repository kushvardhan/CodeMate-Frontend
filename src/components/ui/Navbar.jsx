import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile based on window width
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close dropdown and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.menu-container')) {
        setIsDropdownOpen(false);
      }
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'dark' : ''} navbar-glass text-${darkMode ? 'white' : 'gray-900'} shadow-md`}
        style={{ height: isMobile ? '10vh' : '12vh' }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo - centered on mobile */}
          <motion.div 
            className={`flex items-center ${isMobile ? 'mx-auto' : ''}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Link to="/" className="flex items-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                {/* Code symbol */}
                <g
                  stroke={darkMode ? "#818CF8" : "#4F46E5"}
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Left code bracket */}
                  <path d="M160 180L110 256L160 332" />

                  {/* Right code bracket */}
                  <path d="M352 180L402 256L352 332" />

                  {/* Slash in middle */}
                  <path d="M280 160L232 352" />
                </g>

                {/* Two people/developers connecting */}
                <g>
                  {/* Person 1 */}
                  <circle cx="180" cy="256" r="30" fill="#38BDF8" />
                  {/* Person 2 */}
                  <circle cx="332" cy="256" r="30" fill="#E879F9" />

                  {/* Connection line between people */}
                  <path
                    d="M210 256H302"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="12 8"
                  />

                  {/* Handshake symbol */}
                  <path
                    d="M256 256m-15 0a15 15 0 1 0 30 0a15 15 0 1 0 -30 0"
                    fill="white"
                  />
                </g>
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">CodeMate</span>
            </Link>
          </motion.div>

          {/* Theme Toggle Button */}
          {!isMobile && (
            <motion.button
              onClick={toggleDarkMode}
              className={`absolute left-1/2 transform -translate-x-1/2 p-2 rounded-full ${
                darkMode ? "text-yellow-300 hover:bg-gray-800" : "text-amber-400 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <radialGradient
                      id="sunGlow"
                      cx="12"
                      cy="12"
                      r="12"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.7" />
                      <stop offset="70%" stopColor="#FCD34D" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="12" cy="12" r="12" fill="url(#sunGlow)" />
                  <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
                  <path
                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <radialGradient
                      id="moonGlow"
                      cx="12"
                      cy="12"
                      r="12"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                      <stop offset="70%" stopColor="#3B82F6" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="12" cy="12" r="12" fill="url(#moonGlow)" />
                  <path
                    d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </motion.button>
          )}

          {/* Menu Button (right side) */}
          <div className={`flex items-center space-x-4 ${isMobile ? 'absolute right-4' : ''}`}>
            {/* Mobile Theme Toggle */}
            {isMobile && (
              <motion.button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode ? "text-yellow-300" : "text-amber-400"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
                    <path
                      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </motion.button>
            )}

            {/* Menu Button */}
            <motion.div 
              className="relative mobile-menu-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                onClick={toggleMenu}
                className={`flex items-center space-x-2 p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={`font-medium text-${darkMode ? 'white' : 'gray-900'} mr-2 ${isMobile ? 'hidden' : 'block'}`}>Menu</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    animate={{ rotate: isMenuOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </motion.svg>
                </div>
              </motion.button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                    style={{ zIndex: 100 }}
                  >
                    {user && (
                      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400 flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 mr-3">
                            {user.profilePic ? (
                              <img
                                src={user.profilePic}
                                alt={user.firstName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-bold text-lg">
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs opacity-70 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="py-2">
                      <Link to="/profile" className={`flex items-center px-4 py-3 menu-hover-effect hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-200`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Profile</span>
                      </Link>
                      <Link to="/connections" className={`flex items-center px-4 py-3 menu-hover-effect hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-200`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        <span>Connections</span>
                      </Link>
                      <Link to="/requests" className={`flex items-center px-4 py-3 menu-hover-effect hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-200`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <polyline points="17 11 19 13 23 9"></polyline>
                        </svg>
                        <span>Requests</span>
                      </Link>
                      {user ? (
                        <button 
                          onClick={() => {
                            // Handle logout logic here
                            navigate('/login');
                          }} 
                          className={`w-full text-left flex items-center px-4 py-3 menu-hover-effect hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-200 text-red-500`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          <span>Logout</span>
                        </button>
                      ) : (
                        <>
                          <Link to="/login" className={`flex items-center px-4 py-3 menu-hover-effect hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-200`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                              <polyline points="10 17 15 12 10 7"></polyline>
                              <line x1="15" y1="12" x2="3" y2="12"></line>
                            </svg>
                            <span>Login</span>
                          </Link>
                          <Link to="/signup" className={`flex items-center px-4 py-3 menu-hover-effect hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-200`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="8.5" cy="7" r="4"></circle>
                              <line x1="20" y1="8" x2="20" y2="14"></line>
                              <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            <span>Sign Up</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.nav>
      {/* Spacer to prevent content from being hidden under the navbar */}
      <div style={{ height: isMobile ? '10vh' : '12vh' }}></div>
    </>
  );
};

export default Navbar;
