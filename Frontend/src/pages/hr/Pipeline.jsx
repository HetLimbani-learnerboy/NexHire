import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import "@/styles/pipeline.css";
import "@/styles/forms.css";

const API_BASE = "http://localhost:5001/api/candidates";
const stages = ["Submitted", "Screened", "Interview", "Offered", "Hired", "Rejected"];

function Pipeline() {
  const { setMobileOpen } = useOutletContext();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "", email: "", phone: "", job_title: "", vendor_name: "", notes: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch all candidates ────────────────────────────────────────────────────
  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?limit=200`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to connect to the server. Make sure the backend is running on port 5001.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedId) return;

    // Optimistic UI update
    setCandidates(prev => prev.map(c => c.id === draggedId ? { ...c, status: targetStage } : c));
    setDraggedId(null);

    try {
      const res = await fetch(`${API_BASE}/${draggedId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStage }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      showToast(`Moved to ${targetStage}`);
    } catch (err) {
      showToast(err.message || "Failed to update stage", "error");
      fetchCandidates(); // Revert on failure
    }
  };

  // ── Create candidate ───────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      showToast("Candidate submitted!");
      setShowModal(false);
      setFormData({ full_name: "", email: "", phone: "", job_title: "", vendor_name: "", notes: "" });
      fetchCandidates();
    } catch (err) {
      showToast(err.message || "Failed to submit candidate", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar title="Candidate Pipeline" subtitle="Drag and drop candidates to move them through stages" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page" style={{ display: "flex", flexDirection: "column" }}>

        {/* Header with add button */}
        <div className="page-header" style={{ marginBottom: "16px" }}>
          <div className="page-header-left">
            <h2>Pipeline ({candidates.length} candidates)</h2>
            <p>Click + to add, drag cards to change stage</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Submit Candidate</button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div style={{
            background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px",
            padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center",
            gap: "12px", color: "#dc2626", fontSize: "14px", fontWeight: 500,
          }}>
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={fetchCandidates} style={{
              marginLeft: "auto", background: "#dc2626", color: "white", border: "none",
              borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontWeight: 600, fontSize: "13px",
            }}>Retry</button>
          </div>
        )}

        {/* Pipeline board */}
        {loading ? (
          <Loader />
        ) : (
          <div className="pipeline-board">
            {stages.map(stage => {
              const stageCandidates = candidates.filter(c => c.status === stage);
              return (
                <div
                  key={stage}
                  className="pipeline-column"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                >
                  <div className="pipeline-column-header">
                    <h3>{stage}</h3>
                    <span className="badge badge-neutral">{stageCandidates.length}</span>
                  </div>
                  <div className="pipeline-column-body">
                    {stageCandidates.map(c => (
                      <div
                        key={c.id}
                        className={`pipeline-card ${draggedId === c.id ? "dragging" : ""}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, c.id)}
                      >
                        <div className="pipeline-card-header">
                          <h4>{c.full_name}</h4>
                          <span>
                            {c.submitted_at
                              ? new Date(c.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                              : new Date(c.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </span>
                        </div>
                        <p>{c.job_title || "No role assigned"}</p>
                        {c.vendor_name && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>via {c.vendor_name}</span>
                        )}
                      </div>
                    ))}
                    {stageCandidates.length === 0 && (
                      <div className="pipeline-drop-zone">Drop candidate here</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit Candidate Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Submit New Candidate</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" type="text" name="full_name" placeholder="Enter candidate name" required value={formData.full_name} onChange={handleInputChange} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" type="tel" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label">Job / Role</label>
                      <input className="form-input" type="text" name="job_title" placeholder="e.g. Senior React Developer" value={formData.job_title} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vendor</label>
                      <input className="form-input" type="text" name="vendor_name" placeholder="e.g. TechStaff Solutions" value={formData.vendor_name} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-textarea" name="notes" placeholder="Any additional notes..." rows={2} value={formData.notes} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Candidate"}
                  </button>
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
      </div>
    </>
  );
}

export default Pipeline;
