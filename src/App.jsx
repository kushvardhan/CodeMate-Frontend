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
import Chats from "./components/Chats";
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

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get("/user/me", {
          withCredentials: true,
        });

        if (response.data?.user && response.data.user._id) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(clearUser());
          localStorage.setItem("wasLoggedOut", "true");
        }
      } catch (authError) {
        console.log("Auth verification failed:", authError.message);
        dispatch(clearUser());
        localStorage.setItem("wasLoggedOut", "true");
      } finally {
        setIsVerifying(false);
      }
    };

    // Only verify if we don't have a user or if we're still loading
    if (!user || isAuthLoading) {
      verifyAuth();
    } else {
      setIsVerifying(false);
    }
  }, [dispatch, user, isAuthLoading]);

  if (isVerifying || isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated && user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// Public Route - Enhanced to check for valid token
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading, user } = useSelector(
    (state) => state.user
  );
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        // Check if there's a valid token by making an API call
        const response = await axios.get("/user/me", {
          withCredentials: true,
        });

        if (response.data?.user && response.data.user._id) {
          // Valid token found, update user state and redirect
          dispatch(setUser(response.data.user));
          setIsCheckingToken(false);
          return;
        }
      } catch (error) {
        // No valid token, clear any stale auth state
        console.log(error);
        dispatch(clearUser());
      }
      setIsCheckingToken(false);
    };

    checkTokenAndRedirect();
  }, [dispatch]);

  if (isAuthLoading || isCheckingToken) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated with valid token, redirect to home
  return isAuthenticated && user ? <Navigate to="/" replace /> : children;
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
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:userId"
          element={
            <ProtectedRoute>
              <Chats />
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
    const wasLoggedOut = localStorage.getItem("wasLoggedOut") === "true";

    if (wasLoggedOut) {
      dispatch(clearUser());
      localStorage.removeItem("wasLoggedOut");
      setInitialCheckDone(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Auth request timeout")), 5000)
        );

        const response = await Promise.race([
          axios.get("/user/me", { withCredentials: true }),
          timeoutPromise,
        ]);

        if (response.data?.user && response.data.user._id) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        console.log(err);
        dispatch(clearUser());
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkAuth();

    const intervalId = setInterval(() => {
      if (!["/login", "/signup"].includes(window.location.pathname)) {
        checkAuth();
      }
    }, 5 * 60 * 1000);

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
  useEffect(() => {
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
