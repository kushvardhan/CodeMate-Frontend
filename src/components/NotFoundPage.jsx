import { motion } from "framer-motion";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

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
  const navigate = useNavigate();

  return (
    <div className={darkMode ? "notfound-dark" : "notfound-light"}>
      {/* Back Button with Shadow and 3D Effect */}
      <div
        className="profile-top-nav"
        style={{
          boxShadow: darkMode
            ? "0 4px 15px rgba(255, 255, 255, 0.2)"
            : "0 4px 15px rgba(0, 0, 0, 0.2)",
          transform: "translateZ(0)",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="Go back"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            background: darkMode ? "#1f2937" : "#f3f4f6",
            color: darkMode ? "#ffffff" : "#1f2937",
            boxShadow: darkMode
              ? "0 2px 4px rgba(255, 255, 255, 0.1)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <div className="notfound-wrapper">
        {/* Background Blobs */}
        <div className="blobs">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
        </div>

        {/* Main Card */}
        <motion.div
          className={darkMode ? "card dark-card" : "card light-card"}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="center-content">
            {/* Floating Ghost */}
            <motion.div
              className="ghost"
              variants={itemVariants}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <i className="ri-ghost-smile-line ghost-icon" />
              <motion.h1
                className="error-code"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                404
              </motion.h1>
            </motion.div>

            <motion.h2 className="title" variants={itemVariants}>
              Lost in Space?
            </motion.h2>

            <motion.p className="subtitle" variants={itemVariants}>
              Looks like you found a glitch in the matrix.
            </motion.p>
          </div>

          <motion.div className="button-wrapper" variants={itemVariants}>
            <Link to="/" className="home-button">
              <i className="ri-arrow-left-s-line" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
