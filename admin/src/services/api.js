import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/admin",
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/refresh") {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:5000/api/admin/auth/refresh",
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
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  return `http://localhost:5000${url}`;
};

export default api;
