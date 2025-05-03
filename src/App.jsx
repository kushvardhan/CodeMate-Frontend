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
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import NotFoundPage from "./components/NotFoundPage";
import ProfilePage from "./components/ProfilePage";
import Request from "./components/Request";
import SignupPage from "./components/SignupPage";
import Connection from "./components/Connection";
import { setUser } from "./slice/UserSlice";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useSelector((state) => state.user);
  const location = useLocation();

  if (isAuthLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
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
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Request /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><Connection /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </AnimatePresence>
  );
};

// Auth persistence
const PersistAuth = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("/user/me", { withCredentials: true });
          if (response.data?.user) {
            dispatch(setUser(response.data.user));
          }
        }
      } catch (error) {
        console.error("Auth restore failed:", error);
        localStorage.removeItem("token");
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [dispatch, isAuthenticated]);

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <PersistAuth>
        <AppRoutes />
      </PersistAuth>
    </BrowserRouter>
  );
};

export default App;
