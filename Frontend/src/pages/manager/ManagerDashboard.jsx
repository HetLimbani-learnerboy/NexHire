import React from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import "@/styles/dashboard.css";
import "@/styles/forms.css";

function ManagerDashboard() {
  const { setMobileOpen } = useOutletContext();
  const managerName = localStorage.getItem("demoUser") || "Hiring Manager";

  const actionItems = [
    { id: 1, type: "Review", candidate: "Aditya Patel", role: "Senior React Developer", urgency: "High", time: "Pending 2 days" },
    { id: 2, type: "Feedback", candidate: "Sneha Sharma", role: "Full Stack Developer", urgency: "Medium", time: "Pending 1 day" },
    { id: 3, type: "Decision", candidate: "Priyanka Das", role: "UI/UX Designer", urgency: "High", time: "Due Today" }
  ];

  const upcomingInterviews = [
    { id: 1, name: "Neha Gupta", role: "Data Analyst", time: "11:00 AM Today", mode: "Video Call" },
    { id: 2, name: "Ravi Verma", role: "DevOps Engineer", time: "02:30 PM Tomorrow", mode: "In-Person" }
  ];

  return (
    <>
      <Navbar title={`Welcome back, ${managerName.split(" ")[0]}`} subtitle="Here is your hiring action items" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Pending Reviews</h3>
              <p className="stat-number">4</p>
              <span className="stat-change negative">Action Required</span>
            </div>
            <div className="stat-icon purple">👁</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Upcoming Interviews</h3>
              <p className="stat-number">2</p>
              <span className="stat-change positive">Next: 11:00 AM</span>
            </div>
            <div className="stat-icon orange">📅</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Offers Extended</h3>
              <p className="stat-number">1</p>
              <span className="stat-change positive">This week</span>
            </div>
            <div className="stat-icon green">🎉</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Action Items</h3>
            </div>
            <div className="data-table-container" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Candidate</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {actionItems.map(item => (
                    <tr key={item.id}>
                      <td><span className="badge badge-info">{item.type}</span></td>
                      <td style={{ fontWeight: 500 }}>{item.candidate}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{item.role}</td>
                      <td>
                        <span style={{ fontSize: "12px", color: item.urgency === "High" ? "var(--danger)" : "var(--warning)" }}>
                          {item.time}
                        </span>
                      </td>
                      <td><button className="btn btn-sm btn-outline">Go to Task</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>My Schedule</h3>
              <button className="btn btn-sm btn-outline">Calendar</button>
            </div>
            <div className="dashboard-card-body">
              <div className="activity-list">
                {upcomingInterviews.map((int, idx) => (
                  <div className="activity-item" key={idx}>
                    <div className="activity-dot orange" />
                    <div className="activity-text">
                      <p><strong>{int.name}</strong> • {int.role}</p>
                      <span>{int.time} ({int.mode})</span>
                    </div>
                  </div>
                ))}
                {upcomingInterviews.length === 0 && (
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>No upcoming interviews.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerDashboard;
