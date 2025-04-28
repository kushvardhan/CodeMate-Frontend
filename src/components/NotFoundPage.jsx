import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Nav from "./ui/Nav";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const NotFoundPage = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col font-poppins ${
        darkMode ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white" : "bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-gray-900"
      }`}
    >
      <Nav />

      <div className="flex-grow flex items-center justify-center relative overflow-hidden">

        {/* Background blobs for aesthetics */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl animate-ping"></div>
        </div>

        {/* Main content */}
        <motion.div
          className={`relative z-10 bg-black max-w-lg w-full mx-4 p-10 rounded-3xl shadow-2xl backdrop-blur-md ${
            darkMode
              ? "bg-gray-800/70 border border-gray-700/40"
              : "bg-white/80 border border-gray-300/40"
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex  flex-col items-center justify-center gap-6 mb-10">

            {/* Ghost Icon floating */}
            <motion.div
              className="flex flex-col items-center"
              variants={itemVariants}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <i className="ri-ghost-smile-line text-8xl text-indigo-500 drop-shadow-lg" />
              <motion.h1
                className="text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                404
              </motion.h1>
            </motion.div>

            {/* Text */}
            <motion.h2
              className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-300"
              variants={itemVariants}
            >
              Lost in Space?
            </motion.h2>

            <motion.p
              className="text-center text-lg text-gray-600 dark:text-gray-400"
              variants={itemVariants}
            >
              Looks like you found a glitch in the matrix.
            </motion.p>

          </div>

          {/* Button */}
          <motion.div className="flex justify-center" variants={itemVariants}>
            <Link
              to="/home"
              className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all hover:scale-110 hover:shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
            >
              <i className="ri-arrow-left-s-line text-2xl" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
