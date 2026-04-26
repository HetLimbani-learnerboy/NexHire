import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
import logo from "../assets/logo.png";

/*
=================================================
NexHire ATS Login Page
Premium UI + Validation + Demo Credentials
=================================================
*/

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* States */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid credentials.");
      }

      setLoading(false);
    }, 900);
  };

  /* Demo Login Fill */
  const fillDemo = (type) => {
    if (type === "admin") {
      setEmail("admin@nexhire.com");
      setPassword("nexhire123");
      localStorage.setItem("demoUser", "Sahil Dobaria");
      localStorage.setItem("demoRole", "admin");
      localStorage.setItem("email", "admin@nexhire.com");
    }

    if (type === "hr") {
      setEmail("hr@nexhire.com");
      setPassword("nexhire123");
      localStorage.setItem("demoUser", "Het Limbani");
      localStorage.setItem("demoRole", "hr");
      localStorage.setItem("email", "hr@nexhire.com");
    }

    if (type === "vendor") {
      setEmail("vendor@nexhire.com");
      setPassword("nexhire123");
      localStorage.setItem("demoUser", "Rohan Upadhyay");
      localStorage.setItem("demoRole", "vendor");
      localStorage.setItem("email", "vendor@nexhire.com");
    }
    if (type === "manager") {
      setEmail("manager@nexhire.com");
      setPassword("nexhire123");
      localStorage.setItem("demoUser", "Priya Sharma");
      localStorage.setItem("demoRole", "manager");
      localStorage.setItem("email", "manager@nexhire.com");
    }
  };

  return (
    <div className="login-page">

      {/* Background Shapes */}
      <div className="login-bg-shape s1"></div>
      <div className="login-bg-shape s2"></div>
      <div className="login-bg-shape s3"></div>

      {/* Left Branding */}
      <div className="login-branding">

        <div className="login-branding-logo">
          <img src={logo} alt="NexHire Logo" />
          <h2>NexHire ATS</h2>
        </div>

        <h1>
          Smarter Hiring <br />
          <span>Faster Growth</span>
        </h1>

        <p>
          Secure enterprise-grade applicant tracking system built for
          vendor hiring, recruitment workflows, candidate pipelines,
          interview tracking and advanced hiring analytics.
        </p>

        <div className="login-features">

          <div className="login-feature">
            <div className="login-feature-icon">✦</div>
            <span className="login-feature-text">
              Vendor onboarding & ratings
            </span>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">⬡</div>
            <span className="login-feature-text">
              Job requisition workflow management
            </span>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">◈</div>
            <span className="login-feature-text">
              Role based access system
            </span>
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">▣</div>
            <span className="login-feature-text">
              Reports & hiring dashboard
            </span>
          </div>

        </div>

      </div>

      {/* Right Login Form */}
      <div className="login-form-panel">

        <div className="login-form-card">

          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to NexHire ATS</p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-field-input">

                <span className="input-icon">
                  📧
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="admin@nexhire.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>

            {/* Password Field */}
            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-field-input">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.73 1.84-3.27 3.23-4.5" />
                      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1 2.35-2.67 4.39-4.77 5.76" />
                      <path d="M1 1l22 22" />
                      <path d="M10.58 10.58a2 2 0 1 0 2.83 2.83" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {/* Remember Row */}
            <div className="login-remember-row">

              <label className="login-remember">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                Remember me

              </label>

              <span className="login-forgot">
                Forgot password?
              </span>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-btn"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

            {/* Back */}
            <button
              type="button"
              className="back-btn"
              onClick={() =>
                navigate("/")
              }
            >
              Back to Home
            </button>

            {/* Divider */}
            <div className="login-divider">
              Demo Access
            </div>

            {/* Demo Credentials */}
            <div className="login-demo-info">

              <button
                type="button"
                onClick={() =>
                  fillDemo("admin")
                }
              >
                Admin Login
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemo("hr")
                }
              >
                HR Login
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemo("vendor")
                }
              >
                Vendor Login
              </button>
              <button type="button"
                onClick={() => fillDemo("manager")}
              >Manager Login</button>

              <code>
                Password :
                nexhire123
              </code>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;