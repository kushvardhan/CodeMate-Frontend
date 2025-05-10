// src/App.jsx
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import axios from "./api/axios";
import Chat from "./components/Chat";
import Connection from "./components/Connection";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import NotFoundPage from "./components/NotFoundPage";
import ProfilePage from "./components/ProfilePage";
import Request from "./components/Request";
import SignupPage from "./components/SignupPage";
import UserInfo from "./components/UserInfo";
import { clearUser, setUser } from "./slice/UserSlice.js";

// Protected Route with enhanced authentication check
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading, user } = useSelector(
    (state) => state.user
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState(true);

  // Force verification of authentication on every protected route access
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Only verify if we think we're authenticated or still loading
        if (isAuthLoading || isAuthenticated) {
          console.log(`Verifying auth for route: ${location.pathname}`);
          const response = await axios.get("/user/me", {
            withCredentials: true,
          });

          if (response.data?.user) {
            // Update user data in Redux store
            dispatch(setUser(response.data.user));
            console.log(`Auth verified successfully for ${location.pathname}`);
          } else {
            console.warn(
              `Auth failed - no user data returned for ${location.pathname}`
            );
            // Clear user if backend says not authenticated
            dispatch(clearUser());
            // Set flag to prevent auto-login attempts
            localStorage.setItem("wasLoggedOut", "true");
          }
        }
      } catch (error) {
        console.error(
          `Auth verification failed for ${location.pathname}:`,
          error
        );
        // Clear user on error
        dispatch(clearUser());
        // Set flag to prevent auto-login attempts
        localStorage.setItem("wasLoggedOut", "true");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [dispatch, isAuthenticated, isAuthLoading]);

  // Show loading while verifying or while auth is still loading
  if (isVerifying || isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // After verification, check if authenticated
  return isAuthenticated && user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// Public Route
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// Not Found Route
const NotFoundRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return isAuthenticated ? <NotFoundPage /> : <Navigate to="/login" replace />;
};

// Main Routes
const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Request />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connections"
          element={
            <ProtectedRoute>
              <Connection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/info/:userId"
          element={
            <ProtectedRoute>
              <UserInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </AnimatePresence>
  );
};

// Enhanced Auth persistence with better error handling
const PersistAuth = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthLoading } = useSelector((state) => state.user);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Check if user explicitly logged out (we'll set this flag in localStorage)
    const wasLoggedOut = localStorage.getItem("wasLoggedOut") === "true";

    // If user explicitly logged out, don't try to restore the session
    if (wasLoggedOut) {
      dispatch(clearUser());
      localStorage.removeItem("wasLoggedOut"); // Clear the flag
      setInitialCheckDone(true);
      return;
    }

    const checkAuth = async () => {
      try {
        // Set a timeout to prevent hanging if the server doesn't respond
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Auth request timeout")), 5000)
        );

        // Race the actual request against the timeout
        const response = await Promise.race([
          axios.get("/user/me", { withCredentials: true }),
          timeoutPromise,
        ]);

        if (response.data?.user) {
          // Ensure we have a valid user object with _id
          if (response.data.user && response.data.user._id) {
            dispatch(setUser(response.data.user)); // Restore user session
          } else {
            console.error("Invalid user data received:", response.data.user);
            dispatch(clearUser());
          }
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        dispatch(clearUser());
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkAuth(); // Run this once when app loads if user didn't explicitly log out

    // Set up a periodic check to ensure session is still valid
    const intervalId = setInterval(() => {
      // Only check if we're not on login/signup pages
      if (!["/login", "/signup"].includes(window.location.pathname)) {
        checkAuth();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (isAuthLoading && !initialCheckDone) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
};

const App = () => {
  // Run sanitization on app load to prevent data leakage
  useEffect(() => {
    // Import dynamically to avoid circular dependencies
    import("./utils/authUtils").then(({ sanitizeStorageOnLoad }) => {
      sanitizeStorageOnLoad();
    });
  }, []);

  return (
    <BrowserRouter>
      <PersistAuth>
        <AppRoutes />
      </PersistAuth>
    </BrowserRouter>
  );
};

export default App;
