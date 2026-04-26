import React, { useState } from "react";
import Navbar from "../components/Navbar";

const initialUsers = [
  { id: "U001", name: "Admin User", email: "admin@nexhire.com", role: "admin", status: "Active" },
  { id: "U002", name: "HR Manager", email: "hr@nexhire.com", role: "hr", status: "Active" },
  { id: "U003", name: "Vendor Alpha", email: "alpha@vendor.com", role: "vendor", status: "Active" },
  { id: "U004", name: "Hiring Manager", email: "manager@nexhire.com", role: "manager", status: "Inactive" },
];

function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "hr", status: "Active" });

  const handleCreateUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: `U00${users.length + 1}`,
      ...formData
    };
    setUsers([...users, newUser]);
    setShowModal(false);
    setFormData({ name: "", email: "", role: "hr", status: "Active" });
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  };

  return (
    <div className="page-container fade-in">
      <Navbar title="Access Control" subtitle="Manage users, roles, and permissions" />
      
      <div className="page-content slide-up">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div className="search-bar" style={{ display: "flex", gap: "0.5rem" }}>
            <input type="text" placeholder="Search users..." style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-300)" }} />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)", background: "var(--emerald-500)", color: "white", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            + Create User
          </button>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td style={{ fontWeight: "500" }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`status-badge ${user.role}`}>{user.role.toUpperCase()}</span></td>
                    <td>
                      <span style={{ 
                        padding: "0.25rem 0.5rem", 
                        borderRadius: "var(--radius-full)", 
                        fontSize: "0.85rem",
                        backgroundColor: user.status === "Active" ? "var(--emerald-100)" : "var(--gray-200)",
                        color: user.status === "Active" ? "var(--emerald-600)" : "var(--gray-600)"
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => toggleStatus(user.id)} style={{ padding: "0.25rem 0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-300)", background: "white", marginRight: "0.5rem" }}>
                        {user.status === "Active" ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="modal-content slide-up" style={{ background: "white", padding: "2rem", borderRadius: "var(--radius-md)", width: "100%", maxWidth: "400px" }}>
            <h2 style={{ marginTop: 0 }}>Create User</h2>
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "0.5rem" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: "100%", padding: "0.5rem" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: "100%", padding: "0.5rem" }}>
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                  <option value="vendor">Vendor</option>
                  <option value="manager">Hiring Manager</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.5rem 1rem" }}>Cancel</button>
                <button type="submit" style={{ padding: "0.5rem 1rem", background: "var(--emerald-500)", color: "white", border: "none", borderRadius: "var(--radius-sm)" }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
