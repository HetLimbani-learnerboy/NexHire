import React from "react";

function DashboardCard({
  icon,
  iconClass = "blue",
  label,
  value,
  change,
  changeType = "positive"
}) {
  const arrow =
    changeType === "negative"
      ? "↓"
      : "↑";

  return (
    <div className="stat-card">

      <div className="stat-info">
        <h3>{label}</h3>

        <p className="stat-number">
          {value}
        </p>

        {change && (
          <span
            className={`stat-change ${changeType}`}
          >
            {arrow} {change}
          </span>
        )}
      </div>

      <div
        className={`stat-icon ${iconClass}`}
      >
        {icon}
      </div>

    </div>
  );
}

export default DashboardCard;
