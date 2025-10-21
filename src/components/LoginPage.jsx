/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { clearUser, setUser } from "../slice/UserSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearUser());

    const theme = localStorage.getItem("theme");
    localStorage.clear();
    if (theme) {
      localStorage.setItem("theme", theme);
    }

    localStorage.setItem("wasLoggedOut", "true");

    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      if (name && !name.includes("theme")) {
        document.cookie = `${name.trim()}=;expires=${new Date(
          0
        ).toUTCString()};path=/`;
      }
    });
  }, [dispatch]);

  const from = "/profile";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const res = await axios.post("https://code-mate-backend-seven.vercel.app/login", formData, {
        withCredentials: true,
      });

      dispatch(setUser(res.data.user));
      setIsSubmitting(false);

      setFormData({
        email: "",
        password: "",
      });

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setIsSubmitting(false);

      setErrors({
        general: err.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

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

          <motion.form onSubmit={handleSubmit} variants={itemVariants}>
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded shadow-sm animate-fadeIn">
                <p className=" error-login  font-medium">{errors.general}</p>
              </div>
            )}
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
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-input relative ${
                  errors.password ? "error" : ""
                } ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />

              <div className="eye-icon">
                {!showPassword ? (
                  <FaEyeSlash
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <FaEye
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>

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
                  Logging in...
                </span>
              ) : (
                "Log in"
              )}
            </motion.button>

            <div className="form-footer">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className={`form-link ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Sign up
              </Link>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
