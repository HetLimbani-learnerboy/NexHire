import React from "react";

function DashboardCard({ icon, iconClass, label, value, change, changeType }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h3>{label}</h3>
        <p className="stat-number">{value}</p>
        {change && (
          <span className={`stat-change ${changeType || "positive"}`}>
            {changeType === "negative" ? "↓" : "↑"} {change}
          </span>
        )}
      </div>
      <div className={`stat-icon ${iconClass || "blue"}`}>{icon}</div>
    </div>
  );
}

export default DashboardCard;
