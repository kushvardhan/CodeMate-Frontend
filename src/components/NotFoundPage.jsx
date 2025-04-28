import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NotFoundPage = () => {
  const { darkMode } = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Code symbols for background
  const codeSymbols = [
    { symbol: "</>", x: "10%", y: "20%", size: "3rem", rotate: "-10deg" },
    { symbol: "{ }", x: "85%", y: "15%", size: "2.5rem", rotate: "15deg" },
    { symbol: "==", x: "75%", y: "75%", size: "2rem", rotate: "-5deg" },
    { symbol: "=>", x: "15%", y: "65%", size: "2.2rem", rotate: "10deg" },
    { symbol: "&&", x: "60%", y: "35%", size: "1.8rem", rotate: "-15deg" },
    { symbol: "||", x: "25%", y: "40%", size: "2rem", rotate: "5deg" },
    { symbol: "++", x: "45%", y: "85%", size: "2.3rem", rotate: "-8deg" },
    { symbol: "!=", x: "80%", y: "50%", size: "2.1rem", rotate: "12deg" },
  ];

  // Programming languages for background
  const languages = [
    { name: "JavaScript", x: "20%", y: "10%", size: "1.2rem", rotate: "5deg" },
    { name: "Python", x: "70%", y: "25%", size: "1.3rem", rotate: "-8deg" },
    { name: "React", x: "30%", y: "80%", size: "1.4rem", rotate: "10deg" },
    { name: "Node.js", x: "65%", y: "60%", size: "1.2rem", rotate: "-5deg" },
    { name: "TypeScript", x: "40%", y: "30%", size: "1.1rem", rotate: "7deg" },
    { name: "MongoDB", x: "85%", y: "85%", size: "1.3rem", rotate: "-12deg" },
    { name: "HTML", x: "15%", y: "50%", size: "1.2rem", rotate: "8deg" },
    { name: "CSS", x: "55%", y: "15%", size: "1.1rem", rotate: "-6deg" },
  ];

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Background code symbols */}
      {codeSymbols.map((item, index) => (
        <motion.div
          key={`symbol-${index}`}
          className={`absolute z-0 font-mono ${
            darkMode ? "text-gray-700" : "text-gray-200"
          }`}
          style={{
            left: item.x,
            top: item.y,
            fontSize: item.size,
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: 0.5,
            rotate: item.rotate,
            filter: darkMode
              ? "drop-shadow(0 0 8px rgba(79, 70, 229, 0.3))"
              : "none",
          }}
          transition={{
            duration: 1,
            delay: index * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: Math.random() * 2,
          }}
        >
          {item.symbol}
        </motion.div>
      ))}

      {/* Background programming languages */}
      {languages.map((item, index) => (
        <motion.div
          key={`lang-${index}`}
          className={`absolute z-0 font-mono ${
            darkMode ? "text-gray-700" : "text-gray-200"
          }`}
          style={{
            left: item.x,
            top: item.y,
            fontSize: item.size,
          }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{
            opacity: 0.5,
            rotate: item.rotate,
            filter: darkMode
              ? "drop-shadow(0 0 8px rgba(79, 70, 229, 0.3))"
              : "none",
          }}
          transition={{
            duration: 1.5,
            delay: index * 0.15,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: Math.random() * 3,
          }}
        >
          {item.name}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        className={`relative z-10 max-w-md w-full p-8 rounded-xl shadow-xl ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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

            {/* Error symbol (X) */}
            <circle
              cx="256"
              cy="256"
              r="120"
              stroke={darkMode ? "#EF4444" : "#DC2626"}
              strokeWidth="16"
              strokeDasharray="15 15"
              fill="none"
            />
            <path
              d="M200 200L312 312M312 200L200 312"
              stroke={darkMode ? "#EF4444" : "#DC2626"}
              strokeWidth="16"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-center mb-2"
          variants={itemVariants}
        >
          404
        </motion.h1>

        <motion.h2
          className={`text-2xl font-semibold text-center mb-6 ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
          variants={itemVariants}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          className={`text-center mb-8 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
          variants={itemVariants}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div className="flex justify-center" variants={itemVariants}>
          <Link
            to="/home"
            className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              darkMode
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Back to Home
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
