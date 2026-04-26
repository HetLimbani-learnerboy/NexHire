import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import "@/styles/forms.css";

const API_BASE = "http://localhost:5001/api/jobs";

const EMPTY_FORM = {
  title: "",
  department: "",
  skills: "",
  budget: "",
  deadline: "",
  priority: "Medium",
  experience_level: "",
  employment_type: "",
  location: "",
  openings: 1,
  description: "",
};

function Jobs() {
  const { setMobileOpen } = useOutletContext();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });

  // ── Filter state ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit" | "view"
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // ── Toast notification ──────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch jobs from API ─────────────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "All") params.append("status", filterStatus);
      if (filterPriority !== "All") params.append("priority", filterPriority);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", currentPage);
      params.append("limit", 10);

      const res = await fetch(`${API_BASE}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();

      setJobs(data.jobs || []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalCount: 0 });
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to connect to the server. Make sure the backend is running on port 5001.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, searchQuery, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPriority, searchQuery]);

  // ── Form helpers ────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ ...EMPTY_FORM });
    setEditingId(null);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setModalMode("edit");
    setEditingId(job.id);
    setFormData({
      title: job.title || "",
      department: job.department || "",
      skills: job.skills || "",
      budget: job.budget || "",
      deadline: job.deadline ? job.deadline.split("T")[0] : "",
      priority: job.priority || "Medium",
      experience_level: job.experience_level || "",
      employment_type: job.employment_type || "",
      location: job.location || "",
      openings: job.openings || 1,
      description: job.description || "",
    });
    setFormError(null);
    setShowModal(true);
  };

  const openViewModal = (job) => {
    setModalMode("view");
    setEditingId(job.id);
    setFormData({
      title: job.title || "",
      department: job.department || "",
      skills: job.skills || "",
      budget: job.budget || "",
      deadline: job.deadline ? job.deadline.split("T")[0] : "",
      priority: job.priority || "Medium",
      experience_level: job.experience_level || "",
      employment_type: job.employment_type || "",
      location: job.location || "",
      openings: job.openings || 1,
      description: job.description || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
    setSubmitting(false);
  };

  // ── Create / Update job ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setFormError("Job title is required");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const url = modalMode === "edit" ? `${API_BASE}/${editingId}` : API_BASE;
      const method = modalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          openings: parseInt(formData.openings, 10) || 1,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Operation failed");
      }

      showToast(
        modalMode === "edit" ? "Job updated successfully!" : "Job created successfully!",
        "success"
      );
      closeModal();
      fetchJobs();
    } catch (err) {
      console.error("Submit error:", err);
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete job ──────────────────────────────────────────────────────────────
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message);

      showToast("Job deleted successfully!", "success");
      fetchJobs();
    } catch (err) {
      showToast(err.message || "Failed to delete job", "error");
    }
  };

  // ── Quick status change ─────────────────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message);

      showToast(`Job status changed to ${newStatus}`, "success");
      fetchJobs();
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  // ── Badges ──────────────────────────────────────────────────────────────────
  const getStatusBadge = (s) => {
    const m = { Open: "badge-success", Closed: "badge-danger", "On Hold": "badge-neutral", "Pending Approval": "badge-warning" };
    return <span className={`badge ${m[s] || "badge-neutral"}`}>{s}</span>;
  };

  const getPriorityBadge = (p) => {
    const m = { High: "badge-danger", Medium: "badge-warning", Low: "badge-neutral" };
    return <span className={`badge ${m[p] || "badge-neutral"}`}>{p}</span>;
  };

  // ── Parse skills from DB string to array for display ────────────────────────
  const parseSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(",").map((s) => s.trim()).filter(Boolean);
  };

  // ── Table ───────────────────────────────────────────────────────────────────
  const columns = ["Job Title", "Skills", "Budget", "Deadline", "Priority", "Status", "Actions"];

  const renderRow = (job) => (
    <tr key={job.id}>
      <td>
        <div className="table-user-info">
          <h4>{job.title}</h4>
          <p>{job.department || "—"}</p>
        </div>
      </td>
      <td>
        <div className="skills-tags">
          {parseSkills(job.skills).slice(0, 3).map((s) => (
            <span className="skill-tag" key={s}>{s}</span>
          ))}
        </div>
      </td>
      <td style={{ fontWeight: 600 }}>{job.budget || "—"}</td>
      <td>
        {job.deadline
          ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          : "—"}
      </td>
      <td>{getPriorityBadge(job.priority)}</td>
      <td>{getStatusBadge(job.status)}</td>
      <td>
        <div className="table-actions">
          {job.status === "Pending Approval" && (
            <>
              <button
                className="table-action-btn"
                title="Approve"
                style={{ color: "var(--success)" }}
                onClick={() => handleStatusChange(job.id, "Open")}
              >✅</button>
              <button
                className="table-action-btn"
                title="Reject"
                style={{ color: "var(--danger)" }}
                onClick={() => handleStatusChange(job.id, "Closed")}
              >❌</button>
            </>
          )}
          <button className="table-action-btn" title="View" onClick={() => openViewModal(job)}>👁</button>
          <button className="table-action-btn" title="Edit" onClick={() => openEditModal(job)}>✏️</button>
          <button
            className="table-action-btn"
            title="Delete"
            style={{ color: "var(--danger)" }}
            onClick={() => handleDelete(job.id, job.title)}
          >🗑️</button>
        </div>
      </td>
    </tr>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar title="Jobs" subtitle="Manage job requisitions and vendor assignments" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Job Requisitions ({pagination.totalCount})</h2>
            <p>Create, assign, and track open positions</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={openCreateModal} id="add-job-btn">+ Create Job</button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="job-search" />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} id="job-status-filter">
            <option value="All">All Status</option><option value="Open">Open</option><option value="Pending Approval">Pending Approval</option><option value="Closed">Closed</option><option value="On Hold">On Hold</option>
          </select>
          <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} id="job-priority-filter">
            <option value="All">All Priority</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
          </select>
        </div>

        {/* Error state */}
        {error && (
          <div style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#dc2626",
            fontSize: "14px",
            fontWeight: 500,
          }}>
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={fetchJobs}
              style={{
                marginLeft: "auto",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >Retry</button>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            data={jobs}
            renderRow={renderRow}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        {/* ── Create / Edit / View Modal ──────────────────────────────────── */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {modalMode === "create" && "Create New Job"}
                  {modalMode === "edit" && "Edit Job"}
                  {modalMode === "view" && "Job Details"}
                </h2>
                <button className="modal-close" onClick={closeModal}>✕</button>
              </div>

              {formError && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  marginBottom: "16px",
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 500,
                }}>
                  ⚠️ {formError}
                </div>
              )}

              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    className="form-input"
                    type="text"
                    name="title"
                    placeholder="e.g. Senior React Developer"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    id="job-title-input"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      id="job-department-select"
                    >
                      <option value="">Select department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Analytics">Analytics</option>
                      <option value="QA">QA</option>
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience Level</label>
                    <select
                      className="form-select"
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      id="job-experience-select"
                    >
                      <option value="">Select level</option>
                      <option value="Intern">Intern</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills</label>
                  <input
                    className="form-input"
                    type="text"
                    name="skills"
                    placeholder="React, Node.js, TypeScript (comma-separated)"
                    value={formData.skills}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    id="job-skills-input"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Budget Range</label>
                    <input
                      className="form-input"
                      type="text"
                      name="budget"
                      placeholder="e.g. ₹18-22L"
                      value={formData.budget}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      id="job-budget-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Openings</label>
                    <input
                      className="form-input"
                      type="number"
                      name="openings"
                      min="1"
                      value={formData.openings}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      id="job-openings-input"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      className="form-input"
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      id="job-deadline-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      id="job-priority-select"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Employment Type</label>
                    <select
                      className="form-select"
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      id="job-employment-select"
                    >
                      <option value="">Select type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      className="form-input"
                      type="text"
                      name="location"
                      placeholder="e.g. Bangalore, Remote"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={modalMode === "view"}
                      id="job-location-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    name="description"
                    placeholder="Job description, responsibilities, etc."
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    rows={3}
                    id="job-description-input"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-outline" onClick={closeModal}>
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
                {modalMode !== "view" && (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={submitting}
                    id="job-submit-btn"
                  >
                    {submitting
                      ? "Saving..."
                      : modalMode === "edit"
                        ? "Update Job"
                        : "Create Job"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Toast Notification ──────────────────────────────────────── */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: toast.type === "success"
                ? "linear-gradient(135deg, #059669, #10b981)"
                : "linear-gradient(135deg, #dc2626, #ef4444)",
              color: "white",
              padding: "14px 24px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              zIndex: 9999,
              animation: "slideUp 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {toast.type === "success" ? "✅" : "❌"} {toast.message}
          </div>
        )}
      </div>
    </>
  );
}

export default Jobs;