import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminAnalyticsPage() {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState("");

  async function loadIssues() {
    try {
      const response = await api.get("/issues");
      setIssues(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load analytics. Please check the backend."
      );
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  const categoryStats = useMemo(() => {
    const counts = {};

    issues.forEach((issue) => {
      counts[issue.category] =
        (counts[issue.category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([category, count]) => ({
        category,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [issues]);

  const statusStats = useMemo(() => {
    return {
      pending: issues.filter(
        (issue) => issue.status === "Pending"
      ).length,

      inProgress: issues.filter(
        (issue) => issue.status === "In Progress"
      ).length,

      resolved: issues.filter(
        (issue) => issue.status === "Resolved"
      ).length
    };
  }, [issues]);

  const priorityStats = useMemo(() => {
    return {
      high: issues.filter(
        (issue) => issue.priorityLevel === "High"
      ).length,

      medium: issues.filter(
        (issue) => issue.priorityLevel === "Medium"
      ).length,

      low: issues.filter(
        (issue) => issue.priorityLevel === "Low"
      ).length
    };
  }, [issues]);

  const areaStats = useMemo(() => {
    const counts = {};

    issues.forEach((issue) => {
      counts[issue.area] =
        (counts[issue.area] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([area, count]) => ({
        area,
        count
      }))
      .sort((a, b) => b.count - a.count);
  }, [issues]);

  const resolutionRate =
    issues.length > 0
      ? Math.round(
          (statusStats.resolved / issues.length) * 100
        )
      : 0;

  const averagePriority =
    issues.length > 0
      ? Math.round(
          issues.reduce(
            (sum, issue) =>
              sum + (issue.priorityScore || 0),
            0
          ) / issues.length
        )
      : 0;

  const totalSimilarReports = issues.reduce(
    (sum, issue) =>
      sum + (issue.duplicateCount || 0),
    0
  );

  return (
    <div className="simple-admin-page">

      <header className="simple-admin-header">

        <div>

          <Link to="/admin" className="back-link">
            ← Dashboard
          </Link>

          <span className="page-kicker">
            CIVIC ANALYTICS
          </span>

          <h1>
            Analytics
          </h1>

          <p>
            Understand issue patterns, priority levels,
            and community impact.
          </p>

        </div>

        <button
          type="button"
          className="dashboard-refresh"
          onClick={loadIssues}
        >
          ↻ Refresh
        </button>

      </header>

      {error && (
        <div className="dashboard-alert error">
          {error}
        </div>
      )}

      {/* OVERVIEW */}

      <section className="analytics-overview">

        <AnalyticsMetric
          label="Total Reports"
          value={issues.length}
          description="All reported civic issues"
        />

        <AnalyticsMetric
          label="Resolution Rate"
          value={`${resolutionRate}%`}
          description="Issues marked resolved"
        />

        <AnalyticsMetric
          label="Average Priority"
          value={averagePriority}
          description="Average CivicPulse score"
        />

        <AnalyticsMetric
          label="Similar Reports"
          value={totalSimilarReports}
          description="Detected related reports"
        />

      </section>

      {/* MAIN ANALYTICS */}

      <section className="analytics-grid">

        {/* CATEGORY */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <span className="panel-kicker">
                ISSUE BREAKDOWN
              </span>

              <h2>
                By Category
              </h2>
            </div>

          </div>

          <div className="analytics-list">

            {categoryStats.length === 0 ? (
              <p className="analytics-empty">
                No issue data available.
              </p>
            ) : (
              categoryStats.map((item) => {

                const percentage =
                  issues.length > 0
                    ? Math.round(
                        (item.count / issues.length) *
                          100
                      )
                    : 0;

                return (
                  <div
                    className="analytics-row"
                    key={item.category}
                  >

                    <div className="analytics-row-top">

                      <strong>
                        {item.category}
                      </strong>

                      <span>
                        {item.count} ({percentage}%)
                      </span>

                    </div>

                    <div className="analytics-track">

                      <div
                        className="analytics-fill"
                        style={{
                          width: `${percentage}%`
                        }}
                      />

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

        {/* STATUS */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <span className="panel-kicker">
                WORKFLOW STATUS
              </span>

              <h2>
                Resolution Status
              </h2>
            </div>

          </div>

          <div className="status-analytics">

            <AnalyticsStatus
              label="Pending"
              value={statusStats.pending}
              total={issues.length}
              className="pending"
            />

            <AnalyticsStatus
              label="In Progress"
              value={statusStats.inProgress}
              total={issues.length}
              className="progress"
            />

            <AnalyticsStatus
              label="Resolved"
              value={statusStats.resolved}
              total={issues.length}
              className="resolved"
            />

          </div>

        </div>

        {/* PRIORITY */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <span className="panel-kicker">
                PRIORITY ENGINE
              </span>

              <h2>
                Priority Distribution
              </h2>
            </div>

          </div>

          <div className="priority-analytics">

            <PriorityStat
              label="High"
              value={priorityStats.high}
              total={issues.length}
              className="high"
            />

            <PriorityStat
              label="Medium"
              value={priorityStats.medium}
              total={issues.length}
              className="medium"
            />

            <PriorityStat
              label="Low"
              value={priorityStats.low}
              total={issues.length}
              className="low"
            />

          </div>

        </div>

        {/* AREA */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <span className="panel-kicker">
                COMMUNITY IMPACT
              </span>

              <h2>
                Reports by Area
              </h2>
            </div>

          </div>

          <div className="area-analytics-list">

            {areaStats.length === 0 ? (
              <p className="analytics-empty">
                No area data available.
              </p>
            ) : (
              areaStats.map((item, index) => {

                const max =
                  areaStats[0]?.count || 1;

                return (
                  <div
                    className="area-analytics-row"
                    key={item.area}
                  >

                    <div className="area-analytics-rank">
                      {index + 1}
                    </div>

                    <div className="area-analytics-content">

                      <div className="analytics-row-top">

                        <strong>
                          {item.area}
                        </strong>

                        <span>
                          {item.count} reports
                        </span>

                      </div>

                      <div className="analytics-track">

                        <div
                          className="analytics-fill"
                          style={{
                            width: `${
                              (item.count / max) * 100
                            }%`
                          }}
                        />

                      </div>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

      </section>

      {/* EXPLANATION */}

      <section className="analytics-insight">

        <div className="analytics-insight-icon">
          ✦
        </div>

        <div>

          <span>
            HOW CIVICPULSE PRIORITIZES
          </span>

          <h2>
            Turning community reports into actionable priority.
          </h2>

          <p>
            Each issue receives a priority score using
            severity, similar reports, and the population
            factor of the affected area. This helps the
            administration identify issues that may affect
            more people.
          </p>

        </div>

      </section>

      <footer className="dashboard-footer">
        CivicPulse · Civic Analytics
      </footer>

    </div>
  );
}

function AnalyticsMetric({
  label,
  value,
  description
}) {
  return (
    <div className="analytics-metric">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {description}
      </small>

    </div>
  );
}

function AnalyticsStatus({
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
    <div className="status-analytics-item">

      <div>
        <span className={`status-dot ${className}`} />

        <strong>
          {label}
        </strong>
      </div>

      <strong>
        {value}
      </strong>

      <small>
        {percentage}%
      </small>

    </div>
  );
}

function PriorityStat({
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
    <div className="priority-stat">

      <div className="priority-stat-top">

        <span>
          <i className={`priority-indicator ${className}`} />
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <div className="analytics-track">

        <div
          className={`analytics-fill ${className}`}
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

      <small>
        {percentage}% of all reports
      </small>

    </div>
  );
}

export default AdminAnalyticsPage;