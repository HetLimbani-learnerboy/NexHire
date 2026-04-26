import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import "@/styles/forms.css";

const MOCK_JOBS = [
  { id: 1, title: "Senior React Developer", department: "Engineering", skills: ["React", "TypeScript", "Node.js"], budget: "₹18-22L", deadline: "2026-05-15", vendors: 3, candidates: 18, status: "Open", priority: "High" },
  { id: 2, title: "DevOps Engineer", department: "Engineering", skills: ["AWS", "Docker", "Kubernetes"], budget: "₹16-20L", deadline: "2026-05-20", vendors: 2, candidates: 12, status: "Pending Approval", priority: "High" },
  { id: 3, title: "Data Analyst", department: "Analytics", skills: ["Python", "SQL", "Power BI"], budget: "₹10-14L", deadline: "2026-06-01", vendors: 4, candidates: 24, status: "Open", priority: "Medium" },
  { id: 4, title: "UI/UX Designer", department: "Design", skills: ["Figma", "Sketch", "Adobe XD"], budget: "₹12-16L", deadline: "2026-05-25", vendors: 2, candidates: 9, status: "Open", priority: "Medium" },
  { id: 5, title: "Backend Engineer (Java)", department: "Engineering", skills: ["Java", "Spring Boot", "Microservices"], budget: "₹20-25L", deadline: "2026-05-10", vendors: 3, candidates: 15, status: "Closed", priority: "Low" },
  { id: 6, title: "Product Manager", department: "Product", skills: ["Agile", "Roadmapping", "Analytics"], budget: "₹22-28L", deadline: "2026-06-10", vendors: 1, candidates: 7, status: "On Hold", priority: "High" },
  { id: 7, title: "Full Stack Developer", department: "Engineering", skills: ["React", "Node.js", "MongoDB"], budget: "₹15-20L", deadline: "2026-05-30", vendors: 5, candidates: 32, status: "Open", priority: "High" },
  { id: 8, title: "QA Automation Engineer", department: "QA", skills: ["Selenium", "Jest", "Cypress"], budget: "₹10-14L", deadline: "2026-06-05", vendors: 2, candidates: 11, status: "Open", priority: "Medium" },
];

function Jobs() {
  const { setMobileOpen } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = MOCK_JOBS.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "All" || j.status === filterStatus;
    const matchPriority = filterPriority === "All" || j.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const getStatusBadge = (s) => {
    const m = { Open: "badge-success", Closed: "badge-danger", "On Hold": "badge-neutral", "Pending Approval": "badge-warning" };
    return <span className={`badge ${m[s] || "badge-neutral"}`}>{s}</span>;
  };

  const getPriorityBadge = (p) => {
    const m = { High: "badge-danger", Medium: "badge-warning", Low: "badge-neutral" };
    return <span className={`badge ${m[p]}`}>{p}</span>;
  };

  const columns = ["Job Title", "Skills", "Budget", "Deadline", "Vendors / Candidates", "Priority", "Status", "Actions"];

  const renderRow = (job) => (
    <tr key={job.id}>
      <td><div className="table-user-info"><h4>{job.title}</h4><p>{job.department}</p></div></td>
      <td><div className="skills-tags">{job.skills.slice(0,3).map((s) => <span className="skill-tag" key={s}>{s}</span>)}</div></td>
      <td style={{fontWeight:600}}>{job.budget}</td>
      <td>{new Date(job.deadline).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
      <td><span style={{fontWeight:700, color:"var(--navy-500)"}}>{job.vendors}</span> / <span style={{fontWeight:700}}>{job.candidates}</span></td>
      <td>{getPriorityBadge(job.priority)}</td>
      <td>{getStatusBadge(job.status)}</td>
      <td>
        <div className="table-actions">
          {job.status === "Pending Approval" && (
            <>
              <button className="table-action-btn" title="Approve" style={{ color: "var(--success)" }}>✅</button>
              <button className="table-action-btn" title="Reject" style={{ color: "var(--danger)" }}>❌</button>
            </>
          )}
          <button className="table-action-btn" title="View">👁</button>
          <button className="table-action-btn" title="Edit">✏️</button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Navbar title="Jobs" subtitle="Manage job requisitions and vendor assignments" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left"><h2>Job Requisitions ({filtered.length})</h2><p>Create, assign, and track open positions</p></div>
          <div className="page-header-actions"><button className="btn btn-primary" onClick={() => setShowModal(true)} id="add-job-btn">+ Create Job</button></div>
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

        <Table columns={columns} data={filtered} renderRow={renderRow} currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header"><h2>Create New Job</h2><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Job Title</label><input className="form-input" type="text" placeholder="e.g. Senior React Developer" id="job-title-input" /></div>
                <div className="form-group"><label className="form-label">Department</label><select className="form-select" id="job-department-select"><option value="">Select department</option><option value="Engineering">Engineering</option><option value="Design">Design</option><option value="Product">Product</option><option value="Analytics">Analytics</option><option value="QA">QA</option></select></div>
                <div className="form-group"><label className="form-label">Required Skills</label><input className="form-input" type="text" placeholder="React, Node.js, TypeScript" id="job-skills-input" /></div>
                <div className="form-group"><label className="form-label">Budget Range</label><input className="form-input" type="text" placeholder="e.g. ₹18-22L" id="job-budget-input" /></div>
                <div className="form-group"><label className="form-label">Deadline</label><input className="form-input" type="date" id="job-deadline-input" /></div>
                <div className="form-group"><label className="form-label">Priority</label><select className="form-select" id="job-priority-select"><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
                <div className="form-group">
                  <label className="form-label">Assign Vendors (Multi-select)</label>
                  <select className="form-select" multiple style={{ height: "80px", padding: "0.5rem" }}>
                    <option value="v1">TechStaff Solutions</option>
                    <option value="v2">InnoRecruit Pvt Ltd</option>
                    <option value="v3">CloudHire Global</option>
                    <option value="v4">SkillBridge HR</option>
                  </select>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-success" id="job-submit-btn">Create Job</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Jobs;
