import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import "@/styles/forms.css";

function MyCandidates() {
  const { setMobileOpen } = useOutletContext();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCandidates = async () => {
    try {
      let url = `http://localhost:5001/api/candidates?page=${currentPage}&limit=10&vendor_id=${user?.id}`;
      if (filterStage !== "All") url += `&status=${filterStage}`;
      if (searchQuery) url += `&search=${searchQuery}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchCandidates();
  }, [user?.id, currentPage, filterStage, searchQuery]);

  const filtered = candidates.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.role?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStage = filterStage === "All" || c.stage === filterStage;
    return matchSearch && matchStage;
  });

  const getStageBadge = (stage) => {
    const m = { Submitted: "badge-neutral", Screened: "badge-info", Interview: "badge-warning", Offered: "badge-success", Rejected: "badge-danger", Hired: "badge-success" };
    return <span className={`badge ${m[stage] || "badge-neutral"}`}>{stage}</span>;
  };

  const columns = ["Candidate", "Role", "Date Submitted", "Stage", "Status", "Actions"];

  const renderRow = (candidate) => (
    <tr key={candidate.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">{candidate.full_name?.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
          <div className="table-user-info">
            <h4>{candidate.full_name}</h4>
            <p>ID: {candidate.id}</p>
          </div>
        </div>
      </td>
      <td>{candidate.job_title}</td>
      <td>{candidate.created_at ? new Date(candidate.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</td>
      <td>{getStageBadge(candidate.status)}</td>
      <td>
        {candidate.is_duplicate ? (
          <span className="badge badge-danger">Duplicate</span>
        ) : (
          <span className="badge badge-success">Active</span>
        )}
      </td>
      <td>
        <div className="table-actions">
          <button className="table-action-btn" title="View Profile">👁</button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <Navbar title="My Candidates" subtitle="Track the progress of profiles you've submitted" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Submitted Candidates</h2>
            <p>Monitor pipeline stages and statuses for your submissions.</p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search by name or role..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <select className="filter-select" value={filterStage} onChange={(e) => setFilterStage(e.target.value)}>
            <option value="All">All Stages</option>
            <option value="Submitted">Submitted</option>
            <option value="Screened">Screened</option>
            <option value="Interview">Interview</option>
            <option value="Offered">Offered</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <Table columns={columns} data={candidates} renderRow={renderRow} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </>
  );
}

export default MyCandidates;
