import React from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/navbar.css";
import { useAuth } from "@/context/AuthContext";

function Navbar({ title, subtitle, onHamburgerClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-hamburger" onClick={onHamburgerClick} aria-label="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="topbar-page-title">
          <h1>{title || "Dashboard"}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="Search anything..." id="topbar-search-input" />
        </div>

        <button className="topbar-icon-btn" title="Notifications" id="notifications-btn" onClick={() => navigate("/notifications")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span className="topbar-notification-dot" />
        </button>

        <div className="topbar-user" id="user-profile-btn" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
          <div className="topbar-user-avatar">{user?.avatar || "U"}</div>
          <div>
            <div className="topbar-user-name">{user?.name || "User"}</div>
            <div className="topbar-user-role">{user?.role || "Guest"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
