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

  const heartVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.footer
      className={`footer-container ${darkMode ? "dark" : ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="footer-content">
        {/* Brand Section */}
        <motion.div className="footer-brand" variants={itemVariants}>
          <Link to="/" >
          <div className='braaind'>
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
          <span className="brand-text">CodeMate</span>
          </div>
          </Link>
          <div className="footer-tagline">Connect • Code • Collaborate</div>
        </motion.div>

        {/* Developer Credit - Centered */}
        <motion.div className="footer-center" variants={itemVariants}>
          <div className="developer-credit">
            <span className="credit-text">
              Built with{" "}
              <motion.span
                className="heart-wrapper"
                variants={heartVariants}
                animate="pulse"
              >
                <FaHeart className="heart-icon" />
              </motion.span>{" "}
              by{" "}
              <span
                className="developer-name"
                title="kushvardhan39797@gmail.com"
              >
                Kush Vardhan
              </span>
            </span>
          </div>
        </motion.div>

        {/* Links Section */}
        <motion.div className="footer-links-section" variants={itemVariants}>
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
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
