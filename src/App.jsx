import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

const HomePage = () => {
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

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Dark mode toggle */}
      <motion.button
        className={`theme-toggle ${
          darkMode ? "bg-gray-800 text-yellow-300" : "bg-gray-200 text-gray-800"
        }`}
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 512 512"
            className="mx-auto mb-4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="512"
              height="512"
              rx="100"
              fill={darkMode ? "#2563eb" : "#3B82F6"}
            />
            <path
              d="M128 256L192 192M128 256L192 320M128 256H320M320 256L384 192M320 256L384 320"
              stroke="white"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M256 128V384"
              stroke="white"
              strokeWidth="32"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        <h1
          className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
            darkMode ? "text-white" : ""
          }`}
        >
          Welcome to CodeMate
        </h1>
        <p
          className={`text-base sm:text-lg mb-8 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Connect with developers around the world and collaborate on exciting
          projects
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/signup"
            className={`form-button ${
              darkMode ? "bg-blue-600 hover:bg-blue-700" : ""
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started
          </motion.a>
          <motion.a
            href="/login"
            className={`px-6 py-3 rounded-md border ${
              darkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            } font-medium transition-colors`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            LogIn
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

function App() {
  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
}

export default App;
