import axios from "axios";

// Base URL — in dev, Vite proxy forwards /api to localhost:5000
// In production, set VITE_API_URL in your .env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
