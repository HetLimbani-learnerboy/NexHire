import React, { useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const [formData, setFormData] = useState({
    name: localStorage.getItem("demoUser") || "Admin User",
    email: "admin@nexhire.com",
    phone: "+1 234 567 8900",
    role: localStorage.getItem("demoRole") || "admin",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile saved successfully! (Mock)");
  };

  return (
    <div className="page-container fade-in">
      <Navbar title="My Profile" subtitle="Manage your account settings" />
      
      <div className="page-content slide-up">
        <div className="card" style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "var(--navy-600)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "bold" }}>
              {formData.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ color: "var(--navy-900)" }}>{formData.name}</h2>
              <p style={{ color: "var(--text-secondary)" }}>{formData.role.toUpperCase()}</p>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-300)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-300)" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-300)" }}
              />
            </div>
            <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--gray-200)" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Change Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-300)", marginBottom: "1rem" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button type="button" style={{ padding: "0.75rem 1.5rem", borderRadius: "var(--radius-sm)", background: "var(--gray-200)", color: "var(--gray-700)", fontWeight: "500" }}>Cancel</button>
              <button type="submit" style={{ padding: "0.75rem 1.5rem", borderRadius: "var(--radius-sm)", background: "var(--emerald-500)", color: "white", fontWeight: "500" }}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
