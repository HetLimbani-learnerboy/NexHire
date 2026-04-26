import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import api from "@/utils/api";
import "@/styles/dashboard.css";
import "@/styles/forms.css";

function VendorDashboard() {
  const { setMobileOpen } = useOutletContext();
  const vendorName = localStorage.getItem("demoUser") || "Vendor User";

  const [stats, setStats] = useState({ totalSubmitted: 0, shortlisted: 0, interviews: 0, hired: 0 });
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await api.get('/vendor/dashboard');
        if (statsRes.data.success) {
          setStats(statsRes.data.stats || stats);
          setRecentUpdates(statsRes.data.recentUpdates || []);
        }

        const jobsRes = await api.get('/vendor/jobs');
        if (jobsRes.data.success) {
          setAssignedJobs(jobsRes.data.jobs || []);
        }
      } catch (error) {
        console.error("Error fetching vendor dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading dashboard...</div>;

  return (
    <>
      <Navbar title={`Welcome back, ${vendorName.split(" ")[0]}`} subtitle="Here is your vendor performance overview" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Submitted</h3>
              <p className="stat-number">{stats.totalSubmitted}</p>
              <span className="stat-change positive">↑ 12 this month</span>
            </div>
            <div className="stat-icon blue">📄</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Shortlisted</h3>
              <p className="stat-number">{stats.shortlisted}</p>
              <span className="stat-change positive">↑ 3 this month</span>
            </div>
            <div className="stat-icon purple">⭐</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Interviews</h3>
              <p className="stat-number">{stats.interviews}</p>
              <span className="stat-change positive">↑ 2 this week</span>
            </div>
            <div className="stat-icon orange">📅</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Hired</h3>
              <p className="stat-number">{stats.hired}</p>
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
