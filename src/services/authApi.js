import { apiClient } from "./apiClient.js";

export async function loginApi(credentials) {
  return apiClient.post("/admin/login", credentials);
}

export async function logoutApi() {
  return apiClient.post("/admin/logout");
}

// GET /api/admin/me — validates the auth_token cookie server-side.
export async function getMeApi() {
  return apiClient.get("/admin/me");
}

// POST /api/admin/guest — one-click read-only visit (no account needed).
export async function guestLoginApi() {
  return apiClient.post("/admin/guest");
}
