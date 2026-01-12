import axios from "axios";

// Vite uses import.meta.env to access environment variables
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL, // This will be your Render URL in production
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
