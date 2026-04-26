import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import "@/styles/forms.css";

const initialCandidates = [
  { id: "C001", name: "Aditya Patel", role: "Senior React Developer", experience: "5 Years", source: "TechStaff Solutions", status: "Pending Review" },
  { id: "C002", name: "Sneha Sharma", role: "Full Stack Developer", experience: "3 Years", source: "InnoRecruit", status: "Pending Review" },
  { id: "C003", name: "Ravi Verma", role: "DevOps Engineer", experience: "6 Years", source: "CloudHire Global", status: "Reviewed" }
];

function ReviewCandidates() {
  const { setMobileOpen } = useOutletContext();
  const [candidates, setCandidates] = useState(initialCandidates);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const filtered = candidates.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleReview = (candidate) => {
    setSelectedCandidate(candidate);
    setShowProfileModal(true);
  };

  const markAsReviewed = () => {
    setCandidates(candidates.map(c => c.id === selectedCandidate.id ? { ...c, status: "Reviewed" } : c));
    setShowProfileModal(false);
  };

  const renderRow = (candidate) => (
    <tr key={candidate.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">{candidate.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
          <div className="table-user-info">
            <h4>{candidate.name}</h4>
            <p>{candidate.id}</p>
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
                <h2>Candidate Profile: {selectedCandidate.name}</h2>
                <button className="modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                  <div className="vendor-perf-avatar" style={{ width: "80px", height: "80px", fontSize: "24px" }}>
                    {selectedCandidate.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 8px" }}>{selectedCandidate.name}</h3>
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
                <button className="btn btn-danger" onClick={() => alert("Candidate rejected.")}>Reject</button>
                <button className="btn btn-outline" onClick={() => setShowProfileModal(false)}>Close</button>
                {selectedCandidate.status === "Pending Review" && (
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
