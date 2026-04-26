import React from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import "@/styles/dashboard.css";
import "@/styles/forms.css";

function VendorDashboard() {
  const { setMobileOpen } = useOutletContext();
  const vendorName = localStorage.getItem("demoUser") || "Vendor User";

  const assignedJobs = [
    { id: "J001", title: "Senior React Developer", department: "Engineering", location: "Bangalore", status: "Active" },
    { id: "J002", title: "Full Stack Developer", department: "Engineering", location: "Remote", status: "Active" },
    { id: "J003", title: "UI/UX Designer", department: "Product", location: "Mumbai", status: "Active" }
  ];

  const recentUpdates = [
    { text: "Your candidate Aditya Patel was moved to Interview stage.", time: "1 hour ago", color: "orange" },
    { text: "Your candidate Neha Gupta was marked as Duplicate.", time: "3 hours ago", color: "red" },
    { text: "Your candidate Vikram Joshi was Offered the position.", time: "1 day ago", color: "green" },
    { text: "New job requisition 'Senior React Developer' assigned to you.", time: "2 days ago", color: "blue" }
  ];

  return (
    <>
      <Navbar title={`Welcome back, ${vendorName.split(" ")[0]}`} subtitle="Here is your vendor performance overview" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Submitted</h3>
              <p className="stat-number">48</p>
              <span className="stat-change positive">↑ 12 this month</span>
            </div>
            <div className="stat-icon blue">📄</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Shortlisted</h3>
              <p className="stat-number">14</p>
              <span className="stat-change positive">↑ 3 this month</span>
            </div>
            <div className="stat-icon purple">⭐</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Interviews</h3>
              <p className="stat-number">6</p>
              <span className="stat-change positive">↑ 2 this week</span>
            </div>
            <div className="stat-icon orange">📅</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Hired</h3>
              <p className="stat-number">3</p>
              <span className="stat-change positive">↑ 1 this month</span>
            </div>
            <div className="stat-icon green">🏆</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Active Jobs Assigned to You</h3>
              <button className="btn btn-sm btn-outline">View All</button>
            </div>
            <div className="data-table-container" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedJobs.map(job => (
                    <tr key={job.id}>
                      <td style={{ fontWeight: 500 }}>{job.id}</td>
                      <td>{job.title}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{job.department}</td>
                      <td>{job.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Recent Candidate Updates</h3>
            </div>
            <div className="dashboard-card-body">
              <div className="activity-list">
                {recentUpdates.map((update, idx) => (
                  <div className="activity-item" key={idx}>
                    <div className={`activity-dot ${update.color}`} />
                    <div className="activity-text">
                      <p>{update.text}</p>
                      <span>{update.time}</span>
                    </div>
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

export default VendorDashboard;
