import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/forms.css";

function Profile() {
  const { setMobileOpen } = useOutletContext();

  const [formData, setFormData] = useState({
    name: localStorage.getItem("demoUser") || "Admin User",
    email: "admin@nexhire.com",
    phone: "+1 234 567 8900",
    role: localStorage.getItem("demoRole") || "admin",
  });

  const [passwordData, setPasswordData] = useState({ current: "", newPass: "", confirm: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile saved successfully! (Mock)");
  };

  return (
    <>
      <Navbar title="My Profile" subtitle="Manage your account settings" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Profile Settings</h2>
            <p>Update your personal information and password</p>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Profile Info Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Personal Information</h3>
            </div>
            <div className="dashboard-card-body">
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div className="vendor-perf-avatar" style={{ width: "64px", height: "64px", fontSize: "1.5rem" }}>
                  {formData.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{formData.name}</h4>
                  <span className={`badge ${formData.role === "admin" ? "badge-danger" : "badge-info"}`}>{formData.role.toUpperCase()}</span>
                </div>
              </div>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--gray-100)" }}>
                  <button type="button" className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-success">Save Changes</button>
                </div>
              </form>
            </div>
          </div>

          {/* Password Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Change Password</h3>
            </div>
            <div className="dashboard-card-body">
              <form style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input className="form-input" type="password" placeholder="Enter current password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-input" type="password" placeholder="Enter new password" value={passwordData.newPass} onChange={e => setPasswordData({ ...passwordData, newPass: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input className="form-input" type="password" placeholder="Confirm new password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--gray-100)" }}>
                  <button type="button" className="btn btn-outline">Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={() => alert("Password updated! (Mock)")}>Update Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
