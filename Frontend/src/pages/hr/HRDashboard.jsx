import React, { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Skeleton from "@/components/Skeleton";
import "@/styles/reports.css";
import "@/styles/forms.css";

function HRDashboard() {
  const { setMobileOpen } = useOutletContext();
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [jobStats, setJobStats] = useState({ total: 0 });
  const [candidateStats, setCandidateStats] = useState({ 
    total: 0, submitted: 0, screened: 0, interview: 0, offered: 0, hired: 0 
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch Jobs Stats
        const jobRes = await fetch("http://localhost:5001/api/jobs/stats");
        if (jobRes.ok) {
          const jobData = await jobRes.json();
          if (jobData.success) setJobStats(jobData.stats);
        }

        // Fetch Candidate Stats
        const candRes = await fetch("http://localhost:5001/api/candidates/stats");
        if (candRes.ok) {
          const candData = await candRes.json();
          if (candData.success) setCandidateStats(candData.stats);
        }

        // Fetch Upcoming Interviews ('Scheduled')
        const intRes = await fetch("http://localhost:5001/api/interviews?status=Scheduled");
        if (intRes.ok) {
          const intData = await intRes.json();
          if (intData.success) {
            // Take the first 5 upcoming
            setUpcomingInterviews(intData.interviews.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate percentages for the pipeline
  const totalInPipeline = parseInt(candidateStats.total) || 1; // avoid division by zero
  const pipelineData = [
    { stage: "Screening", count: parseInt(candidateStats.screened) || 0, class: "screened" },
    { stage: "Interview", count: parseInt(candidateStats.interview) || 0, class: "interview" },
    { stage: "Offered", count: parseInt(candidateStats.offered) || 0, class: "offered" },
    { stage: "Hired", count: parseInt(candidateStats.hired) || 0, class: "hired" },
  ].map(s => ({ ...s, percent: Math.max(2, Math.round((s.count / totalInPipeline) * 100)) }));

  if (loading) {
    return (
      <>
        <Navbar title="HR Dashboard" subtitle="Overview of your recruitment pipeline" onHamburgerClick={() => setMobileOpen(true)} />
        <div className="dashboard-page" style={{ height: "calc(100vh - 80px)" }}>
          <Skeleton type="dashboard" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="HR Dashboard" subtitle="Overview of your recruitment pipeline" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page fade-in">
        <div className="reports-grid">
          <div className="report-metric-card navy">
            <div className="report-metric-icon navy">▤</div>
            <h2>{jobStats.total || 0}</h2>
            <p>Total Assigned Jobs</p>
          </div>
          <div className="report-metric-card emerald">
            <div className="report-metric-icon emerald">◈</div>
            <h2>{candidateStats.total || 0}</h2>
            <p>Active Candidates</p>
          </div>
          <div className="report-metric-card amber">
            <div className="report-metric-icon amber">⬡</div>
            <h2>{upcomingInterviews.length}</h2>
            <p>Upcoming Interviews</p>
          </div>
        </div>

        <div className="reports-two-col">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Upcoming Interviews</h3>
              <Link to="/interviews" className="btn btn-sm btn-outline">View All</Link>
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
                  {upcomingInterviews.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>
                        No upcoming interviews scheduled.
                      </td>
                    </tr>
                  ) : (
                    upcomingInterviews.map((int) => (
                      <tr key={int.id}>
                        <td style={{ fontWeight: 500 }}>{int.candidate_name}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{int.role}</td>
                        <td>
                          {new Date(int.interview_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} 
                          &nbsp;&middot;&nbsp; 
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{int.interview_time}</span>
                        </td>
                        <td>
                          <span className={`badge ${int.mode === 'Video' ? 'badge-info' : 'badge-neutral'}`}>
                            {int.mode}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Hiring Pipeline Overview</h3>
              <span className="badge badge-info">All Time</span>
            </div>
            <div className="dashboard-card-body">
              <div className="pipeline-stages">
                {pipelineData.map((stage) => (
                  <div className="pipeline-stage" key={stage.stage}>
                    <span className="pipeline-label">{stage.stage}</span>
                    <div className="pipeline-bar-track">
                      <div className={`pipeline-bar-fill ${stage.class}`} style={{ width: `${stage.percent}%` }}>
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
