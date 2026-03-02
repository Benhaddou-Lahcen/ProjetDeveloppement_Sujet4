import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api"
});

// Add token to all requests if available
apiClient.interceptors.request.use((config) => {
  const authState = localStorage.getItem("auth_state");
  if (authState) {
    try {
      const { token } = JSON.parse(authState);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore parsing errors
    }
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      localStorage.removeItem("auth_state");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

