import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // enables cookies to be sent
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("aarions_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle expired tokens and refresh them
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Exclude public auth endpoints from token refresh attempts
    const isPublicAuthEndpoint = 
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/google") ||
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/auth/forgotpassword") ||
      originalRequest.url.includes("/auth/resetpassword");

    if (error.response?.status === 401 && !originalRequest._retry && !isPublicAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = res.data;

        localStorage.setItem("aarions_access_token", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem("aarions_access_token");
        localStorage.removeItem("aarions_user");
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
