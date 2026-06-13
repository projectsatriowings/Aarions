import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Admin Access Token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("aarions_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept expired administrative tokens
api.interceptors.response.use(
  (error) => Promise.reject(error), // response interceptor success placeholder
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/refresh") {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${API_BASE_URL}/admin/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = res.data;

        localStorage.setItem("aarions_admin_token", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("aarions_admin_token");
        localStorage.removeItem("aarions_admin_user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Override placeholder response interceptor with the real one
api.interceptors.response.handlers = [];
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/refresh") {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${API_BASE_URL}/admin/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = res.data;

        localStorage.setItem("aarions_admin_token", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("aarions_admin_token");
        localStorage.removeItem("aarions_admin_user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const getImageUrl = (url) => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const serverRoot = API_BASE_URL.replace(/\/api$/, "");
  return `${serverRoot}${url}`;
};

export default api;
