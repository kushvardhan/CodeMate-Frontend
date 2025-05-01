import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import axios from "./api/axios";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import { setUser } from "./slice/UserSlice";
import { store } from "./store/store.js";

// Check for authentication on app load
const AppWithAuth = () => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:4000/profile", {
          withCredentials: true, // Ensure cookies are sent
        });

        if (response.data && response.data.data) {
          store.dispatch(setUser(response.data.data));
        }
      } catch (error) {
        console.log("User not authenticated");
        localStorage.removeItem("token"); // Clear any invalid tokens
      }
    };

    checkAuth();
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppWithAuth />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
