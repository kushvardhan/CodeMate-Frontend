import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Card from "./ui/Card";
import Nav from "./ui/Nav";

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch users or use mock data
    const mockUsers = [
      {
        id: 1,
        name: "Jane Smith",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        address: "San Francisco, CA",
        description:
          "Full-stack developer with 5 years of experience in React and Node.js",
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
      },
      {
        id: 2,
        name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        address: "New York, NY",
        description:
          "Frontend developer specializing in React and modern JavaScript",
        skills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
      },
      {
        id: 3,
        name: "Emily Johnson",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        address: "Austin, TX",
        description: "Backend developer with expertise in Python and Django",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
      },
      {
        id: 4,
        name: "Michael Brown",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        address: "Seattle, WA",
        description: "Mobile developer focused on React Native and Flutter",
        skills: ["React Native", "Flutter", "JavaScript", "Dart", "Firebase"],
      },
      {
        id: 5,
        name: "Sarah Wilson",
        image: "https://randomuser.me/api/portraits/women/56.jpg",
        address: "Chicago, IL",
        description: "DevOps engineer with strong CI/CD pipeline experience",
        skills: ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform"],
      },
    ];

    setUsers(mockUsers);
  }, []);

  const handleSwipeLeft = () => {
    console.log("Swiped left (pass)");
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    console.log("Swiped right (like)");
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getBackgroundClass = () => {
    return "";
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-gray-800/90 text-white"
          : "bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 text-gray-900"
      } ${getBackgroundClass()}`}
    >
      {/* WhatsApp-style background with glowy animated coding icons */}
      <div className="whatsapp-bg">
        {/* Base pattern */}
        <div className="absolute inset-0 bg-pattern opacity-30 dark:opacity-10"></div>

        {/* Animated circles for depth */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-10 dark:opacity-5 blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-10 dark:opacity-5 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 opacity-10 dark:opacity-5 blur-3xl animate-blob animation-delay-4000"></div>

        {/* Code icons scattered throughout */}
        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "10%", left: "15%", fontSize: "32px" }}
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          {`{ }`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "25%", right: "20%", fontSize: "36px" }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          {`</>`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "40%", left: "25%", fontSize: "30px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          {`( )`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "60%", right: "25%", fontSize: "34px" }}
          animate={{ y: [-7, 7, -7], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          {`[ ]`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ bottom: "30%", left: "30%", fontSize: "28px" }}
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: "easeInOut",
            delay: 0.7,
          }}
        >
          {`/* */`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ bottom: "20%", right: "20%", fontSize: "32px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 6.5,
            ease: "easeInOut",
            delay: 1.2,
          }}
        >
          {`=>`}
        </motion.div>

        {/* People icons */}
        <motion.div
          className="whatsapp-bg-icon people"
          style={{ top: "15%", right: "35%", fontSize: "36px" }}
          animate={{ y: [-7, 7, -7], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          <svg
            width="36"
            height="36"
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
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon people"
          style={{ bottom: "40%", left: "15%", fontSize: "34px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 1.8,
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </motion.div>

        {/* Connection icons */}
        <motion.div
          className="whatsapp-bg-icon connection"
          style={{ top: "50%", right: "10%", fontSize: "32px" }}
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: "easeInOut",
            delay: 0.9,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon connection"
          style={{ bottom: "15%", left: "40%", fontSize: "34px" }}
          animate={{ y: [-7, 7, -7], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 7.5,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
        </motion.div>

        {/* Additional icons */}
        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "5%", left: "45%", fontSize: "30px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 0.8,
          }}
        >
          {`function()`}
        </motion.div>

        {/* Icons around stats section */}
        <motion.div
          className="whatsapp-bg-icon connection"
          style={{ top: "65%", left: "20%", fontSize: "30px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "75%", right: "25%", fontSize: "32px" }}
          animate={{ y: [-7, 7, -7], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.7,
          }}
        >
          {`<div/>`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon people"
          style={{ top: "80%", left: "35%", fontSize: "34px" }}
          animate={{ y: [-8, 8, -8], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 1.2,
          }}
        >
          <svg
            width="34"
            height="34"
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
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ top: "70%", right: "5%", fontSize: "28px" }}
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 5.5,
            ease: "easeInOut",
            delay: 1.3,
          }}
        >
          {`import {}`}
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon connection"
          style={{ top: "85%", left: "10%", fontSize: "32px" }}
          animate={{ y: [-7, 7, -7], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon people"
          style={{ top: "30%", left: "5%", fontSize: "34px" }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 1.7,
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </motion.div>

        <motion.div
          className="whatsapp-bg-icon code"
          style={{ bottom: "45%", right: "45%", fontSize: "32px" }}
          animate={{ y: [-6, 6, -6], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 6.5,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          {`const dev = {}`}
        </motion.div>

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

      {/* Main content container - all content is positioned relative to the background */}
      <div className="relative z-10 min-h-screen w-full">
        <Nav />

        <div className="container mx-auto px-4 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto mt-8 mb-16"
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
              <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold mb-2 font-heading bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                <span className="inline-block">Connect</span>{" "}
                <span className="inline-block">with</span>{" "}
                <span className="inline-block">Developers</span>
                <motion.svg
                  className="absolute bottom-0 left-0 w-full h-2 text-indigo-500 dark:text-indigo-400 opacity-60 z-0"
                  viewBox="0 0 100 10"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
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
              </h1>
              <p className="text-xl md:text-2xl opacity-90 font-alt leading-relaxed relative z-10 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 font-semibold">
                  Swipe
                </span>
                ,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 font-semibold">
                  match
                </span>
                , and{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 font-semibold">
                  collaborate
                </span>{" "}
                with talented developers around the world
              </p>
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
                ,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 font-semibold">
                  match
                </span>
                , and{" "}
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

          <div className="flex justify-center items-center mt-16 mb-16">
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
    </div>
  );
};

export default Home;
