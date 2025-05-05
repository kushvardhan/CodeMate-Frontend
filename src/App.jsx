// src/App.jsx
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
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
import Connection from "./components/Connection";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import NotFoundPage from "./components/NotFoundPage";
import ProfilePage from "./components/ProfilePage";
import Request from "./components/Request";
import SignupPage from "./components/SignupPage";
import UserInfo from "./components/UserInfo";
import { clearUser, setUser } from "./slice/UserSlice.js";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useSelector((state) => state.user);
  const location = useLocation();

  if (isAuthLoading) return <div>Loading...</div>;

  return isAuthenticated ? (
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
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </AnimatePresence>
  );
};

// Auth persistence
const PersistAuth = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthLoading } = useSelector((state) => state.user);

  useEffect(() => {
    // Check if user explicitly logged out (we'll set this flag in localStorage)
    const wasLoggedOut = localStorage.getItem("wasLoggedOut") === "true";

    // If user explicitly logged out, don't try to restore the session
    if (wasLoggedOut) {
      dispatch(clearUser());
      localStorage.removeItem("wasLoggedOut"); // Clear the flag
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await axios.get("/user/me", {
          withCredentials: true,
        });

        if (response.data?.user) {
          dispatch(setUser(response.data.user)); // Restore user session
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        dispatch(clearUser());
      }
    };

    checkAuth(); // Run this once when app loads if user didn't explicitly log out
  }, [dispatch]);

  if (isAuthLoading) {
    return <div>Loading...</div>;
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
