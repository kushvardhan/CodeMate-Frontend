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
    <div className={darkMode ? "notfound-dark" : "notfound-light"}>
      <Nav />

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
            <Link to="/home" className="home-button">
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
