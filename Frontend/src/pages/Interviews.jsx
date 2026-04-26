import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/forms.css";

const initialInterviews = [
  { id: 1, candidate: "Aditya Patel", role: "Senior React Developer", date: "2026-04-28", time: "10:00", mode: "Video", link: "https://meet.google.com/abc-def-ghi", status: "Scheduled", feedback: null },
  { id: 2, candidate: "Priyanka Das", role: "UI/UX Designer", date: "2026-04-28", time: "14:30", mode: "In-Person", link: "", status: "Scheduled", feedback: null },
  { id: 3, candidate: "Ananya Reddy", role: "Product Manager", date: "2026-04-29", time: "11:00", mode: "Video", link: "https://meet.google.com/xyz-uvw-rst", status: "Scheduled", feedback: null },
  { id: 4, candidate: "Sneha Sharma", role: "Full Stack Developer", date: "2026-04-25", time: "09:00", mode: "Video", link: "", status: "Completed", feedback: { rating: 4, remarks: "Strong technical skills. Good communication.", recommendation: "Hire" } },
  { id: 5, candidate: "Ravi Verma", role: "DevOps Engineer", date: "2026-04-24", time: "15:00", mode: "In-Person", link: "", status: "Completed", feedback: { rating: 3, remarks: "Needs improvement in Kubernetes. Good AWS knowledge.", recommendation: "Hold" } },
];

function Interviews() {
  const { setMobileOpen } = useOutletContext();
  const [interviews, setInterviews] = useState(initialInterviews);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const [scheduleForm, setScheduleForm] = useState({
    candidate: "", role: "", date: "", time: "", mode: "Video", link: ""
  });

  const [feedbackForm, setFeedbackForm] = useState({
    rating: 3, remarks: "", recommendation: "Hire"
  });

  const filtered = interviews.filter(i => filterStatus === "All" || i.status === filterStatus);

  const handleSchedule = (e) => {
    e.preventDefault();
    const newInterview = {
      id: interviews.length + 1,
      ...scheduleForm,
      status: "Scheduled",
      feedback: null
    };
    setInterviews([...interviews, newInterview]);
    setShowScheduleModal(false);
    setScheduleForm({ candidate: "", role: "", date: "", time: "", mode: "Video", link: "" });
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setInterviews(interviews.map(i =>
      i.id === selectedInterview.id
        ? { ...i, status: "Completed", feedback: { ...feedbackForm } }
        : i
    ));
    setShowFeedbackModal(false);
    setSelectedInterview(null);
    setFeedbackForm({ rating: 3, remarks: "", recommendation: "Hire" });
  };

  const openFeedbackModal = (interview) => {
    setSelectedInterview(interview);
    if (interview.feedback) {
      setFeedbackForm(interview.feedback);
    } else {
      setFeedbackForm({ rating: 3, remarks: "", recommendation: "Hire" });
    }
    setShowFeedbackModal(true);
  };

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
            transition: "var(--transition-fast)"
          }}
          onClick={() => interactive && onChange && onChange(s)}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <>
      <Navbar title="Interviews" subtitle="Schedule interviews and capture feedback" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page fade-in">
        <div className="page-header">
          <div className="page-header-left">
            <h2>All Interviews ({filtered.length})</h2>
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
                {filtered.map(interview => (
                  <tr key={interview.id}>
                    <td style={{ fontWeight: 500 }}>{interview.candidate}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{interview.role}</td>
                    <td>
                      {new Date(interview.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      <br />
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{interview.time}</span>
                    </td>
                    <td>
                      <span className={`badge ${interview.mode === "Video" ? "badge-info" : "badge-neutral"}`}>
                        {interview.mode === "Video" ? "📹" : "🏢"} {interview.mode}
                      </span>
                      {interview.link && (
                        <a
                          href={interview.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "block", fontSize: "0.8rem", color: "var(--info)", marginTop: "0.25rem" }}
                        >
                          Join Link ↗
                        </a>
                      )}
                    </td>
                    <td>{getStatusBadge(interview.status)}</td>
                    <td>
                      {interview.feedback ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          {renderStars(interview.feedback.rating, false)}
                          <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            ({interview.feedback.recommendation})
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
                          title={interview.feedback ? "View Feedback" : "Add Feedback"}
                          onClick={() => openFeedbackModal(interview)}
                        >
                          {interview.feedback ? "📋" : "✎"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
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
                  <label className="form-label">Candidate Name</label>
                  <select className="form-select" required value={scheduleForm.candidate} onChange={e => setScheduleForm({ ...scheduleForm, candidate: e.target.value })}>
                    <option value="">Select candidate</option>
                    <option value="Aditya Patel">Aditya Patel</option>
                    <option value="Sneha Sharma">Sneha Sharma</option>
                    <option value="Ravi Verma">Ravi Verma</option>
                    <option value="Neha Gupta">Neha Gupta</option>
                    <option value="Kavita Singh">Kavita Singh</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="form-input" type="text" placeholder="e.g. Senior React Developer" required value={scheduleForm.role} onChange={e => setScheduleForm({ ...scheduleForm, role: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Date</label>
                  <input className="form-input" type="date" required value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Time</label>
                  <input className="form-input" type="time" required value={scheduleForm.time} onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })} />
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
                    <input className="form-input" type="url" placeholder="https://meet.google.com/..." value={scheduleForm.link} onChange={e => setScheduleForm({ ...scheduleForm, link: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedInterview && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div className="modal-header">
              <h2>{selectedInterview.feedback ? "View" : "Submit"} Feedback — {selectedInterview.candidate}</h2>
              <button className="modal-close" onClick={() => setShowFeedbackModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitFeedback}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Technical Rating</label>
                  {renderStars(feedbackForm.rating, !selectedInterview.feedback, (val) => setFeedbackForm({ ...feedbackForm, rating: val }))}
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Remarks</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="Share detailed feedback about the candidate's performance..."
                    value={feedbackForm.remarks}
                    onChange={e => setFeedbackForm({ ...feedbackForm, remarks: e.target.value })}
                    readOnly={!!selectedInterview.feedback}
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
                    disabled={!!selectedInterview.feedback}
                  >
                    <option value="Hire">👍 Hire</option>
                    <option value="Hold">⏸ Hold</option>
                    <option value="Reject">👎 Reject</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowFeedbackModal(false)}>
                  {selectedInterview.feedback ? "Close" : "Cancel"}
                </button>
                {!selectedInterview.feedback && (
                  <button type="submit" className="btn btn-success">Submit Feedback</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Interviews;
