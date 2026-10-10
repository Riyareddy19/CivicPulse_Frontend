import { BrowserRouter, Routes, Route } from "react-router-dom";

import CitizenPage from "./pages/CitizenPage";
import AdminPage from "./pages/AdminPage";
import AdminIssuesPage from "./pages/AdminIssuesPage";
import AdminMapPage from "./pages/AdminMapPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

import "./index.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Citizen Portal */}

        <Route
          path="/"
          element={<CitizenPage />}
        />


        {/* Admin Dashboard */}

        <Route
          path="/admin"
          element={<AdminPage />}
        />

        <Route
          path="/admin/issues"
          element={<AdminIssuesPage />}
        />

        <Route
          path="/admin/map"
          element={<AdminMapPage />}
        />

        <Route
          path="/admin/analytics"
          element={<AdminAnalyticsPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;