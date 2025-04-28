import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import NotFoundPage from "./components/NotFoundPage";
import ProfilePage from "./components/ProfilePage";
import SignupPage from "./components/SignupPage";

// Protected Route component - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();
  if (!isAuthenticated) {
    // Redirect to login if not authenticated, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route component - redirects to home if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  if (isAuthenticated) {
    // Redirect to home if already authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

// NotFound Route component - shows NotFoundPage for invalid routes
const NotFoundRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, show the NotFoundPage
  return <NotFoundPage />;
};

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
          path="/connections"
          element={
            <ProtectedRoute>
              <NotFoundPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <NotFoundPage />
            </ProtectedRoute>
          }
        />

        {/* Not Found Page - shown for invalid routes */}
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </AnimatePresence>
  );
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

// PersistAuth component - checks for token and sets user state on page load/refresh
const PersistAuth = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    // Only try to restore auth if not already authenticated
    if (!isAuthenticated) {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");

        // If token exists, try to validate it and get user data
        if (token) {
          try {
            // Call the API to get current user data
            const response = await axios.get("/user/me", {
              withCredentials: true,
            });

            // If successful, set the user in Redux state
            if (response.data && response.data.user) {
              dispatch(setUser(response.data.user));
            }
          } catch (error) {
            console.error("Error restoring auth:", error);
            // If token is invalid, clear it
            localStorage.removeItem("token");
          }
        }
      };

      checkAuth();
    }
  }, [dispatch, isAuthenticated]);

  return children;
};

export default App;
