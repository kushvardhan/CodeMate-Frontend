/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    // eslint-disable-next-line no-constant-binary-expression
    lastName: "" || "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  // Theme is now managed by ThemeContext

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    } else if (
      formData.firstName.length < 3 ||
      formData.firstName.length > 20
    ) {
      newErrors.firstName = "First name must be between 3 and 20 characters.";
    }


    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post("/signup", formData, {
        withCredentials: true,
      });
      console.log(res.data.user);

      // Clear form data
      setFormData({
        firstName: "",
        lastName: "" || "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setIsSubmitting(false);

      // Show success message
      setErrors({
        success: "Account created successfully! Please log in.",
      });

      // Navigate to login page after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
      setIsSubmitting(false);

      // Handle different types of error responses
      if (err.response?.data?.errors) {
        // Handle field-specific errors
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        // Handle general error message
        setErrors({ general: err.response.data.message });
      } else {
        // Handle unexpected errors
        setErrors({
          general:
            err.message || "An unexpected error occurred. Please try again.",
        });
      }
    }
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
      {/* Dark mode toggle button - positioned at the top right */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 2000,
          padding: "8px",
          backgroundColor: darkMode
            ? "rgba(17, 24, 39, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
          borderRadius: "50%",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          onClick={toggleDarkMode}
          className={`${darkMode ? "text-yellow-300" : "text-amber-400"}`}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "50%",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode
              ? "rgba(55, 65, 81, 0.5)"
              : "rgba(243, 244, 246, 0.7)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.transform = "scale(1)";
          }}
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
              <path
                d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`min-h-screen w-full flex flex-col items-center justify-start py-12 px-4 sm:py-16 sm:px-6 lg:px-8 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
        style={{
          minHeight: "100vh",
          paddingTop: "6vh",
          paddingBottom: "6vh",
        }}
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
              Find Your <span className="text-gradient">Code Match</span>
            </h1>
            <p
              className={`form-subtitle ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join CodeMate and swipe right for your perfect coding partner
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
              title="Sign up with Google"
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
              title="Sign up with Facebook"
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
              title="Sign up with GitHub"
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
            or sign up with email
          </motion.div>

          <motion.form onSubmit={handleSubmit} variants={itemVariants}>
            {errors.general && (
              <div className="error-msg mb-4 p-3 bg-red-400 border border-red-400 text-red-700 rounded shadow-sm animate-fadeIn">
                <p className="font-medium">*{errors.general}*</p>
              </div>
            )}
            {errors.success && (
              <div className="success-msg mb-4 p-3 bg-green-300 border border-green-400 text-green-700 rounded shadow-sm animate-fadeIn">
                <p className="font-medium">{errors.success}</p>
              </div>
            )}
            <div className="flex gap-4 mb-4">
              <div className="form-group flex-1">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-input ${errors.firstName ? "error" : ""} ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  }`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="error-message">{errors.firstName}</p>
                )}
              </div>

              <div className="form-group flex-1">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-input ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  }`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="error-message">{errors.lastName}</p>
                )}
              </div>
            </div>

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
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? "error" : ""} ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min. 8 characters)"
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${
                  errors.confirmPassword ? "error" : ""
                } ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
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
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.form>

          <motion.div
            className={`form-footer ${darkMode ? "text-gray-300" : ""}`}
            variants={itemVariants}
          >
            Already have an account?{" "}
            <Link to="/login" className="form-link">
              Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;
