import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import SignupPage from "./components/SignupPage";

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/login", "/signup"];

    if (!token && !publicRoutes.includes(location.pathname)) {
      navigate("/login"); // Redirect to login if not logged in and accessing a restricted page
    }
  }, [location, navigate]);

  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
