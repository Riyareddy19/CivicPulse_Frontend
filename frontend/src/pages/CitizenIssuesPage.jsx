
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function CitizenIssuesPage() {
  const { user, isAdmin } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function loadIssues() {
      try {
        const response = await api.get("/issues");
        setIssues(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Couldn't load reports. Check that the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, []);

  if (isAdmin) {
    return (
      <div className="citizen-redirect-message">
        <p>Redirecting to the admin dashboard...</p>
        <Link to="/admin">Go to Admin Dashboard</Link>
      </div>
    );
  }

  const filteredIssues =
    filter === "All"
      ? issues
      : issues.filter((issue) => issue.status === filter);

  const pendingCount = issues.filter(
    (issue) => issue.status === "Pending"
  ).length;

  const progressCount = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const resolvedCount = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  function getCategoryIcon(category) {
    switch (category) {
      case "Potholes":
        return "▰";
      case "Streetlights":
        return "☼";
      case "Garbage":
        return "♻";
      case "Water leakage":
        return "≈";
      case "Drainage":
        return "≋";
      default:
        return "●";
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "Pending":
        return "citizen-status-pending";
      case "In Progress":
        return "citizen-status-progress";
      case "Resolved":
        return "citizen-status-resolved";
      default:
        return "";
    }
  }

  function getPriorityClass(priority) {
    switch (String(priority || "Low").toLowerCase()) {
      case "high":
        return "citizen-priority-high";
      case "medium":
        return "citizen-priority-medium";
      default:
        return "citizen-priority-low";
    }
  }

  return (
    <div className="citizen-reports-page">
      <header className="citizen-reports-header">
        <Link to="/" className="citizen-reports-brand">
          <span className="citizen-reports-logo">CP</span>
          <span className="citizen-reports-brand-text">
            <strong>CivicPulse</strong>
            <small>SMART CIVIC ISSUE MANAGEMENT</small>
          </span>
        </Link>

        <nav className="citizen-reports-nav">
          {user && (
            <span className="citizen-reports-greeting">
              Hi, {user.fullName}
            </span>
          )}

          <Link to="/" className="citizen-back-button">
            ← Back to Home
          </Link>
        </nav>
      </header>

      <main className="citizen-reports-main">
        <section className="citizen-reports-hero">
          <div className="citizen-reports-hero-copy">
            <span className="citizen-reports-eyebrow">
              COMMUNITY TRANSPARENCY
            </span>

            <h1>Community Reports</h1>

            <p>
              Stay informed about civic issues in your community
              and follow their progress toward resolution.
            </p>

            <Link to="/" className="citizen-submit-button">
              + Report an Issue
            </Link>
          </div>

          <div className="citizen-reports-hero-icon" aria-hidden="true">
            <span>⌖</span>
            <small>Better communities start here</small>
          </div>
        </section>

        <section className="citizen-report-stats">
          <div className="citizen-stat-card">
            <span className="citizen-stat-icon total">▤</span>
            <div>
              <span>Total Reports</span>
              <strong>{issues.length}</strong>
            </div>
          </div>

          <div className="citizen-stat-card">
            <span className="citizen-stat-icon pending">◷</span>
            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="citizen-stat-card">
            <span className="citizen-stat-icon progress">↻</span>
            <div>
              <span>In Progress</span>
              <strong>{progressCount}</strong>
            </div>
          </div>

          <div className="citizen-stat-card">
            <span className="citizen-stat-icon resolved">✓</span>
            <div>
              <span>Resolved</span>
              <strong>{resolvedCount}</strong>
            </div>
          </div>
        </section>

        <section className="citizen-reports-content">
          <div className="citizen-reports-section-heading">
            <div>
              <span className="citizen-reports-eyebrow">
                LIVE COMMUNITY UPDATES
              </span>
              <h2>Reported Issues</h2>
              <p>Browse reported issues and their current status.</p>
            </div>

            <span className="citizen-report-count">
              {filteredIssues.length} reports
            </span>
          </div>

          <div className="citizen-report-filters">
            {["All", "Pending", "In Progress", "Resolved"].map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  className={
                    filter === status
                      ? "citizen-filter-button active"
                      : "citizen-filter-button"
                  }
                  onClick={() => setFilter(status)}
                >
                  {status}
                  {status === "All" && (
                    <span>{issues.length}</span>
                  )}
                </button>
              )
            )}
          </div>

          {loading && (
            <div className="citizen-reports-feedback">
              <span className="citizen-loading-spinner" />
              <p>Loading community reports...</p>
            </div>
          )}

          {!loading && error && (
            <div className="citizen-reports-error" role="alert">
              <strong>Unable to load reports</strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredIssues.length === 0 && (
            <div className="citizen-reports-empty">
              <span>▤</span>
              <h3>
                {issues.length === 0
                  ? "No reports yet"
                  : "No reports in this category"}
              </h3>
              <p>
                {issues.length === 0
                  ? "Be the first to report a civic issue in your community."
                  : "Try selecting another status to see more reports."}
              </p>

              {issues.length === 0 && (
                <Link to="/" className="citizen-submit-button">
                  Report an Issue
                </Link>
              )}
            </div>
          )}

          {!loading && !error && filteredIssues.length > 0 && (
            <div className="citizen-report-grid">
              {filteredIssues.map((issue) => (
                <article
                  className="citizen-report-card"
                  key={issue.id}
                >
                  <div className="citizen-report-card-top">
                    <div className="citizen-report-category-icon">
                      {getCategoryIcon(issue.category)}
                    </div>

                    <span
                      className={`citizen-report-priority ${getPriorityClass(
                        issue.priorityLevel
                      )}`}
                    >
                      <span />
                      {issue.priorityLevel || "Low"} Priority
                    </span>
                  </div>

                  <div className="citizen-report-card-heading">
                    <h3>{issue.category || "Civic Issue"}</h3>
                    <span className="citizen-report-id">
                      Report #{issue.id}
                    </span>
                  </div>

                  <div className="citizen-report-location">
                    <span aria-hidden="true">⌖</span>
                    {issue.area || "Location not specified"}
                  </div>

                  <p className="citizen-report-description">
                    {issue.description || "No description provided."}
                  </p>

                  <div className="citizen-report-card-footer">
                    <span
                      className={`citizen-report-status ${getStatusClass(
                        issue.status
                      )}`}
                    >
                      <span />
                      {issue.status || "Pending"}
                    </span>

                    <span className="citizen-report-reporter">
                      Reported by {issue.reporterName || "Citizen"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="citizen-reports-footer">
          <span>
            <strong>CivicPulse</strong> · Smart Civic Issue Management
          </span>
          <span>Working together for better communities.</span>
        </footer>
      </main>
    </div>
  );
}

export default CitizenIssuesPage;
