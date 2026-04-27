import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiLayers,
  FiCheckCircle,
  FiAlertCircle,
  FiClock
} from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import "@/styles/pipeline.css";
import "@/styles/forms.css";

const API_BASE = "http://localhost:5001/api/candidates";

const stages = [
  "Submitted",
  "Screened",
  "Interview",
  "Offered",
  "Hired",
  "Rejected"
];

function Pipeline() {
  const { setMobileOpen } = useOutletContext();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    job_title: "",
    vendor_name: "",
    notes: ""
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2600);
  };

  /* =====================================================
     FETCH DATA
  ===================================================== */
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}?limit=300`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed");

      setCandidates(data.candidates || []);
    } catch (err) {
      setError(err.message || "Unable to fetch pipeline data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  /* =====================================================
     SEARCH FILTER
  ===================================================== */
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const q = search.toLowerCase();

      return (
        (c.full_name || "").toLowerCase().includes(q) ||
        (c.job_title || "").toLowerCase().includes(q) ||
        (c.vendor_name || "").toLowerCase().includes(q)
      );
    });
  }, [candidates, search]);

  /* =====================================================
     DRAG DROP
  ===================================================== */
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, stage) => {
    e.preventDefault();

    if (!draggedId) return;

    const old = [...candidates];

    setCandidates((prev) =>
      prev.map((item) =>
        item.id === draggedId
          ? { ...item, status: stage }
          : item
      )
    );

    try {
      const res = await fetch(
        `${API_BASE}/${draggedId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: stage })
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      showToast(`Moved to ${stage}`);
    } catch (err) {
      setCandidates(old);
      showToast(err.message, "error");
    }

    setDraggedId(null);
  };

  /* =====================================================
     FORM
  ===================================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const clearForm = () => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      job_title: "",
      vendor_name: "",
      notes: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message);
      }

      showToast("Candidate Added");
      setShowModal(false);
      clearForm();
      fetchCandidates();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     COUNTS
  ===================================================== */
  const stageCount = (stage) =>
    filteredCandidates.filter(
      (c) => c.status === stage
    ).length;

  const totalHired = stageCount("Hired");
  const totalPending =
    stageCount("Submitted") +
    stageCount("Screened") +
    stageCount("Interview") +
    stageCount("Offered");

  const totalRejected = stageCount("Rejected");

  /* =====================================================
     UI
  ===================================================== */
  return (
    <>
      <Navbar
        title="Candidate Pipeline"
        subtitle="Advanced Hiring Workflow Board"
        onHamburgerClick={() => setMobileOpen(true)}
      />

      <div className="dashboard-page">

        {/* TOP HERO */}
        <div className="page-header">
          <div className="page-header-left">
            <h2>
              Pipeline Board
            </h2>
            <p>
              Manage candidate journey using drag & drop
            </p>
          </div>

          <div className="page-header-actions">
            <button
              className="btn btn-outline"
              onClick={fetchCandidates}
            >
              <FiRefreshCw />
              Refresh
            </button>

            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <FiPlus />
              Submit Candidate
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <FiLayers />
            <h3>{filteredCandidates.length}</h3>
            <p>Total</p>
          </div>

          <div className="stat-card green">
            <FiCheckCircle />
            <h3>{totalHired}</h3>
            <p>Hired</p>
          </div>

          <div className="stat-card orange">
            <FiClock />
            <h3>{totalPending}</h3>
            <p>In Progress</p>
          </div>

          <div className="stat-card red">
            <FiAlertCircle />
            <h3>{totalRejected}</h3>
            <p>Rejected</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="filter-bar">
          <div className="search-bar">
            <FiSearch />
            <input
              type="text"
              placeholder="Search candidate / job / vendor..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* BOARD */}
        {loading ? (
          <Loader />
        ) : (
          <div className="pipeline-board">
            {stages.map((stage) => {
              const stageItems =
                filteredCandidates.filter(
                  (item) =>
                    item.status === stage
                );

              return (
                <div
                  key={stage}
                  className="pipeline-column"
                  onDragOver={handleDragOver}
                  onDrop={(e) =>
                    handleDrop(e, stage)
                  }
                >
                  <div className="pipeline-column-header">
                    <h3>{stage}</h3>
                    <span className="badge badge-neutral">
                      {stageItems.length}
                    </span>
                  </div>

                  <div className="pipeline-column-body">

                    {stageItems.map((c) => (
                      <div
                        key={c.id}
                        className={`pipeline-card ${
                          draggedId === c.id
                            ? "dragging"
                            : ""
                        }`}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(
                            e,
                            c.id
                          )
                        }
                      >
                        <div className="pipeline-card-header">
                          <h4>
                            {c.full_name}
                          </h4>

                          <span>
                            {new Date(
                              c.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <p>
                          <FiBriefcase />
                          {c.job_title ||
                            "No Role"}
                        </p>

                        <small>
                          <FiLayers />
                          {c.vendor_name ||
                            "Direct Source"}
                        </small>

                        {c.email && (
                          <small>
                            <FiMail />
                            {c.email}
                          </small>
                        )}

                        {c.phone && (
                          <small>
                            <FiPhone />
                            {c.phone}
                          </small>
                        )}
                      </div>
                    ))}

                    {stageItems.length ===
                      0 && (
                      <div className="pipeline-drop-zone">
                        Drop Here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div
            className="modal-overlay"
            onClick={() =>
              setShowModal(false)
            }
          >
            <div
              className="modal-content slide-up"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="modal-header">
                <h2>
                  New Candidate
                </h2>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  <FiX />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
              >
                <div className="modal-body">

                  <div className="form-group">
                    <label className="form-label">
                      Full Name *
                    </label>
                    <input
                      className="form-input"
                      name="full_name"
                      required
                      value={
                        formData.full_name
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        Email
                      </label>
                      <input
                        className="form-input"
                        name="email"
                        value={
                          formData.email
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Phone
                      </label>
                      <input
                        className="form-input"
                        name="phone"
                        value={
                          formData.phone
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        Job Title
                      </label>
                      <input
                        className="form-input"
                        name="job_title"
                        value={
                          formData.job_title
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Vendor
                      </label>
                      <input
                        className="form-input"
                        name="vendor_name"
                        value={
                          formData.vendor_name
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Notes
                    </label>
                    <textarea
                      className="form-textarea"
                      rows="3"
                      name="notes"
                      value={
                        formData.notes
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={
                      submitting
                    }
                  >
                    {submitting
                      ? "Saving..."
                      : "Create Candidate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div
            className={`toast ${toast.type}`}
          >
            {toast.message}
          </div>
        )}

      </div>
    </>
  );
}

export default Pipeline;