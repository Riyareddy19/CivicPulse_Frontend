
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminPage() {
  const [issues, setIssues] = useState([]);

  const [stats, setStats] = useState({
    totalIssues: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });

  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      const [issueResponse, statsResponse] =
        await Promise.all([
          api.get("/issues"),
          api.get("/issues/stats")
        ]);

      setIssues(issueResponse.data);
      setStats(statsResponse.data);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load data. Please check that the backend is running."
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/issues/${id}/status`, {
        status
      });

      setSuccess("Issue status updated!");
      setError("");

      await loadData();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Unable to update issue status."
      );
    }
  }

  const filteredIssues =
    filter === "All"
      ? issues
      : issues.filter((issue) => issue.status === filter);

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            CP
          </div>

          <div>
            <h1>CivicPulse</h1>
            <span>Smart Civic Platform</span>
          </div>

        </div>


        <nav className="sidebar-nav">

  <p className="nav-title">
    MAIN MENU
  </p>

  <Link
    to="/admin"
    className="sidebar-nav-item active"
  >
    <span>⌂</span>
    Dashboard
  </Link>

  <Link
    to="/admin/issues"
    className="sidebar-nav-item"
  >
    <span>▣</span>
    Issues
  </Link>

  <Link
    to="/admin/map"
    className="sidebar-nav-item"
  >
    <span>⌖</span>
    Map
  </Link>

  <Link
    to="/admin/analytics"
    className="sidebar-nav-item"
  >
    <span>◔</span>
    Analytics
  </Link>

</nav>


        <div className="sidebar-bottom">

          <div className="sidebar-info">
            <span className="sidebar-info-icon">
              ✓
            </span>

            <div>
              <strong>System Active</strong>
              <span>All services running</span>
            </div>
          </div>

          <Link
            to="/"
            className="sidebar-citizen-link"
          >
            ← Citizen Portal
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div>
            <span className="breadcrumb">
              CivicPulse / Dashboard
            </span>

            <h2>
              Civic Operations
            </h2>
          </div>

          <div className="admin-profile">

            <div className="profile-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>

          </div>

        </header>


        {/* INTRO */}

        <section className="dashboard-intro">

          <div>

            <p className="dashboard-kicker">
              COMMUNITY OVERVIEW
            </p>

            <h3>
              Monitor and prioritize civic issues.
            </h3>

            <p>
              Review reported problems and track their
              resolution across the community.
            </p>

          </div>

          <button
            type="button"
            className="dashboard-refresh"
            onClick={loadData}
          >
            ↻ Refresh Data
          </button>

        </section>


        {/* ALERTS */}

        {error && (
          <div className="dashboard-alert error">
            {error}
          </div>
        )}

        {success && (
          <div className="dashboard-alert success">
            ✓ {success}
          </div>
        )}


        {/* KPI CARDS */}

        <section className="kpi-grid">

          <KpiCard
            label="Total Issues"
            value={stats.totalIssues}
            icon="▣"
            className="blue"
          />

          <KpiCard
            label="Pending"
            value={stats.pending}
            icon="◷"
            className="orange"
          />

          <KpiCard
            label="In Progress"
            value={stats.inProgress}
            icon="⚙"
            className="purple"
          />

          <KpiCard
            label="Resolved"
            value={stats.resolved}
            icon="✓"
            className="green"
          />

        </section>


        {/* PRIORITY OVERVIEW */}

        <section className="priority-panel">

          <div className="panel-heading">

            <div>
              <span className="panel-kicker">
                PRIORITY ANALYSIS
              </span>

              <h3>
                Issue Priority Overview
              </h3>

              <p>
                Current distribution based on CivicPulse priority scoring.
              </p>
            </div>

          </div>


          <div className="priority-bars">

            <PriorityBar
              label="High Priority"
              value={stats.highPriority}
              total={stats.totalIssues}
              className="high"
            />

            <PriorityBar
              label="Medium Priority"
              value={stats.mediumPriority}
              total={stats.totalIssues}
              className="medium"
            />

            <PriorityBar
              label="Low Priority"
              value={stats.lowPriority}
              total={stats.totalIssues}
              className="low"
            />

          </div>

        </section>


        {/* ISSUES */}

        <section className="issues-panel">

          <div className="issues-panel-header">

            <div>
              <span className="panel-kicker">
                ISSUE MANAGEMENT
              </span>

              <h3>
                Priority Issues
              </h3>

              <p>
                Review and manage reported civic problems.
              </p>
            </div>

            <span className="issue-total">
              {filteredIssues.length} Issues
            </span>

          </div>


          {/* FILTERS */}

          <div className="issue-toolbar">

            <div className="issue-filters">

              {[
                "All",
                "Pending",
                "In Progress",
                "Resolved"
              ].map((status) => (

                <button
                  key={status}
                  type="button"
                  className={
                    filter === status
                      ? "issue-filter active"
                      : "issue-filter"
                  }
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>

              ))}

            </div>

          </div>


          {/* ISSUE LIST */}

          <div className="issue-table">

            <div className="issue-table-head">

              <span>ISSUE</span>
              <span>LOCATION</span>
              <span>PRIORITY</span>
              <span>SCORE</span>
              <span>STATUS</span>
              <span>ACTION</span>

            </div>


            {filteredIssues.length === 0 ? (

              <div className="dashboard-empty">

                <div>
                  ◫
                </div>

                <h3>
                  No issues found
                </h3>

                <p>
                  There are no issues in this category.
                </p>

              </div>

            ) : (

              filteredIssues.map((issue) => (

                <div
                  className="issue-table-row"
                  key={issue.id}
                >

                  {/* ISSUE */}

                  <div className="issue-name">

                    <div className="issue-category-icon">
                      {getCategoryIcon(issue.category)}
                    </div>

                    <div>
                      <strong>
                        {issue.category}
                      </strong>

                      <span>
                        Reported by {issue.reporterName}
                      </span>
                    </div>

                  </div>


                  {/* LOCATION */}

                  <div className="issue-location">
                    <span>⌖</span>
                    {issue.area}
                  </div>


                  {/* PRIORITY */}

                  <div>

                    <span
                      className={`priority-pill ${
                        issue.priorityLevel?.toLowerCase()
                      }`}
                    >
                      {issue.priorityLevel}
                    </span>

                  </div>


                  {/* SCORE */}

                  <div className="issue-score">

                    <strong>
                      {issue.priorityScore}
                    </strong>

                    <span>
                      {issue.duplicateCount} similar
                    </span>

                  </div>


                  {/* STATUS */}

                  <div>

                    <span
                      className={`status-pill ${
                        issue.status
                          ?.toLowerCase()
                          .replace(" ", "-")
                      }`}
                    >
                      {issue.status}
                    </span>

                  </div>


                  {/* ACTION */}

                  <div>

                    <select
                      className="issue-status-select"
                      aria-label={`Update status for issue ${issue.id}`}
                      value={issue.status}
                      onChange={(e) =>
                        updateStatus(
                          issue.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                    </select>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>


        {/* FOOTER */}

        <footer className="dashboard-footer">
          CivicPulse · Smart Civic Issue Management
        </footer>

      </main>

    </div>
  );
}


/* =========================================
   KPI CARD
========================================= */

function KpiCard({
  label,
  value,
  icon,
  className
}) {
  return (
    <div className={`kpi-card ${className}`}>

      <div className="kpi-icon">
        {icon}
      </div>

      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>
      </div>

    </div>
  );
}


/* =========================================
   PRIORITY BAR
========================================= */

function PriorityBar({
  label,
  value,
  total,
  className
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div className="priority-bar-item">

      <div className="priority-bar-label">

        <span>
          <i className={`priority-indicator ${className}`} />
          {label}
        </span>

        <strong>
          {value}
          <small>
            {" "}({percentage}%)
          </small>
        </strong>

      </div>

      <div className="priority-track">

        <div
          className={`priority-fill ${className}`}
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  );
}


/* =========================================
   CATEGORY ICON
========================================= */

function getCategoryIcon(category) {

  switch (category) {

    case "Potholes":
      return "▰";

    case "Streetlights":
      return "◉";

    case "Garbage":
      return "▤";

    case "Water leakage":
      return "≈";

    case "Drainage":
      return "≋";

    default:
      return "●";
  }
}


export default AdminPage;
