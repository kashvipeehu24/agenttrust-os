import axios from "axios";

// In production the frontend and API are expected to share an origin (or be
// connected by a reverse proxy).  Falling back to localhost makes a deployed
// browser call the *user's* machine instead of the deployed API.
const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000" : "");

const api = axios.create({
  baseURL,
  // A request that never reaches the API must become an actionable UI error.
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const message = error.response?.data?.detail
      || error.message
      || "The API request failed.";

    return Promise.reject(new Error(message));
  },
);

export default api;
