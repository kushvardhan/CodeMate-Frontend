import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred color scheme
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);

    // Apply dark mode class to body
    if (prefersDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    // Toggle dark mode class on body
    if (!darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Login form submitted:", formData);
      setIsSubmitting(false);
      // Here you would typically redirect the user or show a success message
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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

  return (
    <>
      {/* Creative Dark mode toggle - floating with animation */}
      <motion.button
        className={`absolute top-3 right-3 z-50 p-2 rounded-full ${
          darkMode ? "text-yellow-300" : "text-amber-400"
        }`}
        onClick={toggleDarkMode}
        style={{
          background: "transparent",
          filter: darkMode
            ? "drop-shadow(0 0 4px rgba(253, 224, 71, 0.5))"
            : "drop-shadow(0 0 6px rgba(251, 191, 36, 0.7))",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
        whileHover={{ scale: 1.1 }}
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <defs>
              <radialGradient
                id="moonGlow"
                cx="12"
                cy="12"
                r="10"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#moonGlow)" />
            <path
              d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6z"
              fill="currentColor"
            />
          </svg>
        )}
      </motion.button>

      <div
        className={`min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
        style={{ height: "100vh" }}
      >
        <motion.div
          className={`form-container ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="form-header" variants={itemVariants}>
            <h1 className="form-title">
              Welcome <span className="text-gradient">Back</span>
            </h1>
            <p
              className={`form-subtitle ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Ready to find your perfect code match?
            </p>
            <div
              className="flex items-center justify-center mt-4 mb-6 w-full"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <svg
                width="80"
                height="80"
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

                {/* Two people/developers connecting */}
                <g>
                  {/* Person 1 */}
                  <circle cx="180" cy="256" r="30" fill="#38BDF8" />
                  {/* Person 2 */}
                  <circle cx="332" cy="256" r="30" fill="#E879F9" />

                  {/* Connection line between people */}
                  <path
                    d="M210 256H302"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="12 8"
                  />

                  {/* Handshake symbol */}
                  <path
                    d="M256 256m-15 0a15 15 0 1 0 30 0a15 15 0 1 0 -30 0"
                    fill="white"
                  />
                </g>
              </svg>
            </div>
          </motion.div>

          <motion.div className="social-buttons" variants={itemVariants}>
            <button
              className={`social-button ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100"
              }`}
              title="Login with Google"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>
            <button
              className={`social-button ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100"
              }`}
              title="Login with Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  fill="#1877F2"
                />
              </svg>
            </button>
            <button
              className={`social-button ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100"
              }`}
              title="Login with GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.755-1.332-1.755-1.087-.744.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.956-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.838 1.234 1.91 1.234 3.22 0 4.61-2.807 5.625-5.479 5.92.43.372.824 1.102.824 2.222 0 1.604-.015 2.897-.015 3.293 0 .319.192.694.8.577C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"
                  fill={darkMode ? "#ffffff" : "#333333"}
                />
              </svg>
            </button>
          </motion.div>

          <motion.div
            className={`form-divider ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
            variants={itemVariants}
          >
            or log-in with email
          </motion.div>

          <motion.form onSubmit={handleSubmit} variants={itemVariants}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? "error" : ""} ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
              <div className="flex justify-start items-center mb-1">
                <a
                  href="#"
                  className={`text-xs ${
                    darkMode ? "text-primary-light" : "text-primary"
                  } hover:underline opacity-80`}
                  style={{ fontSize: "0.7rem" }}
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? "error" : ""} ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            <motion.button
              type="submit"
              className={`form-button ${
                darkMode ? "bg-blue-600 hover:bg-blue-700" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loging in...
                </span>
              ) : (
                "LogIn"
              )}
            </motion.button>
          </motion.form>

          <motion.div
            className={`form-footer ${darkMode ? "text-gray-300" : ""}`}
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <Link to="/signup" className="form-link">
              Create Account
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
