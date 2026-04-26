import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
import logo from "../assets/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    const result = login(email, password);
    if (result.success) { navigate("/dashboard"); }
    else { setError(result.message); }
  };

  return (
    <div className="login-page">
      <div className="login-bg-shape s1" />
      <div className="login-bg-shape s2" />
      <div className="login-bg-shape s3" />

      <div className="login-branding">
        <div className="login-branding-logo">
          <img src={logo} alt="NexHire" />
          <h2>NexHire ATS</h2>
        </div>
        <h1>Smarter Hiring.<br /><span>Faster Growth.</span></h1>
        <p>Enterprise-grade applicant tracking system for managing vendors, job requisitions, candidate pipelines, and hiring analytics in one unified platform.</p>
        <div className="login-features">
          <div className="login-feature"><div className="login-feature-icon">✦</div><span className="login-feature-text">Vendor onboarding & performance tracking</span></div>
          <div className="login-feature"><div className="login-feature-icon">⬡</div><span className="login-feature-text">Automated hiring pipeline workflows</span></div>
          <div className="login-feature"><div className="login-feature-icon">◈</div><span className="login-feature-text">Role-based access for Admin, HR & Vendors</span></div>
          <div className="login-feature"><div className="login-feature-icon">▣</div><span className="login-feature-text">Real-time analytics & reporting dashboards</span></div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-card">
          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your NexHire account</p>
          </div>
          {error && <div className="login-error">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Email Address</label>
              <div className="login-field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
                <input id="login-email" type="email" placeholder="admin@nexhire.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-field-input">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input id="login-password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
            </div>
            <div className="login-remember-row">
              <label className="login-remember"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />Remember me</label>
              <span className="login-forgot">Forgot password?</span>
            </div>
            <button type="submit" className="login-submit-btn" id="login-submit">Sign In</button>
            <div className="login-divider">or</div>
            <div className="login-demo-info">
              <p>Demo Credentials</p>
              <code>admin@nexhire.com / nexhire123</code><br />
              <code>hr@nexhire.com / nexhire123</code><br />
              <code>vendor@nexhire.com / nexhire123</code>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
