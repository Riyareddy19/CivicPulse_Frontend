
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import IssueMap from "../components/IssueMap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AREAS = [
  "Kukatpally",
  "Madhapur",
  "Gachibowli",
  "Banjara Hills",
  "Secunderabad"
];

const CATEGORIES = [
  "Potholes",
  "Streetlights",
  "Garbage",
  "Water leakage",
  "Drainage"
];

const SEVERITIES = [
  { value: 1, title: "Minor" },
  { value: 2, title: "Low" },
  { value: 3, title: "Moderate" },
  { value: 4, title: "Serious" },
  { value: 5, title: "Critical" }
];

function CitizenPage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      alert("Logout failed. Please try again.");
    }
  };
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    reporterName: "",
    category: "Potholes",
    description: "",
    area: "Kukatpally",
    severity: 3
  });

  async function loadIssues() {
    try {
      const response = await api.get("/issues");
      setIssues(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Couldn't load reports. Check that the backend is running.");
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  const recentIssues = useMemo(() => {
    return [...issues].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    }).slice(0, 6);
  }, [issues]);

  const areaStats = useMemo(() => {
    return AREAS.map((area) => {
      const areaIssues = issues.filter(
        (issue) => issue.area?.toLowerCase() === area.toLowerCase()
      );

      return {
        area,
        total: areaIssues.length,
        high: areaIssues.filter(
          (issue) => issue.priorityLevel === "High"
        ).length
      };
    }).sort((a, b) => b.total - a.total);
  }, [issues]);

  const maxAreaCount = Math.max(
    1,
    ...areaStats.map((area) => area.total)
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          message: "Please sign in before submitting a civic issue.",
        },
      });
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const csrfResponse = await api.get("/auth/csrf");
      const csrf = csrfResponse.data;

      await api.post(
        "/issues",
        {
          ...form,
          reporterName: user.fullName,
          description: form.description.trim(),
          severity: Number(form.severity),
        },
        {
          headers: {
            [csrf.headerName]: csrf.token,
          },
        }
      );

      setMessage("Your report has been submitted successfully!");

      setForm({
        reporterName: user.fullName,
        category: "Potholes",
        description: "",
        area: "Kukatpally",
        severity: 3,
      });

      await loadIssues();
    } catch (err) {
      console.error("Report submission failed:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
        "Unable to submit your report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="cp-page">

      {/* Top navigation */}
      <header className="cp-header">
        <Link to="/" className="cp-brand">
          <span className="cp-logo">CP</span>
          <span className="cp-brand-copy">
            <strong>CivicPulse</strong>
            <small>SMART CIVIC ISSUE MANAGEMENT</small>
          </span>
        </Link>

        <nav className="cp-auth-nav">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="cp-admin-link">
                Sign in
              </Link>
              <Link to="/register" className="cp-nav-register">
                Create account
              </Link>
            </>
          ) : (
            <>
              <span className="cp-user-greeting">
                Hi, {user.fullName}
              </span>

              {isAdmin && (
                <Link to="/admin" className="cp-admin-link">
                  Admin Dashboard
                </Link>
              )}

              <button
                type="button"
                className="cp-admin-link cp-logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>


      <main className="cp-main">
        {/* Hero banner */}
        <section className="cp-hero">
          <div>
            <span className="cp-eyebrow">
              YOUR NEIGHBOURHOOD, BETTER
            </span>
            <h1>Make your city work better.</h1>
            <p>
              Report civic issues, help your community, and make a real difference.
            </p>
          </div>

          <div className="cp-tracked">
            <span className="cp-live-dot" />
            <strong>{issues.length.toString().padStart(2, "0")}</strong>
            <span>reports tracked</span>
          </div>
        </section>

        {error && (
          <div className="cp-alert cp-alert-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="cp-alert cp-alert-success" role="status">
            ✓ {message}
          </div>
        )}

        {/* Report form + map */}
        <section className="cp-main-grid">
          <article className="cp-panel cp-report-panel">
            <div className="cp-panel-heading">
              <div className="cp-heading-icon">♧</div>
              <div>
                <h2>Report a civic issue</h2>
                <p>
                  Share the details of the problem so we can get it to the right department.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="cp-form">
              <div className="cp-field">
                <label htmlFor="reporterName">Your Name</label>
                <input
                  id="reporterName"
                  name="reporterName"
                  value={isAuthenticated ? user.fullName : form.reporterName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  maxLength={100}
                  required
                  readOnly={isAuthenticated}
                />
              </div>

              <div className="cp-two-fields">
                <div className="cp-field">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cp-field">
                  <label htmlFor="area">Area</label>
                  <select
                    id="area"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                  >
                    {AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="cp-field">
                <div className="cp-label-row">
                  <label htmlFor="description">Description</label>
                  <span>{form.description.length}/2000</span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the issue, location and any additional details..."
                  maxLength={2000}
                  rows={4}
                  required
                />
              </div>

              <fieldset className="cp-severity-field">
                <legend>Severity</legend>
                <div className="cp-severity-options">
                  {SEVERITIES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={
                        Number(form.severity) === item.value
                          ? "cp-severity-option selected"
                          : "cp-severity-option"
                      }
                      aria-pressed={Number(form.severity) === item.value}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          severity: item.value
                        }))
                      }
                    >
                      <strong>{item.value}</strong>
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <button
                type="submit"
                className="cp-submit-button"
                disabled={loading}
              >
                {loading ? "Submitting report..." : "➤  Submit report  →"}
              </button>

              <div className="cp-form-note">
                <span>ⓘ</span>
                Priority is calculated automatically from severity, repeated reports and area impact.
              </div>
            </form>
          </article>

          <article className="cp-panel cp-map-panel">
            <div className="cp-panel-heading cp-map-heading">
              <div className="cp-heading-icon">⌖</div>
              <div className="cp-heading-copy">
                <h2>Live community map</h2>
                <p>See where issues are reported across the city.</p>
              </div>
              <span className="cp-count-pill">
                {issues.length} reports
              </span>
            </div>

            <div className="cp-map-frame">
              <IssueMap issues={issues} />
            </div>

            <div className="cp-map-legend">
              <span><i className="legend-dot high" /> High priority</span>
              <span><i className="legend-dot medium" /> Medium priority</span>
              <span><i className="legend-dot low" /> Low priority</span>
              <span><i className="legend-area" /> Affected area</span>
            </div>

            <div className="cp-area-heading">
              <h3>Area summary</h3>
              <span>{areaStats.filter((area) => area.total > 0).length} active areas</span>
            </div>

            <div className="cp-area-list">
              {areaStats.map((area) => {
                const percentage = Math.round(
                  (area.total / maxAreaCount) * 100
                );

                return (
                  <div className="cp-area-row" key={area.area}>
                    <span className="cp-area-pin">⌖</span>
                    <strong>{area.area}</strong>
                    <span className="cp-area-total">
                      {area.total} {area.total === 1 ? "report" : "reports"}
                    </span>
                    <div className="cp-area-track">
                      <span style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="cp-area-percent">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        {/* Recent reports */}
        <section className="cp-panel cp-recent-panel">
          <div className="cp-recent-heading">
            <div className="cp-panel-heading">
              <div className="cp-heading-icon">◷</div>
              <div>
                <h2>Recent reports</h2>
                <p>Latest civic issues from your community.</p>
              </div>
            </div>
            <Link to="/reports" className="cp-view-all">
              View all →
            </Link>
          </div>

          {recentIssues.length === 0 ? (
            <div className="cp-empty-state">
              <span>⌖</span>
              <strong>No reports yet</strong>
              <p>Submit the first report to get your community started.</p>
            </div>
          ) : (
            <div className="cp-recent-list">
              {recentIssues.map((issue) => (
                <div className="cp-recent-row" key={issue.id}>
                  <div className="cp-recent-category-icon">
                    {getCategoryIcon(issue.category)}
                  </div>

                  <div className="cp-recent-name">
                    <strong>{issue.category}</strong>
                    <span>⌖ {issue.area}</span>
                  </div>

                  <p className="cp-recent-description">
                    {issue.description}
                  </p>

                  <span
                    className={`cp-status ${getStatusClass(issue.status)}`}
                  >
                    {issue.status}
                  </span>

                  <span
                    className={`cp-priority ${String(issue.priorityLevel || "Low").toLowerCase()}`}
                  >
                    {issue.priorityLevel || "Low"}
                  </span>

                  <span className="cp-recent-score">
                    Score <strong>{issue.priorityScore ?? "—"}</strong>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="cp-footer">
          <span>© CivicPulse</span>
          <span>Smarter reports. Stronger communities.</span>
        </footer>
      </main>
    </div>
  );
}

function getCategoryIcon(category) {
  switch (category) {
    case "Potholes":
      return "▰";
    case "Streetlights":
      return "♧";
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

function getStatusClass(status) {
  switch (status) {
    case "Pending":
      return "pending";
    case "In Progress":
      return "in-progress";
    case "Resolved":
      return "resolved";
    default:
      return "";
  }
}

export default CitizenPage;