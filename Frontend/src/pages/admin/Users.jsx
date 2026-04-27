/* =========================================================
   FILE 1: src/pages/admin/Users.jsx
   Fully Backend Connected using fetch()
   Extra Features:
   - Live Search
   - Role Filter
   - Create User
   - Toggle Active/Inactive
   - Refresh Button
   - Loading State
   - Toast Message
========================================================= */

import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import "@/styles/userstyle.css";

const API = "http://localhost:5001/api/users";

function Users() {
  const { setMobileOpen } = useOutletContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const [toast, setToast] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "hr"
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();

      if (data.success) setUsers(data.users);
    } catch (err) {
      console.log(err);
      showToast("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        showToast("User Created");
        setShowModal(false);
        setFormData({
          full_name: "",
          email: "",
          role: "hr"
        });
        loadUsers();
      }
    } catch (err) {
      showToast("Failed to create user");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/status`, {
        method: "PUT"
      });

      const data = await res.json();

      if (data.success) {
        showToast("Status Updated");
        loadUsers();
      }
    } catch {
      showToast("Failed");
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const name = (u.full_name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();

      const matchSearch =
        name.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase());

      const matchRole =
        filterRole === "All" || role === filterRole.toLowerCase();

      return matchSearch && matchRole;
    });
  }, [users, searchQuery, filterRole]);

  const badgeRole = (role) => {
    const cls = {
      admin: "badge-danger",
      hr: "badge-info",
      vendor: "badge-warning",
      manager: "badge-success"
    };

    return (
      <span className={`badge ${cls[role] || "badge-neutral"}`}>
        {role?.toUpperCase()}
      </span>
    );
  };

  const badgeStatus = (active) => (
    <span className={`badge ${active ? "badge-success" : "badge-neutral"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );

  const columns = ["User", "Email", "Role", "Status", "Actions"];

  const renderRow = (u) => (
    <tr key={u.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">
            {(u.full_name || "U")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div className="table-user-info">
            <h4>{u.full_name}</h4>
            <p>ID: {u.id}</p>
          </div>
        </div>
      </td>

      <td>{u.email}</td>
      <td>{badgeRole(u.role)}</td>
      <td>{badgeStatus(u.is_active)}</td>

      <td>
        <div className="table-actions">
          <button
            className="table-action-btn"
            onClick={() => toggleStatus(u.id)}
          >
            {u.is_active ? "🔒" : "🔓"}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Navbar
        title="Access Control"
        subtitle="Manage users & permissions"
        onHamburgerClick={() => setMobileOpen(true)}
      />

      <div className="dashboard-page">

        <div className="page-header">
          <div className="page-header-left">
            <h2>All Users ({filtered.length})</h2>
            <p>Admin controlled secure access panel</p>
          </div>

          <div className="page-header-actions">
            <button className="btn btn-outline" onClick={loadUsers}>
              Refresh
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Create User
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option>All</option>
            <option>admin</option>
            <option>hr</option>
            <option>vendor</option>
            <option>manager</option>
          </select>
        </div>

        <Table
          columns={columns}
          data={filtered}
          renderRow={renderRow}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />

        {loading && <p>Loading...</p>}

        {showModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Create User</h2>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>

              <form onSubmit={handleCreateUser}>
                <div className="modal-body">

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      className="form-input"
                      required
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          full_name: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-input"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value
                        })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="hr">HR</option>
                      <option value="vendor">Vendor</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

export default Users;