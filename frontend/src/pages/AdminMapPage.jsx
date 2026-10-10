import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import IssueMap from "../components/IssueMap";

function AdminMapPage() {
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
        "Unable to load map data. Please check that the backend is running."
      );
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  const areaStats = useMemo(() => {
    const stats = {};

    issues.forEach((issue) => {
      if (!stats[issue.area]) {
        stats[issue.area] = {
          total: 0,
          high: 0,
          medium: 0,
          low: 0
        };
      }

      stats[issue.area].total++;

      if (issue.priorityLevel === "High") {
        stats[issue.area].high++;
      } else if (issue.priorityLevel === "Medium") {
        stats[issue.area].medium++;
      } else {
        stats[issue.area].low++;
      }
    });

    return Object.entries(stats)
      .map(([area, data]) => ({
        area,
        ...data
      }))
      .sort((a, b) => b.total - a.total);
  }, [issues]);

  const highPriorityCount = issues.filter(
    (issue) => issue.priorityLevel === "High"
  ).length;

  const mediumPriorityCount = issues.filter(
    (issue) => issue.priorityLevel === "Medium"
  ).length;

  const lowPriorityCount = issues.filter(
    (issue) => issue.priorityLevel === "Low"
  ).length;

  return (
    <div className="simple-admin-page">

      <header className="simple-admin-header">

        <div>
          <Link to="/admin" className="back-link">
            ← Dashboard
          </Link>

          <span className="page-kicker">
            LOCATION INTELLIGENCE
          </span>

          <h1>
            Civic Issue Map
          </h1>

          <p>
            Monitor issue concentration and community impact across areas.
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

      <section className="map-summary-grid">

        <div className="map-summary-card">
          <span>Total Reports</span>
          <strong>{issues.length}</strong>
          <small>Across all monitored areas</small>
        </div>

        <div className="map-summary-card high">
          <span>High Priority</span>
          <strong>{highPriorityCount}</strong>
          <small>Requires urgent attention</small>
        </div>

        <div className="map-summary-card medium">
          <span>Medium Priority</span>
          <strong>{mediumPriorityCount}</strong>
          <small>Needs monitoring</small>
        </div>

        <div className="map-summary-card low">
          <span>Low Priority</span>
          <strong>{lowPriorityCount}</strong>
          <small>Lower impact reports</small>
        </div>

      </section>

      <section className="map-layout">

        <div className="admin-map-panel">

          <div className="map-panel-header">

            <div>
              <span className="panel-kicker">
                LIVE ISSUE DISTRIBUTION
              </span>

              <h2>
                Reported Civic Issues
              </h2>
            </div>

            <span className="map-marker-info">
              📍 {issues.length} reports
            </span>

          </div>

          <IssueMap issues={issues} />

        </div>

        <aside className="area-panel">

          <div className="area-panel-header">
            <span className="panel-kicker">
              AREA ANALYSIS
            </span>

            <h2>
              Affected Areas
            </h2>

            <p>
              Areas with the highest number of reports.
            </p>
          </div>

          <div className="area-list">

            {areaStats.length === 0 ? (

              <div className="dashboard-empty">
                <div>⌖</div>

                <h3>
                  No map data
                </h3>

                <p>
                  Submit an issue to see it here.
                </p>
              </div>

            ) : (

              areaStats.map((area, index) => (

                <div
                  className="area-item"
                  key={area.area}
                >

                  <div className="area-rank">
                    {index + 1}
                  </div>

                  <div className="area-details">

                    <div className="area-name-row">
                      <strong>
                        {area.area}
                      </strong>

                      <span>
                        {area.total} reports
                      </span>
                    </div>

                    <div className="area-progress">
                      <div
                        style={{
                          width: `${
                            (area.total / areaStats[0].total) * 100
                          }%`
                        }}
                      />
                    </div>

                    <div className="area-priority-counts">
                      <span className="area-high">
                        {area.high} High
                      </span>

                      <span className="area-medium">
                        {area.medium} Medium
                      </span>

                      <span className="area-low">
                        {area.low} Low
                      </span>
                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </aside>

      </section>

      <footer className="dashboard-footer">
        CivicPulse · Location Intelligence
      </footer>

    </div>
  );
}

export default AdminMapPage;