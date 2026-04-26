import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import "@/styles/dashboard.css";

function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="dashboard-main-content">
        <Outlet context={{ setMobileOpen }} />
      </div>
    </div>
  );
}

export default DashboardLayout;
