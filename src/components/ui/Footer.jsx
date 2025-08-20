import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaCode } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { darkMode } = useTheme();

  const socialLinks = [
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/kush-vardhan-48996a251/",
      label: "LinkedIn",
      color: "#0077B5"
    },
    {
      icon: FaEnvelope,
      href: "mailto:kushvardhan39797@gmail.com",
      label: "Email",
      color: "#EA4335"
    },
    {
      icon: FaGithub,
      href: "https://github.com/kushvardhan",
      label: "GitHub",
      color: darkMode ? "#ffffff" : "#333333"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      className={`footer-container ${darkMode ? 'dark' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="footer-content">
        {/* Brand Section */}
        <motion.div className="footer-brand" variants={itemVariants}>
          <div className="brand-icon">
            <FaCode className="code-icon" />
          </div>
          <span className="brand-text">CodeMate</span>
        </motion.div>

        {/* Developer Credit */}
        <motion.div className="footer-credit" variants={itemVariants}>
          <span className="credit-text">
            Crafted with <FaHeart className="heart-icon" /> by{" "}
            <span 
              className="developer-name"
              title="kushvardhan39797@gmail.com"
            >
              Kush Vardhan
            </span>
          </span>
        </motion.div>

        {/* Social Links */}
        <motion.div className="footer-social" variants={itemVariants}>
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title={link.label}
              style={{ "--hover-color": link.color }}
              whileHover={{ 
                scale: 1.2, 
                color: link.color,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <link.icon />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div className="footer-copyright" variants={itemVariants}>
        <span>© {new Date().getFullYear()} CodeMate. All rights reserved.</span>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
