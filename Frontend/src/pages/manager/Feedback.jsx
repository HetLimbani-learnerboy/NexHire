import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import api from "@/utils/api";
import "@/styles/forms.css";

function Feedback() {
  const { setMobileOpen } = useOutletContext();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  React.useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/interviews");
      const data = await res.json();
      if (data.success) {
        setInterviews(data.interviews);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [feedbackForm, setFeedbackForm] = useState({
    technicalScore: 3,
    cultureScore: 3,
    communicationScore: 3,
    remarks: "",
    recommendation: "Hire"
  });



  const handleOpenFeedback = (interview) => {
    setSelectedInterview(interview);
    if (interview.feedback_rating) {
      // Mock pre-filled data or fetch from backend
      setFeedbackForm({
        technicalScore: interview.feedback_rating, cultureScore: interview.feedback_rating, communicationScore: interview.feedback_rating,
        remarks: interview.feedback_remarks || "", recommendation: interview.feedback_recommendation || "Hire"
      });
    } else {
      setFeedbackForm({ technicalScore: 3, cultureScore: 3, communicationScore: 3, remarks: "", recommendation: "Hire" });
    }
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const avgRating = Math.round((feedbackForm.technicalScore + feedbackForm.cultureScore + feedbackForm.communicationScore) / 3);
    try {
      const res = await fetch(`http://localhost:5001/api/interviews/${selectedInterview.id}/feedback`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: avgRating,
          remarks: feedbackForm.remarks,
          recommendation: feedbackForm.recommendation
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchInterviews();
        setShowFeedbackModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderStars = (rating, interactive, key, onChange) => (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span
          key={s}
          style={{
            cursor: interactive ? "pointer" : "default",
            fontSize: "24px",
            color: s <= rating ? "#f59e0b" : "var(--gray-300)",
            transition: "color 0.2s"
          }}
          onClick={() => interactive && onChange && onChange({ ...feedbackForm, [key]: s })}
        >
          ★
        </span>
      ))}
    </div>
  );

  const renderRow = (interview) => {
    const isSubmitted = !!interview.feedback_rating;
    return (
    <tr key={interview.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">{interview.candidate_name?.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
          <div className="table-user-info">
            <h4>{interview.candidate_name}</h4>
            <p>{interview.id}</p>
          </div>
        </div>
      </td>
      <td>{interview.role}</td>
      <td>{interview.interview_date ? new Date(interview.interview_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</td>
      <td><span className={`badge ${interview.mode === 'Video Call' ? 'badge-info' : 'badge-neutral'}`}>{interview.mode}</span></td>
      <td>
        <span className={`badge ${isSubmitted ? "badge-success" : "badge-warning"}`}>
          {isSubmitted ? "Submitted" : "Pending"}
        </span>
      </td>
      <td>
        <button className="btn btn-sm btn-outline" onClick={() => handleOpenFeedback(interview)}>
          {isSubmitted ? "View Feedback" : "Submit Feedback"}
        </button>
      </td>
    </tr>
  )};

  return (
    <>
      <Navbar title="Interview Feedback" subtitle="Provide your assessment of interviewed candidates" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Pending Feedback ({interviews.filter(i => !i.feedback_rating).length})</h2>
            <p>Please submit feedback for recently completed interviews.</p>
          </div>
        </div>

        <Table columns={["Candidate", "Role", "Interview Date", "Mode", "Feedback Status", "Action"]} data={interviews} renderRow={renderRow} currentPage={1} totalPages={1} onPageChange={() => {}} />

        {showFeedbackModal && selectedInterview && (
          <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
            <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
              <div className="modal-header">
                <h2>{selectedInterview.feedback_rating ? "View" : "Submit"} Feedback: {selectedInterview.candidate_name}</h2>
                <button className="modal-close" onClick={() => setShowFeedbackModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmitFeedback}>
                <div className="modal-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "10px" }}>
                    <div>
                      <label className="form-label">Technical Skills</label>
                      {renderStars(feedbackForm.technicalScore, !selectedInterview.feedback_rating, "technicalScore", setFeedbackForm)}
                    </div>
                    <div>
                      <label className="form-label">Communication</label>
                      {renderStars(feedbackForm.communicationScore, !selectedInterview.feedback_rating, "communicationScore", setFeedbackForm)}
                    </div>
                    <div>
                      <label className="form-label">Culture Fit</label>
                      {renderStars(feedbackForm.cultureScore, !selectedInterview.feedback_rating, "cultureScore", setFeedbackForm)}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Detailed Remarks</label>
                    <textarea
                      className="form-textarea"
                      required
                      placeholder="Share detailed feedback, strengths, weaknesses..."
                      value={feedbackForm.remarks}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, remarks: e.target.value })}
                      disabled={!!selectedInterview.feedback_rating}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Final Recommendation</label>
                    <select
                      className="form-select"
                      value={feedbackForm.recommendation}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, recommendation: e.target.value })}
                      disabled={!!selectedInterview.feedback_rating}
                    >
                      <option value="Strong Hire">Strong Hire</option>
                      <option value="Hire">Hire</option>
                      <option value="Hold">Hold</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
                  {!selectedInterview.feedback_rating && (
                    <button type="submit" className="btn btn-success">Submit Feedback</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Feedback;
