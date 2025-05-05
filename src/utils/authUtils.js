/**
 * Utility functions for authentication
 */

/**
 * Completely clears all client-side auth data
 * This ensures no user data persists after logout
 */
export const clearAuthData = () => {
  // Set flag to prevent auto-login on page refresh
  localStorage.setItem("wasLoggedOut", "true");

  // Clear localStorage except for the wasLoggedOut flag
  const wasLoggedOut = localStorage.getItem("wasLoggedOut");
  localStorage.clear();
  localStorage.setItem("wasLoggedOut", wasLoggedOut);

  // Clear all cookies by setting them to expire
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.split("=");
    if (name) {
      document.cookie = `${name.trim()}=;expires=${new Date(
        0
      ).toUTCString()};path=/`;
    }
  });

  // Clear any sessionStorage items if used
  sessionStorage.clear();

  // Force reload the page to ensure all state is cleared
  // This is the most reliable way to reset all Redux state
  window.location.href = "/login";
};

/**
 * Checks if there's any user data in localStorage or sessionStorage
 * and clears it if found. This helps prevent data leakage between sessions.
 */
export const sanitizeStorageOnLoad = () => {
  // Check if we're on a public route (login or signup)
  const isPublicRoute =
    window.location.pathname === "/login" ||
    window.location.pathname === "/signup";

  // If we're on a public route, make sure no user data is in storage
  if (isPublicRoute) {
    // Look for any keys that might contain user data
    const userDataKeys = Object.keys(localStorage).filter(
      (key) =>
        key.includes("user") ||
        key.includes("auth") ||
        key.includes("token") ||
        key.includes("persist") ||
        key.includes("state")
    );

    // If we find any user data keys (except wasLoggedOut), clear everything
    if (userDataKeys.length > 0 && !userDataKeys.includes("wasLoggedOut")) {
      const wasLoggedOut = localStorage.getItem("wasLoggedOut");
      localStorage.clear();
      if (wasLoggedOut) {
        localStorage.setItem("wasLoggedOut", wasLoggedOut);
      }
    }

    // Also check sessionStorage
    const sessionUserDataKeys = Object.keys(sessionStorage).filter(
      (key) =>
        key.includes("user") ||
        key.includes("auth") ||
        key.includes("token") ||
        key.includes("persist") ||
        key.includes("state")
    );

    if (sessionUserDataKeys.length > 0) {
      sessionStorage.clear();
    }
  }
};
