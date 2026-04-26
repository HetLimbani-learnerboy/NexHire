import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import "@/styles/forms.css";

const initialCandidates = [
  { id: 1, name: "Aditya Patel", email: "aditya@gmail.com", job: "Senior React Developer", vendor: "TechStaff Solutions", status: "Interview", resume: true, date: "2026-04-20", duplicate: false },
  { id: 2, name: "Sneha Sharma", email: "sneha.s@gmail.com", job: "Full Stack Developer", vendor: "InnoRecruit Pvt Ltd", status: "Screened", resume: true, date: "2026-04-19", duplicate: false },
  { id: 3, name: "Ravi Verma", email: "ravi.v@yahoo.com", job: "DevOps Engineer", vendor: "CloudHire Global", status: "Submitted", resume: true, date: "2026-04-22", duplicate: true },
  { id: 4, name: "Neha Gupta", email: "neha.g@outlook.com", job: "Data Analyst", vendor: "SkillBridge HR", status: "Rejected", resume: true, date: "2026-04-15", duplicate: false },
  { id: 5, name: "Vikram Joshi", email: "vikram.j@gmail.com", job: "Senior React Developer", vendor: "HireWave Tech", status: "Offered", resume: true, date: "2026-04-18", duplicate: false },
  { id: 6, name: "Priyanka Das", email: "priyanka.d@gmail.com", job: "UI/UX Designer", vendor: "RecruitEdge", status: "Interview", resume: true, date: "2026-04-21", duplicate: false },
  { id: 7, name: "Arjun Mehta", email: "arjun.m@gmail.com", job: "Backend Engineer (Java)", vendor: "TalentForce India", status: "Hired", resume: true, date: "2026-04-10", duplicate: false },
  { id: 8, name: "Kavita Singh", email: "kavita.s@gmail.com", job: "Full Stack Developer", vendor: "ProHire Solutions", status: "Screened", resume: true, date: "2026-04-23", duplicate: false },
  { id: 9, name: "Rohit Kumar", email: "rohit.k@gmail.com", job: "QA Automation Engineer", vendor: "TechStaff Solutions", status: "Submitted", resume: true, date: "2026-04-24", duplicate: true },
  { id: 10, name: "Ananya Reddy", email: "ananya.r@gmail.com", job: "Product Manager", vendor: "InnoRecruit Pvt Ltd", status: "Interview", resume: true, date: "2026-04-17", duplicate: false },
];

