
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import CitizenPage from "./pages/CitizenPage";
import AdminPage from "./pages/AdminPage";
import AdminIssuesPage from "./pages/AdminIssuesPage";
import AdminMapPage from "./pages/AdminMapPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CitizenIssuesPage from "./pages/CitizenIssuesPage";

import "./index.css";

function ProtectedAdminRoute({ children }) {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <p>Checking your account...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function CitizenRoute({ children }) {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return <p>Checking your account...</p>;
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <CitizenRoute>
            <CitizenPage />
          </CitizenRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/issues"
        element={
          <ProtectedAdminRoute>
            <AdminIssuesPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/map"
        element={
          <ProtectedAdminRoute>
            <AdminMapPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedAdminRoute>
            <AdminAnalyticsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <CitizenRoute>
            <CitizenIssuesPage />
          </CitizenRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
