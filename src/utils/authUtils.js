/**
 * Utility functions for authentication
 */

/**
 * Completely clears all client-side auth data
 * This ensures no user data persists after logout
 */
export const clearAuthData = () => {
  // Clear localStorage
  localStorage.removeItem("token");
  
  // Clear all cookies by setting them to expire
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.split("=");
    if (name) {
      document.cookie = `${name.trim()}=;expires=${new Date(0).toUTCString()};path=/`;
    }
  });
  
  // Clear any sessionStorage items if used
  sessionStorage.clear();
  
  // Force reload the page to ensure all state is cleared
  // This is the most reliable way to reset all Redux state
  window.location.href = "/login";
};
