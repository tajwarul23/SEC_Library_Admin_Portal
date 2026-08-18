import axios from "axios";

// Real Express backend — httpOnly cookie auth (auth_token, 1hr session).
// withCredentials is required for the cookie to be sent/received cross-origin.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Response Interceptor: unwrap data, standardize errors, handle session expiry.
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred";

    // Backend session cookie is invalid/expired (1hr TTL, no refresh token).
    // Clear the cached admin and bounce to /login rather than let every
    // failed call surface a confusing error.
    if (status === 401 && !window.location.pathname.startsWith("/login")) {
      localStorage.removeItem("sec_library_admin");
      window.location.href = "/login";
    }

    const customError = new Error(message);
    customError.status = status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);
