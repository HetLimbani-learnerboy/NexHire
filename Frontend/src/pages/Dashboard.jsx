import React from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const { setMobileOpen } = useOutletContext();

  const pipelineData = [
    { stage: "Submitted", count: 245, percent: 100, class: "submitted" },
    { stage: "Screened", count: 182, percent: 74, class: "screened" },
    { stage: "Interview", count: 96, percent: 39, class: "interview" },
    { stage: "Offered", count: 42, percent: 17, class: "offered" },
    { stage: "Hired", count: 28, percent: 11, class: "hired" },
  ];

  const activities = [
    { text: "New vendor TechStaff Solutions registered and pending approval", time: "2 minutes ago", color: "blue" },
    { text: "Candidate Aditya Patel moved to Interview stage for Senior React Developer", time: "15 minutes ago", color: "green" },
    { text: "Job requisition 'DevOps Engineer' budget updated to ₹18L", time: "1 hour ago", color: "orange" },
    { text: "Vendor CloudHire rejected candidate Neha Gupta – duplicate profile detected", time: "2 hours ago", color: "red" },
    { text: "HR recruiter created new opening: Data Analyst – Bangalore", time: "3 hours ago", color: "blue" },
    { text: "Vendor InnoRecruit submitted 5 new candidates for Full Stack Developer", time: "5 hours ago", color: "green" },
  ];

  const topVendors = [
    { name: "TechStaff Solutions", score: 92, initials: "TS" },
    { name: "InnoRecruit Pvt Ltd", score: 87, initials: "IR" },
    { name: "CloudHire Global", score: 78, initials: "CH" },
    { name: "SkillBridge HR", score: 71, initials: "SB" },
  ];

  return (
    <>
      <Navbar title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}`} subtitle="Here's your hiring overview for today" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="stats-row">
          <DashboardCard label="Total Jobs" value="24" change="+3 this week" changeType="positive" iconClass="blue" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>} />
          <DashboardCard label="Active Vendors" value="52" change="+8 this month" changeType="positive" iconClass="green" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>} />
          <DashboardCard label="Candidates" value="1,286" change="+124 this week" changeType="positive" iconClass="purple" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>} />
          <DashboardCard label="Hired This Month" value="28" change="-2 vs last month" changeType="negative" iconClass="orange" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-header"><h3>Hiring Pipeline</h3><span className="badge badge-info">This Quarter</span></div>
            <div className="dashboard-card-body">
              <div className="pipeline-stages">
                {pipelineData.map((stage) => (
                  <div className="pipeline-stage" key={stage.stage}>
                    <span className="pipeline-label">{stage.stage}</span>
                    <div className="pipeline-bar-track">
                      <div className={`pipeline-bar-fill ${stage.class}`} style={{ width: `${stage.percent}%` }}>{stage.percent > 15 && stage.count}</div>
                    </div>
                    <span className="pipeline-count">{stage.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header"><h3>Recent Activity</h3><button className="btn btn-sm btn-outline">View All</button></div>
            <div className="dashboard-card-body">
              <div className="activity-list">
                {activities.map((a, idx) => (
                  <div className="activity-item" key={idx}>
                    <div className={`activity-dot ${a.color}`} />
                    <div className="activity-text"><p>{a.text}</p><span>{a.time}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header"><h3>Top Performing Vendors</h3><button className="btn btn-sm btn-outline">View All</button></div>
          <div className="dashboard-card-body">
            <div className="vendor-perf-list">
              {topVendors.map((v, idx) => (
                <div className="vendor-perf-item" key={idx}>
                  <div className="vendor-perf-avatar">{v.initials}</div>
                  <div className="vendor-perf-info"><h4>{v.name}</h4><div className="vendor-perf-bar"><div className="vendor-perf-bar-fill" style={{ width: `${v.score}%` }} /></div></div>
                  <span className="vendor-perf-score">{v.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
