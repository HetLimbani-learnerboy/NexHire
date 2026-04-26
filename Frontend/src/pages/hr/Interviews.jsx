import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import "@/styles/forms.css";

const API_BASE = "http://localhost:5001/api/interviews";
const CANDIDATES_API = "http://localhost:5001/api/candidates";

function Interviews() {
  const { setMobileOpen } = useOutletContext();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [interviews, setInterviews] = useState([]);
  const [candidatesList, setCandidatesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState("All");

  // ── Schedule modal ──────────────────────────────────────────────────────────
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    candidate_name: "", candidate_id: null, role: "", interview_date: "", interview_time: "", mode: "Video", meeting_link: "",
  });

  // ── Feedback modal ──────────────────────────────────────────────────────────
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 3, remarks: "", recommendation: "Hire",
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // ── Toast ───────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch interviews ────────────────────────────────────────────────────────
  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "All") params.append("status", filterStatus);

      const res = await fetch(`${API_BASE}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch interviews");
      const data = await res.json();
      setInterviews(data.interviews || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to connect to the server. Make sure the backend is running on port 5001.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  // ── Fetch candidates for the schedule dropdown ──────────────────────────────
  const fetchCandidates = useCallback(async () => {
    try {
      const res = await fetch(`${CANDIDATES_API}?limit=200`);
      if (res.ok) {
        const data = await res.json();
        setCandidatesList(data.candidates || []);
      }
    } catch { /* silent — dropdown just has less options */ }
  }, []);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);
  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // ── Schedule interview ──────────────────────────────────────────────────────
  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleForm.candidate_name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      showToast("Interview scheduled!");
      setShowScheduleModal(false);
      setScheduleForm({ candidate_name: "", candidate_id: null, role: "", interview_date: "", interview_time: "", mode: "Video", meeting_link: "" });
      fetchInterviews();
    } catch (err) {
      showToast(err.message || "Failed to schedule", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Feedback ────────────────────────────────────────────────────────────────
  const openFeedbackModal = (interview) => {
    setSelectedInterview(interview);
    if (interview.feedback_rating) {
      setFeedbackForm({
        rating: interview.feedback_rating,
        remarks: interview.feedback_remarks || "",
        recommendation: interview.feedback_recommendation || "Hire",
      });
    } else {
      setFeedbackForm({ rating: 3, remarks: "", recommendation: "Hire" });
    }
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedInterview) return;

    setFeedbackSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/${selectedInterview.id}/feedback`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      showToast("Feedback submitted!");
      setShowFeedbackModal(false);
      setSelectedInterview(null);
      fetchInterviews();
    } catch (err) {
      showToast(err.message || "Failed to submit feedback", "error");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // ── Delete interview ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this interview?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      showToast("Interview deleted");
      fetchInterviews();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getStatusBadge = (s) => {
    const m = { Scheduled: "badge-warning", Completed: "badge-success", Cancelled: "badge-danger" };
    return <span className={`badge ${m[s] || "badge-neutral"}`}>{s}</span>;
  };

  const renderStars = (rating, interactive, onChange) => (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          style={{
            cursor: interactive ? "pointer" : "default",
            fontSize: "1.5rem",
            color: s <= rating ? "#f59e0b" : "var(--gray-300)",
            transition: "var(--transition-fast)",
          }}
          onClick={() => interactive && onChange && onChange(s)}
        >★</span>
      ))}
    </div>
  );

  const hasFeedback = (i) => !!i.feedback_rating;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar title="Interviews" subtitle="Schedule interviews and capture feedback" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page fade-in">
        <div className="page-header">
          <div className="page-header-left">
            <h2>All Interviews ({interviews.length})</h2>
            <p>Schedule, manage, and provide feedback for candidate interviews</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)} id="schedule-interview-btn">+ Schedule Interview</button>
          </div>
        </div>

        <div className="filter-bar">
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Error state */}
        {error && (
          <div style={{
            background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px",
            padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center",
            gap: "12px", color: "#dc2626", fontSize: "14px", fontWeight: 500,
          }}>
            <span>⚠️</span><span>{error}</span>
            <button onClick={fetchInterviews} style={{
              marginLeft: "auto", background: "#dc2626", color: "white", border: "none",
              borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontWeight: 600, fontSize: "13px",
            }}>Retry</button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="dashboard-card">
            <div className="data-table-container" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Role</th>
                    <th>Date & Time</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                        No interviews found. Click "+ Schedule Interview" to create one.
                      </td>
                    </tr>
                  ) : (
                    interviews.map(interview => (
                      <tr key={interview.id}>
                        <td style={{ fontWeight: 500 }}>{interview.candidate_name}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{interview.role || "—"}</td>
                        <td>
                          {interview.interview_date
                            ? new Date(interview.interview_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                            : "—"}
                          <br />
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{interview.interview_time || ""}</span>
                        </td>
                        <td>
                          <span className={`badge ${interview.mode === "Video" ? "badge-info" : "badge-neutral"}`}>
                            {interview.mode === "Video" ? "📹" : "🏢"} {interview.mode}
                          </span>
                          {interview.meeting_link && (
                            <a
                              href={interview.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: "block", fontSize: "0.8rem", color: "var(--info)", marginTop: "0.25rem" }}
                            >Join Link ↗</a>
                          )}
                        </td>
                        <td>{getStatusBadge(interview.status)}</td>
                        <td>
                          {hasFeedback(interview) ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              {renderStars(interview.feedback_rating, false)}
                              <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                ({interview.feedback_recommendation})
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>—</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="table-action-btn"
                              title={hasFeedback(interview) ? "View Feedback" : "Add Feedback"}
                              onClick={() => openFeedbackModal(interview)}
                            >
                              {hasFeedback(interview) ? "📋" : "✎"}
                            </button>
                            <button
                              className="table-action-btn"
                              title="Delete"
                              style={{ color: "var(--danger)" }}
                              onClick={() => handleDelete(interview.id)}
                            >🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Schedule Interview Modal ──────────────────────────────────────── */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Interview</h2>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSchedule}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Candidate Name *</label>
                  {candidatesList.length > 0 ? (
                    <select
                      className="form-select"
                      required
                      value={scheduleForm.candidate_name}
                      onChange={e => {
                        const name = e.target.value;
                        const c = candidatesList.find(c => c.full_name === name);
                        setScheduleForm({ ...scheduleForm, candidate_name: name, candidate_id: c?.id || null, role: c?.job_title || scheduleForm.role });
                      }}
                    >
                      <option value="">Select candidate</option>
                      {candidatesList.map(c => (
                        <option key={c.id} value={c.full_name}>{c.full_name} — {c.job_title || "No role"}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter candidate name"
                      required
                      value={scheduleForm.candidate_name}
                      onChange={e => setScheduleForm({ ...scheduleForm, candidate_name: e.target.value })}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="form-input" type="text" placeholder="e.g. Senior React Developer" value={scheduleForm.role} onChange={e => setScheduleForm({ ...scheduleForm, role: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Interview Date *</label>
                    <input className="form-input" type="date" required value={scheduleForm.interview_date} onChange={e => setScheduleForm({ ...scheduleForm, interview_date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Interview Time *</label>
                    <input className="form-input" type="time" required value={scheduleForm.interview_time} onChange={e => setScheduleForm({ ...scheduleForm, interview_time: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Mode</label>
                  <select className="form-select" value={scheduleForm.mode} onChange={e => setScheduleForm({ ...scheduleForm, mode: e.target.value })}>
                    <option value="Video">Video Call</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
                {scheduleForm.mode === "Video" && (
                  <div className="form-group">
                    <label className="form-label">Meeting Link</label>
                    <input className="form-input" type="url" placeholder="https://meet.google.com/..." value={scheduleForm.meeting_link} onChange={e => setScheduleForm({ ...scheduleForm, meeting_link: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={submitting}>
                  {submitting ? "Scheduling..." : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Feedback Modal ────────────────────────────────────────────────── */}
      {showFeedbackModal && selectedInterview && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div className="modal-header">
              <h2>{hasFeedback(selectedInterview) ? "View" : "Submit"} Feedback — {selectedInterview.candidate_name}</h2>
              <button className="modal-close" onClick={() => setShowFeedbackModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitFeedback}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Technical Rating</label>
                  {renderStars(feedbackForm.rating, !hasFeedback(selectedInterview), (val) => setFeedbackForm({ ...feedbackForm, rating: val }))}
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Remarks</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="Share detailed feedback about the candidate's performance..."
                    value={feedbackForm.remarks}
                    onChange={e => setFeedbackForm({ ...feedbackForm, remarks: e.target.value })}
                    readOnly={hasFeedback(selectedInterview)}
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Recommendation</label>
                  <select
                    className="form-select"
                    value={feedbackForm.recommendation}
                    onChange={e => setFeedbackForm({ ...feedbackForm, recommendation: e.target.value })}
                    disabled={hasFeedback(selectedInterview)}
                  >
                    <option value="Hire">👍 Hire</option>
                    <option value="Hold">⏸ Hold</option>
                    <option value="Reject">👎 Reject</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowFeedbackModal(false)}>
                  {hasFeedback(selectedInterview) ? "Close" : "Cancel"}
                </button>
                {!hasFeedback(selectedInterview) && (
                  <button type="submit" className="btn btn-success" disabled={feedbackSubmitting}>
                    {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px",
          background: toast.type === "success" ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #dc2626, #ef4444)",
          color: "white", padding: "14px 24px", borderRadius: "12px", fontWeight: 600, fontSize: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)", zIndex: 9999, display: "flex", alignItems: "center", gap: "10px",
        }}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}
    </>
  );
}

export default Interviews;
