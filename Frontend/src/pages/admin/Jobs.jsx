import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import Skeleton from "@/components/Skeleton";
import "../../styles/forms.css";

import {
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiFilter,
  FiRefreshCw
} from "react-icons/fi";

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

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toastMsg = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2600);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (filterStatus !== "All") params.append("status", filterStatus);
      if (filterPriority !== "All") params.append("priority", filterPriority);

      params.append("page", currentPage);
      params.append("limit", 10);

      const res = await fetch(`${API_BASE}?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Unable to fetch jobs");

      setJobs(data.jobs || []);
      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
        }
      );
    } catch (err) {
      setError(err.message || "Server connection failed");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus, filterPriority, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterPriority]);

  const closeModal = () => {
    setShowModal(false);
    setSubmitting(false);
    setFormError("");
    setEditingId(null);
  };

  const openCreate = () => {
    setModalMode("create");
    setFormData({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (job) => {
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
    setShowModal(true);
  };

  const openView = (job) => {
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

  const onInput = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const submitForm = async () => {
    if (!formData.title.trim()) {
      setFormError("Job title required");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const url =
        modalMode === "edit" ? `${API_BASE}/${editingId}` : API_BASE;

      const method = modalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          openings: parseInt(formData.openings) || 1,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Operation failed");
      }

      toastMsg(
        modalMode === "edit"
          ? "Job updated successfully"
          : "Job created successfully"
      );

      closeModal();
      fetchJobs();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const removeJob = async (id, title) => {
    const ok = window.confirm(`Delete "${title}" ?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      toastMsg("Job deleted");
      fetchJobs();
    } catch (err) {
      toastMsg(err.message, "error");
    }
  };

  const quickStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      toastMsg(`Status changed to ${status}`);
      fetchJobs();
    } catch (err) {
      toastMsg(err.message, "error");
    }
  };

  const statusBadge = (status) => {
    const map = {
      Open: "badge green",
      Closed: "badge red",
      "Pending Approval": "badge yellow",
      "On Hold": "badge gray",
    };

    return <span className={map[status] || "badge gray"}>{status}</span>;
  };

  const priorityBadge = (p) => {
    const map = {
      High: "badge red",
      Medium: "badge yellow",
      Low: "badge gray",
    };

    return <span className={map[p] || "badge gray"}>{p}</span>;
  };

  const parseSkills = (skills) => {
    if (!skills) return [];
    return skills.split(",").map((x) => x.trim());
  };

  const columns = [
    "Title",
    "Skills",
    "Budget",
    "Deadline",
    "Priority",
    "Status",
    "Actions",
  ];

  const renderRow = (job) => (
    <tr key={job.id}>
      <td>
        <div className="job-main">
          <div className="job-avatar">
            <FiBriefcase />
          </div>
          <div>
            <h4>{job.title}</h4>
            <p>{job.department || "Department"}</p>
          </div>
        </div>
      </td>

      <td>
        <div className="skills-wrap">
          {parseSkills(job.skills)
            .slice(0, 3)
            .map((s) => (
              <span className="skill-pill" key={s}>
                {s}
              </span>
            ))}
        </div>
      </td>

      <td>₹ {job.budget || "--"}</td>

      <td>
        {job.deadline
          ? new Date(job.deadline).toLocaleDateString()
          : "--"}
      </td>

      <td>{priorityBadge(job.priority)}</td>
      <td>{statusBadge(job.status)}</td>

      <td>
        <div className="action-group">
          {job.status === "Pending Approval" && (
            <>
              <button
                className="icon-btn approve"
                onClick={() => quickStatus(job.id, "Open")}
              >
                <FiCheckCircle />
              </button>

              <button
                className="icon-btn reject"
                onClick={() => quickStatus(job.id, "Closed")}
              >
                <FiXCircle />
              </button>
            </>
          )}

          <button className="icon-btn view" onClick={() => openView(job)}>
            <FiEye />
          </button>

          <button className="icon-btn edit" onClick={() => openEdit(job)}>
            <FiEdit3 />
          </button>

          <button
            className="icon-btn delete"
            onClick={() => removeJob(job.id, job.title)}
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Navbar
        title="Jobs"
        subtitle="Manage requisitions and hiring needs"
        onHamburgerClick={() => setMobileOpen(true)}
      />

      <div className="jobs-page">
        <div className="hero-top">
          <div>
            <h2>Job Requisitions</h2>
            <p>Total Jobs : {pagination.totalCount}</p>
          </div>

          <button className="create-btn" onClick={openCreate}>
            <FiPlus />
            Create Job
          </button>
        </div>

        <div className="mini-cards">
          <div className="mini-card">
            <FiBriefcase />
            <span>{pagination.totalCount}</span>
            <p>Total Jobs</p>
          </div>

          <div className="mini-card">
            <FiUsers />
            <span>{jobs.filter((j) => j.status === "Open").length}</span>
            <p>Open Roles</p>
          </div>

          <div className="mini-card">
            <FiCalendar />
            <span>{jobs.filter((j) => j.priority === "High").length}</span>
            <p>High Priority</p>
          </div>

          <div className="mini-card">
            <FiDollarSign />
            <span>{jobs.length}</span>
            <p>Active List</p>
          </div>
        </div>

        <div className="filter-box">
          <div className="search-box">
            <FiSearch />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
            />
          </div>

          <div className="select-wrap">
            <FiFilter />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Open</option>
              <option>Closed</option>
              <option>Pending Approval</option>
              <option>On Hold</option>
            </select>
          </div>

          <div className="select-wrap">
            <FiFilter />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <button className="refresh-btn" onClick={fetchJobs}>
            <FiRefreshCw />
          </button>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {loading ? (
          <Skeleton type="table" />
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

        {showModal && (
          <div className="modal-wrap" onClick={closeModal}>
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <h3>
                  {modalMode === "create" && "Create Job"}
                  {modalMode === "edit" && "Edit Job"}
                  {modalMode === "view" && "View Job"}
                </h3>

                <button onClick={closeModal}>
                  <FiX />
                </button>
              </div>

              {formError && (
                <div className="error-box small">
                  {formError}
                </div>
              )}

              <div className="grid-2">
                <input
                  name="title"
                  placeholder="Job Title"
                  value={formData.title}
                  onChange={onInput}
                  disabled={modalMode === "view"}
                />

                <input
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={onInput}
                  disabled={modalMode === "view"}
                />

                <input
                  name="skills"
                  placeholder="Skills"
                  value={formData.skills}
                  onChange={onInput}
                  disabled={modalMode === "view"}
                />

                <input
                  name="budget"
                  placeholder="Budget"
                  value={formData.budget}
                  onChange={onInput}
                  disabled={modalMode === "view"}
                />

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={onInput}
                  disabled={modalMode === "view"}
                />

                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={onInput}
                  disabled={modalMode === "view"}
                />

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={onInput}
                  disabled={modalMode === "view"}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <input
                  type="number"
                  name="openings"
                  value={formData.openings}
                  onChange={onInput}
                  disabled={modalMode === "view"}
                />
              </div>

              <textarea
                rows="4"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={onInput}
                disabled={modalMode === "view"}
              />

              <div className="modal-foot">
                <button className="ghost-btn" onClick={closeModal}>
                  Cancel
                </button>

                {modalMode !== "view" && (
                  <button
                    className="save-btn"
                    onClick={submitForm}
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save Job"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    </>
  );
}

export default Jobs;