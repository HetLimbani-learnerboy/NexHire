import React from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/reports.css";
import "../styles/forms.css";

function HRDashboard() {
  const { setMobileOpen } = useOutletContext();

  const mockInterviews = [
    { id: 1, name: "Aditya Patel", role: "Senior React Developer", time: "10:00 AM Today", mode: "Video", status: "Upcoming" },
    { id: 2, name: "Priyanka Das", role: "UI/UX Designer", time: "02:30 PM Today", mode: "In-Person", status: "Upcoming" },
    { id: 3, name: "Ananya Reddy", role: "Product Manager", time: "11:00 AM Tomorrow", mode: "Video", status: "Scheduled" }
  ];

  const pipelineData = [
    { stage: "Screening", count: 18, percent: 40, class: "screened" },
    { stage: "Interview", count: 12, percent: 27, class: "interview" },
    { stage: "Offered", count: 4, percent: 9, class: "offered" },
    { stage: "Hired", count: 2, percent: 4, class: "hired" },
  ];

  return (
    <>
      <Navbar title="HR Dashboard" subtitle="Overview of your recruitment pipeline" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="reports-grid">
          <div className="report-metric-card navy">
            <div className="report-metric-icon navy">▤</div>
            <h2>12</h2>
            <p>Assigned Jobs</p>
          </div>
          <div className="report-metric-card emerald">
            <div className="report-metric-icon emerald">◈</div>
            <h2>45</h2>
            <p>Active Candidates</p>
          </div>
          <div className="report-metric-card amber">
            <div className="report-metric-icon amber">⬡</div>
            <h2>8</h2>
            <p>Scheduled Interviews</p>
          </div>
        </div>

        <div className="reports-two-col">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Upcoming Interviews</h3>
              <button className="btn btn-sm btn-outline">View All</button>
            </div>
            <div className="data-table-container" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Role</th>
                    <th>Time</th>
                    <th>Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInterviews.map((int) => (
                    <tr key={int.id}>
                      <td style={{ fontWeight: 500 }}>{int.name}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{int.role}</td>
                      <td>{int.time}</td>
                      <td>
                        <span className={`badge ${int.mode === 'Video' ? 'badge-info' : 'badge-neutral'}`}>
                          {int.mode}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Hiring Pipeline Overview</h3>
              <span className="badge badge-info">This Month</span>
            </div>
            <div className="dashboard-card-body">
              <div className="pipeline-stages">
                {pipelineData.map((stage) => (
                  <div className="pipeline-stage" key={stage.stage}>
                    <span className="pipeline-label">{stage.stage}</span>
                    <div className="pipeline-bar-track">
                      <div className={`pipeline-bar-fill ${stage.class}`} style={{ width: `${stage.percent}%` }}>
                        {stage.percent > 15 && stage.count}
                      </div>
                    </div>
                    <span className="pipeline-count">{stage.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HRDashboard;
