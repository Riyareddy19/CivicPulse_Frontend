function StatusTimeline({ status }) {
  const steps = [
    "Pending",
    "In Progress",
    "Resolved"
  ];

  const currentIndex = steps.indexOf(status);

  return (
    <div className="status-timeline">
      {steps.map((step, index) => (
        <div className="timeline-step" key={step}>

          <div
            className={
              index <= currentIndex
                ? "timeline-dot active"
                : "timeline-dot"
            }
          >
            {index < currentIndex ? "✓" : ""}
          </div>

          <span
            className={
              index <= currentIndex
                ? "timeline-label active"
                : "timeline-label"
            }
          >
            {step}
          </span>

          {index < steps.length - 1 && (
            <div
              className={
                index < currentIndex
                  ? "timeline-line active"
                  : "timeline-line"
              }
            />
          )}

        </div>
      ))}
    </div>
  );
}

export default StatusTimeline;