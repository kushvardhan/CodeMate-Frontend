import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { logoutUser } from "../../slice/UserSlice";

const Nav = () => {
  const { user } = useSelector((state) => state.user);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false); // Track very small screens
  const menuRef = useRef(null);

  // Check if mobile and screen sizes based on window width
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsVerySmallScreen(window.innerWidth <= 500); // Consider screens <= 500px as very small
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle menu toggle and click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className={`navbar-container ${darkMode ? "dark" : "light"}`}>
        {/* Desktop Layout */}
        {!isMobile && (
          <>
            {/* CodeMate logo on left */}
            <div className="navbar-left">
              <Link to="/" className="logo-link">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="logo-svg"
                >
                  <g
                    stroke={darkMode ? "#818CF8" : "#4F46E5"}
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M160 180L110 256L160 332" />
                    <path d="M352 180L402 256L352 332" />
                    <path d="M280 160L232 352" />
                  </g>
                  <g>
                    <circle cx="180" cy="256" r="30" fill="#38BDF8" />
                    <circle cx="332" cy="256" r="30" fill="#E879F9" />
                    <path
                      d="M210 256H302"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="12 8"
                    />
                    <path
                      d="M256 256m-15 0a15 15 0 1 0 30 0a15 15 0 1 0 -30 0"
                      fill="white"
                    />
                  </g>
                </svg>
                <span className="logo-text">CodeMate</span>
              </Link>
            </div>

            {/* Theme toggle in middle */}
            <div className="navbar-center">
              <button
                onClick={toggleDarkMode}
                className={`theme-toggle ${darkMode ? "dark" : "light"}`}
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

            {/* Menu on right */}
            <div className="navbar-right">
              <div
                className={`menu-dropdown ${isMenuOpen ? "open" : ""}`}
                ref={menuRef}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="menu-button"
                  onClick={toggleMenu}
                >
                  Menu
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
                    className="menu-icon"
                  >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </div>
                {isMenuOpen && (
                  <motion.ul
                    tabIndex={0}
                    className={`dropdown-menu ${darkMode ? "dark" : "light"}`}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.li
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 20,
                        delay: 0.1,
                      }}
                    >
                      <Link to="/profile">
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
                        Profile
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -120 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      <Link to="/connections">
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
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Connections
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -140 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 20,
                        delay: 0.3,
                      }}
                    >
                      <Link to="/requests">
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
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Requests
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -160 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 20,
                        delay: 0.4,
                      }}
                    >
                      <a
                        onClick={async () => {
                          try {
                            // Call the backend logout endpoint to clear cookies
                            await axios.post(
                              "/logout",
                              {},
                              { withCredentials: true }
                            );
                          } catch (error) {
                            console.error("Error during logout:", error);
                          } finally {
                            // Dispatch logout action to clear Redux state
                            dispatch(logoutUser());
                            // Clear any stored tokens
                            localStorage.removeItem("token");
                            // Clear all cookies by setting them to expire
                            document.cookie.split(";").forEach((cookie) => {
                              document.cookie = cookie
                                .replace(/^ +/, "")
                                .replace(
                                  /=.*/,
                                  `=;expires=${new Date().toUTCString()};path=/`
                                );
                            });
                            // Navigate to login page
                            navigate("/login");
                          }
                        }}
                        className="logout-link"
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
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                      </a>
                    </motion.li>
                  </motion.ul>
                )}
              </div>
            </div>
          </>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="mobile-navbar-container">
            {/* Theme Toggle on Left - Only visible on screens > 500px */}
            {!isVerySmallScreen && (
              <div className="mobile-navbar-left">
                <button
                  onClick={toggleDarkMode}
                  className={`theme-toggle ${darkMode ? "dark" : "light"}`}
                  aria-label="Toggle theme"
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
            )}

            {/* Empty div for small screens to maintain grid layout */}
            {isVerySmallScreen && (
              <div className="mobile-navbar-left-empty"></div>
            )}

            {/* Logo in Center */}
            <div className="mobile-navbar-center">
              <Link to="/" className="logo-link">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="logo-svg"
                >
                  <g
                    stroke={darkMode ? "#818CF8" : "#4F46E5"}
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M160 180L110 256L160 332" />
                    <path d="M352 180L402 256L352 332" />
                    <path d="M280 160L232 352" />
                  </g>
                  <g>
                    <circle cx="180" cy="256" r="30" fill="#38BDF8" />
                    <circle cx="332" cy="256" r="30" fill="#E879F9" />
                    <path
                      d="M210 256H302"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="12 8"
                    />
                    <path
                      d="M256 256m-15 0a15 15 0 1 0 30 0a15 15 0 1 0 -30 0"
                      fill="white"
                    />
                  </g>
                </svg>
                <span className="logo-text">CodeMate</span>
              </Link>
            </div>

            {/* Menu Button on Right */}
            <div className="mobile-navbar-right">
              <div
                className={`menu-dropdown ${isMenuOpen ? "open" : ""}`}
                ref={menuRef}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="menu-button-mobile"
                  onClick={toggleMenu}
                  aria-label="Toggle menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="menu-icon"
                  >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>

            {/* Dropdown menu (shared for both layouts) */}
            {isMenuOpen && (
              <motion.ul
                tabIndex={0}
                className={`dropdown-menu ${darkMode ? "dark" : "light"}`}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Always show theme toggle in dropdown for small screens */}
                {isVerySmallScreen && (
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="theme-toggle-menu-item"
                  >
                    <button
                      className={`theme-toggle-in-menu ${
                        darkMode ? "dark" : "light"
                      }`}
                      onClick={toggleDarkMode}
                      aria-label={
                        darkMode
                          ? "Switch to light mode"
                          : "Switch to dark mode"
                      }
                    >
                      {darkMode ? (
                        <>
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
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
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
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  </motion.li>
                )}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  <Link to="/profile">
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
                    Profile
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.2,
                  }}
                >
                  <Link to="/connections">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Connections
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.3,
                  }}
                >
                  <Link to="/requests">
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
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Requests
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.4,
                  }}
                >
                  <a
                    onClick={async () => {
                      try {
                        // Call the backend logout endpoint to clear cookies
                        await axios.post(
                          "/logout",
                          {},
                          { withCredentials: true }
                        );
                        // Dispatch logout action to clear Redux state
                        dispatch(logoutUser());
                        // Clear any stored tokens
                        localStorage.removeItem("token");
                        // Navigate to login page
                        navigate("/login");
                      } catch (error) {
                        console.error("Error during logout:", error);
                        // Even if the API call fails, still clear local state and redirect
                        dispatch(logoutUser());
                        localStorage.removeItem("token");
                        navigate("/login");
                      }
                    }}
                    className="logout-link"
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
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </a>
                </motion.li>
              </motion.ul>
            )}
          </div>
        )}
      </div>
      {/* Spacer to prevent content from being hidden under the navbar */}
      <div className="navbar-spacer"></div>
    </>
  );
};

export default Nav;
