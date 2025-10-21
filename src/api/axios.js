import axios from "axios";

const api = axios.create({
  baseURL: "https://code-mate-backend-seven.vercel.app",
  withCredentials: true, // Ensure cookies are sent with every request
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized: Session expired or invalid.");
      // Do not clear the token or redirect here; let the session verification handle it
    }
    return Promise.reject(error);
  }
);

export default api;
