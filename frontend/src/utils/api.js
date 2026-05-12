import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE ||
  // fallback to dev proxy (/api -> backend)
  "/api/v1";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