function Candidates() {
  const { setMobileOpen } = useOutletContext();
  const [candidates, setCandidates] = useState(initialCandidates);
  const [showModal, setShowModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const stages = ["Submitted", "Screened", "Interview", "Offered", "Hired"];

  const handleMoveStage = (id) => {
    setCandidates(candidates.map(c => {
      if (c.id === id && c.status !== "Rejected" && c.status !== "Hired") {
        const nextIndex = stages.indexOf(c.status) + 1;
        if (nextIndex < stages.length) {
          return { ...c, status: stages[nextIndex] };
        }
      }
      return c;
    }));
  };

  const handleReject = (id) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, status: "Rejected" } : c));
  };

  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.job.toLowerCase().includes(searchQuery.toLowerCase()) || c.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (s) => {
    const m = { Submitted: "badge-neutral", Screened: "badge-info", Interview: "badge-warning", Offered: "badge-success", Hired: "badge-success", Rejected: "badge-danger" };
    return <span className={`badge ${m[s] || "badge-neutral"}`}>{s}</span>;
  };

  const statusCounts = candidates.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {});

  const columns = ["Candidate", "Applied For", "Vendor", "Submitted", "Resume", "Status", "Actions"];

  const renderRow = (c) => (
    <tr key={c.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">{c.name.split(" ").map(w=>w[0]).join("")}</div>
          <div className="table-user-info">
            <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {c.name}
              {c.duplicate && <span className="badge badge-danger" style={{ fontSize: "0.7rem", padding: "0.1rem 0.3rem" }}>Duplicate</span>}
            </h4>
            <p>{c.email}</p>
          </div>
        </div>
      </td>
      <td style={{fontWeight:500}}>{c.job}</td>
      <td style={{fontSize:13, color:"var(--text-secondary)"}}>{c.vendor}</td>
      <td>{new Date(c.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
      <td>
        {c.resume ? (
          <span 
            className="badge badge-info" 
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => { setSelectedCandidate(c); setShowResumeModal(true); }}
          >
            📄 Parse
          </span>
        ) : (
          <span className="badge badge-neutral">No file</span>
        )}
      </td>
      <td>{getStatusBadge(c.status)}</td>
      <td>
        <div className="table-actions">
          <button className="table-action-btn" title="View" onClick={() => { setSelectedCandidate(c); setShowResumeModal(true); }}>👁</button>
          <button className="table-action-btn" title="Move Stage" onClick={() => handleMoveStage(c.id)}>↗️</button>
          <button className="table-action-btn danger" title="Reject" onClick={() => handleReject(c.id)}>✕</button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Navbar title="Candidates" subtitle="Track candidate submissions and hiring pipeline" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="stats-row" style={{ marginBottom: 24 }}>
          {["Submitted", "Screened", "Interview", "Offered", "Hired", "Rejected"].map((s) => (
            <div key={s} className="stat-card" style={{ cursor: "pointer" }} onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}>
              <div className="stat-info"><h3>{s}</h3><p className="stat-number">{statusCounts[s] || 0}</p></div>
            </div>
          ))}
        </div>

        <div className="page-header">
          <div className="page-header-left"><h2>All Candidates ({filtered.length})</h2><p>View submissions, move pipeline stages, manage profiles</p></div>
          <div className="page-header-actions"><button className="btn btn-primary" onClick={() => setShowModal(true)} id="add-candidate-btn">+ Submit Candidate</button></div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search candidates, jobs, vendors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="candidate-search" />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} id="candidate-status-filter">
            <option value="All">All Status</option><option value="Submitted">Submitted</option><option value="Screened">Screened</option><option value="Interview">Interview</option><option value="Offered">Offered</option><option value="Hired">Hired</option><option value="Rejected">Rejected</option>
          </select>
        </div>

        <Table columns={columns} data={filtered} renderRow={renderRow} currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header"><h2>Submit New Candidate</h2><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" type="text" placeholder="Enter candidate name" id="candidate-name-input" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="Enter email address" id="candidate-email-input" /></div>
                <div className="form-group"><label className="form-label">Job Position</label><select className="form-select" id="candidate-job-select"><option value="">Select job</option><option>Senior React Developer</option><option>DevOps Engineer</option><option>Data Analyst</option><option>Full Stack Developer</option><option>UI/UX Designer</option></select></div>
                <div className="form-group"><label className="form-label">Resume Upload</label><input className="form-input" type="file" accept=".pdf,.doc,.docx" id="candidate-resume-upload" /></div>
                <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="Add any notes" id="candidate-notes-input" /></div>
              </div>
              <div className="modal-footer"><button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-success" id="candidate-submit-btn">Submit Candidate</button></div>
            </div>
          </div>
        )}

        {showResumeModal && selectedCandidate && (
          <div className="modal-overlay" onClick={() => setShowResumeModal(false)}>
            <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
              <div className="modal-header"><h2>Resume Parsing Data: {selectedCandidate.name}</h2><button className="modal-close" onClick={() => setShowResumeModal(false)}>✕</button></div>
              <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <div style={{ background: "var(--gray-50)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", border: "1px solid var(--gray-200)" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--navy-600)" }}>Extracted Skills</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {["React", "Node.js", "MongoDB", "Express", "TypeScript"].map(skill => (
                      <span key={skill} style={{ padding: "0.25rem 0.75rem", background: "var(--emerald-100)", color: "var(--emerald-600)", borderRadius: "var(--radius-full)", fontSize: "0.85rem", fontWeight: "500" }}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div style={{ background: "var(--gray-50)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", border: "1px solid var(--gray-200)" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--navy-600)" }}>Experience</h4>
                  <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <li style={{ marginBottom: "0.5rem" }}><strong>Senior Developer</strong> at TechCorp (2022 - Present)</li>
                    <li><strong>Frontend Engineer</strong> at StartUp Inc (2019 - 2022)</li>
                  </ul>
                </div>
                <div style={{ background: "var(--gray-50)", padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-200)" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--navy-600)" }}>Education</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>B.Tech in Computer Science - XYZ University (2019)</p>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-outline" onClick={() => setShowResumeModal(false)}>Close</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Candidates;
