import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import api from "@/utils/api";
import "@/styles/forms.css";

function ReviewCandidates() {
  const { setMobileOpen } = useOutletContext();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/reviews");
      const data = await res.json();
      if (data.success) {
        setCandidates(data.reviews);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = candidates.filter(c => c.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.role?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleReview = (candidate) => {
    setSelectedCandidate(candidate);
    setShowProfileModal(true);
  };

  const markAsReviewed = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${selectedCandidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Reviewed" })
      });
      const data = await res.json();
      if (data.success) {
        fetchReviews();
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRejected = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${selectedCandidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" })
      });
      const data = await res.json();
      if (data.success) {
        fetchReviews();
        setShowProfileModal(false);
        alert("Candidate rejected.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderRow = (candidate) => (
    <tr key={candidate.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">{candidate.candidate_name?.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
          <div className="table-user-info">
            <h4>{candidate.candidate_name}</h4>
            <p>ID: {candidate.id || candidate.candidate_id}</p>
          </div>
        </div>
      </td>
      <td>{candidate.role}</td>
      <td>{candidate.experience}</td>
      <td><span className="badge badge-neutral">{candidate.source}</span></td>
      <td>
        <span className={`badge ${candidate.status === "Pending Review" ? "badge-warning" : "badge-success"}`}>
          {candidate.status}
        </span>
      </td>
      <td>
        <button className="btn btn-sm btn-outline" onClick={() => handleReview(candidate)}>
          {candidate.status === "Reviewed" ? "View Profile" : "Review Profile"}
        </button>
      </td>
    </tr>
  );

  return (
    <>
      <Navbar title="Review Candidates" subtitle="Evaluate profiles screened by HR" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Candidates Ready for Review ({filtered.length})</h2>
            <p>Review resumes and decide whether to proceed to interview.</p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar" style={{ width: "100%", maxWidth: "400px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search by name or role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <Table columns={["Candidate", "Role", "Experience", "Source", "Status", "Action"]} data={filtered} renderRow={renderRow} currentPage={1} totalPages={1} onPageChange={() => {}} />

        {showProfileModal && selectedCandidate && (
          <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
              <div className="modal-header">
                <h2>Candidate Profile: {selectedCandidate.candidate_name}</h2>
                <button className="modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                  <div className="vendor-perf-avatar" style={{ width: "80px", height: "80px", fontSize: "24px" }}>
                    {selectedCandidate.candidate_name?.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 8px" }}>{selectedCandidate.candidate_name}</h3>
                    <p style={{ margin: "0 0 4px", color: "var(--text-secondary)" }}><strong>Role:</strong> {selectedCandidate.role}</p>
                    <p style={{ margin: "0 0 4px", color: "var(--text-secondary)" }}><strong>Experience:</strong> {selectedCandidate.experience}</p>
                    <p style={{ margin: 0, color: "var(--text-secondary)" }}><strong>Submitted by:</strong> {selectedCandidate.source}</p>
                  </div>
                </div>

                <div className="dashboard-card" style={{ padding: "20px", background: "var(--gray-50)", border: "1px solid var(--gray-200)" }}>
                  <h4 style={{ margin: "0 0 10px" }}>Resume Summary (Parsed via AI)</h4>
                  <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-primary)" }}>
                    Strong candidate with 5 years of experience building scalable web applications. Proficient in React, Node.js, and TypeScript.
                    Led a team of 3 developers in previous role. Good communication skills.
                  </p>
                  <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["React", "Node.js", "TypeScript", "AWS", "GraphQL"].map(skill => (
                      <span key={skill} className="badge badge-info">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={markAsRejected}>Reject</button>
                <button className="btn btn-outline" onClick={() => setShowProfileModal(false)}>Close</button>
                {(selectedCandidate.status === "Pending Review" || !selectedCandidate.status) && (
                  <button className="btn btn-success" onClick={markAsReviewed}>Mark as Reviewed & Select for Interview</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReviewCandidates;
