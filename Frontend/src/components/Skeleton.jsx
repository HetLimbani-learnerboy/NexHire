import React from "react";
import "@/styles/skeleton.css";

function Skeleton({ type = "generic" }) {
  if (type === "kanban") {
    return (
      <div className="skeleton-kanban">
        {[1, 2, 3, 4, 5].map((col) => (
          <div key={col} className="skeleton-col">
            <div className="skeleton-col-header skeleton-pulse"></div>
            <div className="skeleton-card skeleton-pulse"></div>
            <div className="skeleton-card skeleton-pulse" style={{ height: "120px" }}></div>
            <div className="skeleton-card skeleton-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="skeleton-table-wrapper">
        <div className="skeleton-table-header">
          <div className="skeleton-table-col skeleton-pulse" style={{ width: "20%" }}></div>
          <div className="skeleton-table-col skeleton-pulse" style={{ width: "20%" }}></div>
          <div className="skeleton-table-col skeleton-pulse" style={{ width: "20%" }}></div>
          <div className="skeleton-table-col skeleton-pulse" style={{ width: "20%" }}></div>
          <div className="skeleton-table-col skeleton-pulse" style={{ width: "20%" }}></div>
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="skeleton-table-row">
            <div className="skeleton-table-cell skeleton-pulse" style={{ width: "30%" }}></div>
            <div className="skeleton-table-cell skeleton-pulse" style={{ width: "40%" }}></div>
            <div className="skeleton-table-cell skeleton-pulse" style={{ width: "25%" }}></div>
            <div className="skeleton-table-cell skeleton-pulse" style={{ width: "35%" }}></div>
            <div className="skeleton-table-cell skeleton-pulse" style={{ width: "15%" }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="skeleton-dashboard">
        <div className="skeleton-dash-stats">
          <div className="skeleton-stat-card skeleton-pulse"></div>
          <div className="skeleton-stat-card skeleton-pulse"></div>
          <div className="skeleton-stat-card skeleton-pulse"></div>
          <div className="skeleton-stat-card skeleton-pulse"></div>
        </div>
        <div className="skeleton-dash-main">
          <div className="skeleton-chart skeleton-pulse"></div>
          <div className="skeleton-list skeleton-pulse"></div>
        </div>
      </div>
    );
  }

  // Default generic block
  return <div className="skeleton-generic skeleton-pulse"></div>;
}

export default Skeleton;
