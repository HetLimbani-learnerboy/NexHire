import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import "../styles/forms.css";

const initialUsers = [
  { id: "U001", name: "Admin User", email: "admin@nexhire.com", role: "admin", status: "Active" },
  { id: "U002", name: "HR Manager", email: "hr@nexhire.com", role: "hr", status: "Active" },
  { id: "U003", name: "Vendor Alpha", email: "alpha@vendor.com", role: "vendor", status: "Active" },
  { id: "U004", name: "Hiring Manager", email: "manager@nexhire.com", role: "manager", status: "Inactive" },
];

function Users() {
  const { setMobileOpen } = useOutletContext();
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", role: "hr", status: "Active" });

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === "All" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    const newUser = { id: `U00${users.length + 1}`, ...formData };
    setUsers([...users, newUser]);
    setShowModal(false);
    setFormData({ name: "", email: "", role: "hr", status: "Active" });
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  };

  const getRoleBadge = (role) => {
    const m = { admin: "badge-danger", hr: "badge-info", vendor: "badge-warning", manager: "badge-success" };
    return <span className={`badge ${m[role] || "badge-neutral"}`}>{role.toUpperCase()}</span>;
  };

  const getStatusBadge = (status) => {
    const cls = { Active: "badge-success", Inactive: "badge-neutral" };
    return <span className={`badge ${cls[status]}`}>{status}</span>;
  };

  const columns = ["User", "Email", "Role", "Status", "Actions"];

  const renderRow = (user) => (
    <tr key={user.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">{user.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
          <div className="table-user-info">
            <h4>{user.name}</h4>
            <p>{user.id}</p>
          </div>
        </div>
      </td>
      <td>{user.email}</td>
      <td>{getRoleBadge(user.role)}</td>
      <td>{getStatusBadge(user.status)}</td>
      <td>
        <div className="table-actions">
          <button className="table-action-btn" title="Edit">✏️</button>
          <button className="table-action-btn" title={user.status === "Active" ? "Disable" : "Enable"} onClick={() => toggleStatus(user.id)}>
            {user.status === "Active" ? "🔒" : "🔓"}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Navbar title="Access Control" subtitle="Manage users, roles, and permissions" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>All Users ({filtered.length})</h2>
            <p>Create accounts, assign roles, and manage access</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)} id="add-user-btn">+ Create User</button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="user-search" />
          </div>
          <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} id="user-role-filter">
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="vendor">Vendor</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <Table columns={columns} data={filtered} renderRow={renderRow} currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New User</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" type="text" placeholder="Enter full name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" placeholder="Enter email address" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                      <option value="admin">Admin</option>
                      <option value="hr">HR Recruiter</option>
                      <option value="vendor">Vendor</option>
                      <option value="manager">Hiring Manager</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success" id="user-submit-btn">Create User</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Users;
