import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [currentProfile, setCurrentProfile] = useState(0);
  const [direction, setDirection] = useState(null);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [dislikedProfiles, setDislikedProfiles] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sample developer profiles
  const profiles = [
    {
      id: 1,
      name: "Alex Johnson",
      age: 28,
      location: "San Francisco, CA",
      role: "Full Stack Developer",
      bio: "I love building with React and Node.js. Looking for someone to collaborate on open source projects.",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      github: "github.com/alexj",
    },
    {
      id: 2,
      name: "Sophia Chen",
      age: 25,
      location: "New York, NY",
      role: "Frontend Developer",
      bio: "Passionate about UI/UX and creating beautiful, responsive designs. Let's build something amazing together!",
      skills: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      github: "github.com/sophiac",
    },
    {
      id: 3,
      name: "Marcus Williams",
      age: 31,
      location: "Austin, TX",
      role: "Backend Developer",
      bio: "Specialized in building scalable APIs and microservices. Looking for frontend developers to collaborate with.",
      skills: ["Python", "Django", "FastAPI", "PostgreSQL", "Docker"],
      image:
        "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      github: "github.com/marcusw",
    },
    {
      id: 4,
      name: "Olivia Martinez",
      age: 27,
      location: "Seattle, WA",
      role: "DevOps Engineer",
      bio: "I love automating everything! Looking for developers who want to learn more about CI/CD and cloud infrastructure.",
      skills: ["AWS", "Kubernetes", "Terraform", "GitHub Actions", "Linux"],
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80",
      github: "github.com/oliviam",
    },
    {
      id: 5,
      name: "Ethan Park",
      age: 29,
      location: "Chicago, IL",
      role: "Mobile Developer",
      bio: "Specialized in React Native and Flutter. Looking for someone to build the next big mobile app with!",
      skills: ["React Native", "Flutter", "JavaScript", "Dart", "Firebase"],
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      github: "github.com/ethanp",
    },
  ];

  const handleSwipe = (direction) => {
    setDirection(direction);

    if (direction === "right") {
      setLikedProfiles([...likedProfiles, profiles[currentProfile]]);
    } else {
      setDislikedProfiles([...dislikedProfiles, profiles[currentProfile]]);
    }

    setTimeout(() => {
      if (currentProfile < profiles.length - 1) {
        setCurrentProfile(currentProfile + 1);
      } else {
        // Reset to first profile when all profiles are swiped
        setCurrentProfile(0);
      }
      setDirection(null);
    }, 300);
  };

  // Animation variants
  const cardVariants = {
    enter: (direction) => {
      return {
        x: direction === "right" ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
      };
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction) => {
      return {
        x: direction === "right" ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
        transition: {
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      };
    },
  };

  // Navbar variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      },
    },
  };

  // Button variants
  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Navbar for desktop */}
      <motion.nav
        className={`h-[8vh] px-4 md:px-6 flex justify-between items-center ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } shadow-md hidden md:flex`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        {/* Logo and name */}
        <div className="flex items-center">
          <motion.div
            className="text-gradient text-xl font-bold flex items-center"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 512 512"
              className="mr-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
            </svg>
            CodeMate
          </motion.div>
        </div>

        {/* User info and menu */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className={`p-1.5 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-100 text-amber-400"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6z"
                  fill="currentColor"
                />
              </svg>
            )}
          </motion.button>

          {/* User greeting and avatar */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span
              className={`mr-2 text-xs font-medium ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
              style={{ fontFamily: "var(--font-alt)" }}
            >
              Hey, Alex
            </span>
            <div className="w-7 h-7 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Menu button with dropdown */}
          <div className="relative">
            <motion.button
              className={`p-1.5 rounded-md ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>

            {/* Menu dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } ring-1 ring-black ring-opacity-5 z-50`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/requests"
                    className={`block px-4 py-2 text-sm ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Requests
                  </Link>
                  <Link
                    to="/connections"
                    className={`block px-4 py-2 text-sm ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Connections
                  </Link>
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={`block px-4 py-2 text-sm ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-600"></div>
                  <Link
                    to="/logout"
                    className={`block px-4 py-2 text-sm ${
                      darkMode
                        ? "text-red-400 hover:bg-gray-700"
                        : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    Logout
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Navbar for mobile */}
      <motion.nav
        className={`h-[8vh] px-4 flex justify-between items-center ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } shadow-md md:hidden`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        {/* Profile link */}
        <Link to="/profile" className="p-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center">
          <motion.div
            className="text-gradient text-lg font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            CodeMate
          </motion.div>
        </div>

        {/* Menu button with dropdown */}
        <div className="relative">
          <motion.button
            className={`p-1.5 ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>

          {/* Menu dropdown for mobile */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ring-1 ring-black ring-opacity-5 z-50`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/requests"
                  className={`block px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Requests
                </Link>
                <Link
                  to="/connections"
                  className={`block px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Connections
                </Link>
                <Link
                  to="/profile"
                  className={`block px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className={`block px-4 py-2 text-sm ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Settings
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-600"></div>
                <Link
                  to="/logout"
                  className={`block px-4 py-2 text-sm ${
                    darkMode
                      ? "text-red-400 hover:bg-gray-700"
                      : "text-red-600 hover:bg-gray-100"
                  }`}
                >
                  Logout
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Theme toggle button for mobile - positioned below navbar */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <motion.button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full shadow-lg ${
            darkMode ? "bg-gray-700 text-yellow-300" : "bg-white text-amber-400"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <defs>
                <radialGradient
                  id="sunGlowMobile"
                  cx="12"
                  cy="12"
                  r="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.7" />
                  <stop offset="70%" stopColor="#FCD34D" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="12" cy="12" r="12" fill="url(#sunGlowMobile)" />
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
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6z"
                fill="currentColor"
              />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Find Your Perfect <span className="text-gradient">Code Match</span>
          </h1>
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
            style={{ fontFamily: "var(--font-alt)" }}
          >
            Swipe right to connect with developers who share your interests
          </p>
        </motion.div>

        {/* Card swipe section */}
        <div className="flex justify-center items-center mt-4 relative card-container">
          <AnimatePresence initial={false} custom={direction}>
            {profiles[currentProfile] && (
              <motion.div
                key={profiles[currentProfile].id}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={`absolute w-full max-w-sm swipe-card ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
                style={{ height: "420px" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, { offset }) => {
                  const swipe =
                    offset.x > 100 ? "right" : offset.x < -100 ? "left" : null;
                  if (swipe) {
                    handleSwipe(swipe);
                  }
                }}
              >
                <div className="swipe-card-header" style={{ height: "180px" }}>
                  <img
                    src={profiles[currentProfile].image}
                    alt={profiles[currentProfile].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h2 className="text-white text-xl font-bold swipe-card-name">
                      {profiles[currentProfile].name},{" "}
                      {profiles[currentProfile].age}
                    </h2>
                    <p className="text-gray-200 flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {profiles[currentProfile].location}
                    </p>
                    <p className="text-white font-medium mt-1 text-sm swipe-card-role">
                      {profiles[currentProfile].role}
                    </p>
                  </div>
                </div>
                <div
                  className={`p-3 swipe-card-content ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <p className="mb-3 swipe-card-bio text-sm">
                    {profiles[currentProfile].bio}
                  </p>
                  <div className="mb-3 swipe-card-skills">
                    <h3
                      className={`text-xs font-semibold mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {profiles[currentProfile].skills.map((skill, index) => (
                        <span
                          key={index}
                          className="skill-tag text-xs px-2 py-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="currentColor"
                      className="mr-1"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <a
                      href={`https://${profiles[currentProfile].github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs ${
                        darkMode
                          ? "text-indigo-300 hover:text-indigo-200"
                          : "text-indigo-600 hover:text-indigo-800"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {profiles[currentProfile].github}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe buttons */}
          <div className="absolute -bottom-16 left-0 right-0 flex justify-center space-x-8 swipe-buttons">
            <motion.button
              className="swipe-button swipe-left w-12 h-12"
              onClick={() => handleSwipe("left")}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
            <motion.button
              className="swipe-button swipe-right w-12 h-12"
              onClick={() => handleSwipe("right")}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Stats section */}
        <motion.div
          className={`mt-24 md:mt-16 grid grid-cols-3 gap-3 max-w-sm mx-auto`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className={`stats-card ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="stats-title text-xs">Matches</h3>
            <p className="stats-value text-xl">{likedProfiles.length}</p>
          </div>
          <div
            className={`stats-card ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="stats-title text-xs">Viewed</h3>
            <p className="stats-value text-xl">
              {likedProfiles.length + dislikedProfiles.length}
            </p>
          </div>
          <div
            className={`stats-card ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="stats-title text-xs">Messages</h3>
            <p className="stats-value text-xl">0</p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className={`mt-8 py-4 ${
          darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ fontFamily: "var(--font-alt)" }}
      >
        <div className="container mx-auto px-4 text-center text-xs">
          <p>© 2023 CodeMate. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-indigo-500">
              Terms
            </a>
            <a href="#" className="hover:text-indigo-500">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-500">
              Contact
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
