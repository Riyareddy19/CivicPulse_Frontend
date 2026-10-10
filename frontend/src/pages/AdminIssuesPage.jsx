import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function AdminIssuesPage() {

  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  async function loadIssues() {

    try {

      const response = await api.get("/issues");

      setIssues(response.data);
      setError("");

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load issues. Please check the backend."
      );

    }

  }

  useEffect(() => {
    loadIssues();
  }, []);


  const filteredIssues =
    filter === "All"
      ? issues
      : issues.filter(
          (issue) => issue.status === filter
        );


  return (
    <div className="simple-admin-page">

      <header className="simple-admin-header">

        <div>

          <Link
            to="/admin"
            className="back-link"
          >
            ← Dashboard
          </Link>

          <span className="page-kicker">
            ISSUE MANAGEMENT
          </span>

          <h1>
            Reported Issues
          </h1>

          <p>
            Review all civic issues reported by citizens.
          </p>

        </div>

        <button
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


      <div className="page-filters">

        {[
          "All",
          "Pending",
          "In Progress",
          "Resolved"
        ].map((status) => (

          <button
            key={status}
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


      <div className="full-issue-list">

        {filteredIssues.length === 0 ? (

          <div className="dashboard-empty">

            <div>◫</div>

            <h3>
              No issues found
            </h3>

            <p>
              No issues match the selected filter.
            </p>

          </div>

        ) : (

          filteredIssues.map((issue) => (

            <div
              className="full-issue-card"
              key={issue.id}
            >

              <div className="full-issue-main">

                <div className="issue-category-icon">
                  {getCategoryIcon(issue.category)}
                </div>

                <div>

                  <h3>
                    {issue.category}
                  </h3>

                  <p>
                    📍 {issue.area}
                  </p>

                  <span>
                    Reported by {issue.reporterName}
                  </span>

                </div>

              </div>


              <div className="full-issue-description">
                {issue.description}
              </div>


              <div className="full-issue-meta">

                <div>
                  <span>Priority Score</span>
                  <strong>{issue.priorityScore}</strong>
                </div>

                <div>
                  <span>Similar Reports</span>
                  <strong>{issue.duplicateCount}</strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>{issue.priorityLevel}</strong>
                </div>

                <div>
                  <span>Department</span>
                  <strong>{issue.department}</strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong className={
                    `status-pill ${
                      issue.status
                        ?.toLowerCase()
                        .replace(" ", "-")
                    }`
                  }>
                    {issue.status}
                  </strong>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}


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


export default AdminIssuesPage;