import React from "react";
import "../styles/landingpage.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <nav className="landing-navbar">
        <h1 className="logo">NexHire ATS</h1>
        <button className="login-btn">Login</button>
      </nav>

      <section className="hero-section">
        <div className="hero-left">
          <h2>Smart Vendor Hiring Management Platform</h2>
          <p>
            Streamline vendor onboarding, candidate submissions, hiring
            workflows, and analytics in one modern ATS platform.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Get Started</button>
            <button className="secondary-btn">View Demo</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="dashboard-card">
            <h3>Live Stats</h3>
            <p>Total Vendors: 48</p>
            <p>Open Jobs: 22</p>
            <p>Candidates: 186</p>
            <p>Hires This Month: 12</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Core Features</h2>

        <div className="features-grid">
          <div className="feature-box">
            <h3>Vendor Management</h3>
            <p>Track onboarding, ratings and performance.</p>
          </div>

          <div className="feature-box">
            <h3>Candidate Pipeline</h3>
            <p>Manage candidates from submission to hiring.</p>
          </div>

          <div className="feature-box">
            <h3>Job Requisitions</h3>
            <p>Create jobs, assign vendors and monitor progress.</p>
          </div>

          <div className="feature-box">
            <h3>Analytics Dashboard</h3>
            <p>Measure hiring funnel and vendor efficiency.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 NexHire ATS. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;