import { motion } from "framer-motion";
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Card from "./ui/Card";
import Nav from "./ui/Nav";

const Home = () => {
  const { darkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Sample users data with diverse content types
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      bio: "Passionate about creating beautiful and intuitive user interfaces. Specialized in React and modern CSS techniques.",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      location: "New York, NY",
    },
    {
      id: 2,
      name: "Michael Chen",
      bio: "Experienced backend developer with a strong focus on scalable architecture and performance optimization.",
      skills: ["Node.js", "Express", "MongoDB"],
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      location: "San Francisco, CA",
    },
    {
      id: 3,
      name: "Olivia Rodriguez",
      bio: "Full stack developer with expertise in both frontend and backend technologies.",
      skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "AWS"],
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
      location: "Austin, TX",
    },
    {
      id: 4,
      name: "Alex Morgan",
      bio: null,
      skills: ["Python"],
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      location: null,
    },
    {
      id: 5,
      name: "Emma Wilson",
      bio: "DevOps engineer specializing in CI/CD pipelines and cloud infrastructure.",
      skills: [],
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80",
      location: "Seattle, WA",
    },
    {
      id: 6,
      name: "James Lee",
      bio: "Machine learning engineer with a passion for AI and data science projects that make a difference.",
      skills: [
        "Python",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "Pandas",
        "NumPy",
      ],
      image:
        "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      location: "Boston, MA",
    },
    {
      id: 7,
      name: "Sofia Garcia",
      bio: "Mobile app developer specializing in cross-platform solutions with React Native and Flutter.",
      skills: ["React Native", "Flutter"],
      image:
        "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1989&q=80",
      location: "Miami, FL",
    },
    {
      id: 8,
      name: "David Kim",
      bio: "Game developer with experience in Unity and Unreal Engine. Looking to collaborate on indie game projects.",
      skills: [
        "Unity",
        "C#",
        "Unreal Engine",
        "C++",
        "3D Modeling",
        "Game Design",
      ],
      image:
        "https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      location: "Los Angeles, CA",
    },
  ];

  const handleSwipeLeft = () => {
    // Show red background effect
    setSwipeDirection("left");

    // Reset after animation
    setTimeout(() => {
      setSwipeDirection(null);
      // Move to next user
      if (currentIndex < users.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Reset to first user when reaching the end
        setCurrentIndex(0);
      }
    }, 300);
  };

  const handleSwipeRight = () => {
    // Show green background effect
    setSwipeDirection("right");

    // Reset after animation
    setTimeout(() => {
      setSwipeDirection(null);
      // Move to next user
      if (currentIndex < users.length - 1) {
        setCurrentIndex(currentIndex + 1);
        // Here you would typically handle the match/connection logic
        console.log(`Matched with ${users[currentIndex].name}!`);
      } else {
        // Reset to first user when reaching the end
        setCurrentIndex(0);
        console.log(`Matched with ${users[currentIndex].name}!`);
      }
    }, 800); // Longer timeout for right swipe to see the animations
  };

  // Function to get background class based on swipe direction
  const getBackgroundClass = () => {
    if (swipeDirection === "left") {
      return darkMode
        ? "bg-gradient-to-l from-red-900/30 to-transparent"
        : "bg-gradient-to-l from-red-200 to-transparent";
    } else if (swipeDirection === "right") {
      return darkMode
        ? "bg-gradient-to-r from-green-900/30 to-transparent"
        : "bg-gradient-to-r from-green-200 to-transparent";
    }
    return "";
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      } ${getBackgroundClass()}`}
    >
      <Nav />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-pattern opacity-30 dark:opacity-10"></div>

        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-10 dark:opacity-5 blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-10 dark:opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 opacity-10 dark:opacity-5 blur-3xl animate-blob animation-delay-4000"></div>

        {/* Colorful glowy icons background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Code icons */}
          <motion.div className="absolute top-[10%] left-[15%] transform -translate-x-1/2 -translate-y-1/2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="icon-glow code-icon"
            >
              <path
                d="M16 18L22 12L16 6"
                stroke="url(#code-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6L2 12L8 18"
                stroke="url(#code-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="code-gradient-1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-[25%] right-[20%] transform translate-x-1/2 -translate-y-1/2"
            animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              className="icon-glow code-icon"
            >
              <path
                d="M7 8L3 12L7 16"
                stroke="url(#code-gradient-2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 8L21 12L17 16"
                stroke="url(#code-gradient-2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 4L10 20"
                stroke="url(#code-gradient-2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="code-gradient-2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* People icons */}
          <motion.div
            className="absolute top-[40%] left-[25%] transform -translate-x-1/2 -translate-y-1/2"
            animate={{ y: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              className="icon-glow people-icon"
            >
              <path
                d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21"
                stroke="url(#people-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                stroke="url(#people-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13"
                stroke="url(#people-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88"
                stroke="url(#people-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="people-gradient-1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F472B6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            className="absolute bottom-[30%] right-[30%] transform translate-x-1/2 translate-y-1/2"
            animate={{ y: [0, -15, 0], opacity: [0.7, 1, 0.7] }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="icon-glow people-icon"
            >
              <path
                d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                stroke="url(#people-gradient-2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
                stroke="url(#people-gradient-2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="people-gradient-2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Connection icons */}
          <motion.div
            className="absolute top-[60%] left-[20%] transform -translate-x-1/2 -translate-y-1/2"
            animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
            transition={{
              repeat: Infinity,
              duration: 5.5,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              className="icon-glow connection-icon"
            >
              <path
                d="M6 9H4.5C3.12 9 2 7.88 2 6.5C2 5.12 3.12 4 4.5 4H6"
                stroke="url(#connection-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 9H19.5C20.88 9 22 7.88 22 6.5C22 5.12 20.88 4 19.5 4H18"
                stroke="url(#connection-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 4H18"
                stroke="url(#connection-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 20H4.5C3.12 20 2 18.88 2 17.5C2 16.12 3.12 15 4.5 15H6"
                stroke="url(#connection-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 20H19.5C20.88 20 22 18.88 22 17.5C22 16.12 20.88 15 19.5 15H18"
                stroke="url(#connection-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 15H18"
                stroke="url(#connection-gradient-1)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="connection-gradient-1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            className="absolute bottom-[20%] right-[15%] transform translate-x-1/2 translate-y-1/2"
            animate={{ y: [0, -12, 0], opacity: [0.7, 1, 0.7] }}
            transition={{
              repeat: Infinity,
              duration: 6.5,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              className="icon-glow connection-icon"
            >
              <path
                d="M9 11L12 14L22 4"
                stroke="url(#connection-gradient-2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16"
                stroke="url(#connection-gradient-2)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="connection-gradient-2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Infinity symbol with glow */}
        <motion.div
          className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            className="infinity-symbol"
          >
            <motion.path
              d="M30,30 C30,16.8 41.34,6 55.2,6 C69.06,6 75,16.8 75,30 C75,43.2 69.06,54 55.2,54 C41.34,54 30,43.2 30,30 Z M90,30 C90,16.8 78.66,6 64.8,6 C50.94,6 45,16.8 45,30 C45,43.2 50.94,54 64.8,54 C78.66,54 90,43.2 90,30 Z"
              fill="none"
              stroke="url(#infinity-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              className="infinity-path"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 1,
                filter: [
                  "drop-shadow(0 0 3px rgba(79, 70, 229, 0.6))",
                  "drop-shadow(0 0 8px rgba(79, 70, 229, 0.4))",
                  "drop-shadow(0 0 3px rgba(79, 70, 229, 0.6))",
                ],
              }}
              transition={{
                pathLength: { delay: 1.2, duration: 2, ease: "easeInOut" },
                opacity: { delay: 1.2, duration: 0.5 },
                filter: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              }}
            />
            <defs>
              <linearGradient
                id="infinity-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </motion.svg>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto mt-8 mb-24"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              delay: 0.3,
              duration: 0.6,
            }}
            className="relative inline-block heading-glow"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 animate-pulse"></div>
            <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              <span className="inline-block">Connect</span>{" "}
              <span className="inline-block">with</span>{" "}
              <span className="inline-block relative">
                Developers
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full h-2 text-indigo-500 dark:text-indigo-400"
                  viewBox="0 0 100 10"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <path
                    d="M 0,5 C 25,12 75,-2 100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </h1>
          </motion.div>

          <div className="relative max-w-2xl mx-auto mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xl md:text-2xl opacity-90 font-alt leading-relaxed relative z-10 subheading-text"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 font-semibold">
                Swipe
              </span>
              ,
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 font-semibold">
                match
              </span>
              , and
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 font-semibold">
                collaborate
              </span>{" "}
              with talented developers around the world
            </motion.p>

            {/* Decorative dots */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.3 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 }}
              />
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center items-center mt-24 mb-16">
          <Card
            user={users[currentIndex]}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        </div>

        <motion.div
          className="flex justify-center gap-12 mt-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="stats-card"
            whileHover={{ y: -3 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              delay: 0.4,
              duration: 0.3,
            }}
          >
            <div className="stats-icon connections-icon">
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="stats-title">Connections</h3>
            <motion.p
              className="stats-value"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
            >
              24
            </motion.p>
          </motion.div>

          <motion.div
            className="stats-card"
            whileHover={{ y: -3 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              delay: 0.5,
              duration: 0.3,
            }}
          >
            <div className="stats-icon pending-icon">
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
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="stats-title">Pending</h3>
            <motion.p
              className="stats-value"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
            >
              12
            </motion.p>
          </motion.div>

          <motion.div
            className="stats-card"
            whileHover={{ y: -3 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              delay: 0.6,
              duration: 0.3,
            }}
          >
            <div className="stats-icon messages-icon">
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="stats-title">Messages</h3>
            <motion.p
              className="stats-value"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.7 }}
            >
              8
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
