import React from "react";
import "@/styles/sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

/*
====================================================
NexHire ATS Sidebar
Role Based Access using localStorage demoRole
admin / hr / vendor / manager
====================================================
*/

function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  const navigate = useNavigate();

  /* ---------------------------------------
     Get Role From LocalStorage
  --------------------------------------- */
  const role =
    localStorage.getItem("demoRole") ||
    "guest";

  const userName =
    localStorage.getItem("demoUser") ||
    "User";

  /* ---------------------------------------
     Logout
  --------------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("demoRole");
    localStorage.removeItem("demoName");
    navigate("/login");
  };

  const closeMobile = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  /* ---------------------------------------
     Common Pages
  --------------------------------------- */
  const dashboardRoute = role === "hr" ? "/hr-dashboard" : role === "vendor" ? "/vendor-dashboard" : role === "manager" ? "/manager-dashboard" : "/dashboard";
  const commonMain = [
    {
      to: dashboardRoute,
      label: "Dashboard",
      icon: "▣"
    }
  ];

  /* ---------------------------------------
     Admin Pages
  --------------------------------------- */
  const adminPages = [
    {
      to: "/vendors",
      label: "Vendors",
      icon: "◉"
    },
    {
      to: "/jobs",
      label: "Jobs",
      icon: "▤"
    },
    {
      to: "/candidates",
      label: "Candidates",
      icon: "◈"
    },
    {
      to: "/reports",
      label: "Reports",
      icon: "⬡"
    },
    {
      to: "/users",
      label: "Users",
      icon: "✦"
    }
  ];

  /* ---------------------------------------
     HR Pages
  --------------------------------------- */
  const hrPages = [
    {
      to: "/jobs",
      label: "Jobs",
      icon: "▤"
    },
    {
      to: "/pipeline",
      label: "Pipeline",
      icon: "◈"
    },
    {
      to: "/interviews",
      label: "Interviews",
      icon: "⬡"
    },
    {
      to: "/reports",
      label: "Reports",
      icon: "✦"
    }
  ];

  /* ---------------------------------------
     Vendor Pages
  --------------------------------------- */
  const vendorPages = [
    {
      to: "/submit-candidate",
      label: "Submit Candidate",
      icon: "➤"
    },
    {
      to: "/my-candidates",
      label: "My Candidates",
      icon: "◈"
    },
    {
      to: "/vendor-profile",
      label: "Profile",
      icon: "◎"
    }
  ];

  /* ---------------------------------------
     Manager Pages
  --------------------------------------- */
  const managerPages = [
    {
      to: "/review-candidates",
      label: "Review",
      icon: "◉"
    },
    {
      to: "/feedback",
      label: "Feedback",
      icon: "✎"
    },
    {
      to: "/final-selection",
      label: "Selections",
      icon: "★"
    }
  ];

  /* ---------------------------------------
     Role Based Links
  --------------------------------------- */
  let roleLinks = [];

  if (role === "admin") {
    roleLinks = adminPages;
  }

  if (role === "hr") {
    roleLinks = hrPages;
  }

  if (role === "vendor") {
    roleLinks = vendorPages;
  }

  if (role === "manager") {
    roleLinks = managerPages;
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobile}
        ></div>
      )}

      <aside
        className={`sidebar ${
          collapsed ? "collapsed" : ""
        } ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >

        {/* Brand */}
        <div className="sidebar-brand">

          <img
            src={logo}
            alt="NexHire"
            className="sidebar-brand-logo"
          />

          {!collapsed && (
            <div className="sidebar-brand-text">
              <h2>NexHire</h2>
              <span>ATS Platform</span>
            </div>
          )}

        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          <div className="sidebar-section-label">
            Main
          </div>

          {commonMain.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-link-icon">
                {item.icon}
              </span>

              {!collapsed && (
                <span className="sidebar-link-text">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}

          <div className="sidebar-section-label">
            {role.toUpperCase()}
          </div>

          {roleLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMobile}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-link-icon">
                {item.icon}
              </span>

              {!collapsed && (
                <span className="sidebar-link-text">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}

        </nav>

        {/* User Box */}
        <div className="sidebar-user">

          <div className="sidebar-user-avatar">
            {userName.charAt(0)}
          </div>

          {!collapsed && (
            <div className="sidebar-user-info">
              <h4>{userName}</h4>
              <p>{role}</p>
            </div>
          )}

          <button
            className="sidebar-toggle"
            onClick={() =>
              setCollapsed(!collapsed)
            }
          >
            {collapsed ? "➜" : "◀"}
          </button>

        </div>

        {/* Logout */}
        <div className="sidebar-logout">

          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <span>⇥</span>

            {!collapsed && (
              <span>Sign Out</span>
            )}

          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;