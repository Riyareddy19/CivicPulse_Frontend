
import api from "./api";

export async function getCsrfToken() {
  const response = await api.get("/auth/csrf");
  return response.data;
}

export async function registerUser(userData) {
  const csrf = await getCsrfToken();

  const response = await api.post("/auth/register", userData, {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  });

  return response.data;
}

export async function loginUser(credentials) {
  const csrf = await getCsrfToken();

  const response = await api.post("/auth/login", credentials, {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  });

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function logoutUser() {
  const csrf = await getCsrfToken();

  const response = await api.post("/auth/logout", {}, {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  });

  return response.data;
}
