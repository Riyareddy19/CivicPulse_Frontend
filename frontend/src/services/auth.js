
import api from "./api";

// Get a CSRF token before sending a protected request.
export async function getCsrfToken() {
  const response = await api.get("/auth/csrf");
  return response.data;
}

// Register a new citizen account.
export async function registerUser(userData) {
  const csrf = await getCsrfToken();

  const response = await api.post("/auth/register", userData, {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  });

  return response.data;
}

// Log in an existing user.
export async function loginUser(credentials) {
  const csrf = await getCsrfToken();

  const response = await api.post("/auth/login", credentials, {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  });

  return response.data;
}

// Get the currently authenticated user.
export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data;
}

// Log out the current user.
export async function logoutUser() {
  const csrf = await getCsrfToken();

  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        [csrf.headerName]: csrf.token,
      },
    }
  );

  return response.data;
}
