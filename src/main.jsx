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
        // Try to get user profile to check if authenticated
        const response = await axios.get("/profile", {
          withCredentials: true,
        });

        if (response.data && response.data.data) {
          // If successful, set the user in Redux
          store.dispatch(setUser(response.data.data));
        }
      } catch (error) {
        // If error, user is not authenticated (this is expected for logged out users)
        console.log("User not authenticated");
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
