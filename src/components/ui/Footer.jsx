/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaCode, FaGithub, FaHeart } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      className={`footer-container ${darkMode ? "dark" : ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="footer-content">
        {/* Main Footer Info */}
        <motion.div className="footer-main" variants={itemVariants}>
          <div className="footer-brand">
            <div className="brand-icon">
              <FaCode className="code-icon" />
            </div>
            <span className="brand-text">CodeMate</span>
          </div>

          <div className="footer-tagline">Connect • Code • Collaborate</div>
        </motion.div>

        {/* Developer Credit & Links */}
        <motion.div className="footer-credits" variants={itemVariants}>
          <div className="developer-credit">
            <span className="credit-text">
              Built with <FaHeart className="heart-icon" /> by{" "}
              <span
                className="developer-name"
                title="kushvardhan39797@gmail.com"
              >
                Kush Vardhan
              </span>
            </span>
          </div>

          <div className="footer-links">
            <a
              href="https://github.com/kushvardhan"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              title="View Source Code"
            >
              <FaGithub className="github-icon" />
              <span>Source Code</span>
            </a>

            <span className="footer-year">© {new Date().getFullYear()}</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
