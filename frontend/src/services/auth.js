
import api from "./api";

// Fetch a CSRF token so the backend sets the XSRF-TOKEN cookie.
// api.js will read the cookie and attach the X-XSRF-TOKEN header.
export async function getCsrfToken() {
  await api.get("/auth/csrf");
}

export async function registerUser(userData) {
  await getCsrfToken();

  const response = await api.post("/auth/register", userData);
  return response.data;
}

export async function loginUser(credentials) {
  await getCsrfToken();

  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function logoutUser() {
  await getCsrfToken();

  const response = await api.post("/auth/logout", {});
  return response.data;
}
