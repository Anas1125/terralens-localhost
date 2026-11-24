import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let logoutTimer = null;

export const scheduleTokenLogout = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }

  const token = localStorage.getItem("adminToken");

  if (!token) return;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(Uint8Array.from(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)))
    );

    const expiresAt = payload.exp * 1000;
    const timeUntilExpiry = expiresAt - Date.now();

    if (timeUntilExpiry <= 0) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
      return;
    }

    logoutTimer = setTimeout(() => {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }, timeUntilExpiry);
  } catch (error) {
    console.error("Failed to schedule token expiry:", error);
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");

      if (
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;