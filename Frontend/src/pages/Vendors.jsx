import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import "../styles/forms.css";

const MOCK_VENDORS = [
  { id: 1, company: "TechStaff Solutions", contact: "Rajesh Kumar", email: "rajesh@techstaff.in", rating: 5, candidates: 48, status: "Active", turnaroundTime: "2 days", closureScore: "95%", qualityScore: "90%" },
  { id: 2, company: "InnoRecruit Pvt Ltd", contact: "Priya Nair", email: "priya@innorecruit.com", rating: 4, candidates: 35, status: "Active", turnaroundTime: "4 days", closureScore: "80%", qualityScore: "85%" },
  { id: 3, company: "CloudHire Global", contact: "Amit Shah", email: "amit@cloudhire.io", rating: 4, candidates: 29, status: "Active", turnaroundTime: "3 days", closureScore: "85%", qualityScore: "88%" },
  { id: 4, company: "SkillBridge HR", contact: "Neha Gupta", email: "neha@skillbridge.co", rating: 3, candidates: 18, status: "Pending", turnaroundTime: "5 days", closureScore: "70%", qualityScore: "75%" },
  { id: 5, company: "HireWave Tech", contact: "Suresh Mehta", email: "suresh@hirewave.in", rating: 4, candidates: 22, status: "Active", turnaroundTime: "3 days", closureScore: "88%", qualityScore: "82%" },
  { id: 6, company: "RecruitEdge", contact: "Kavita Patel", email: "kavita@recruitedge.com", rating: 3, candidates: 15, status: "Inactive", turnaroundTime: "6 days", closureScore: "60%", qualityScore: "65%" },
  { id: 7, company: "TalentForce India", contact: "Vikram Singh", email: "vikram@talentforce.in", rating: 5, candidates: 41, status: "Active", turnaroundTime: "2 days", closureScore: "92%", qualityScore: "95%" },
  { id: 8, company: "ProHire Solutions", contact: "Deepa Joshi", email: "deepa@prohire.com", rating: 4, candidates: 26, status: "Active", turnaroundTime: "4 days", closureScore: "82%", qualityScore: "80%" },
];

function Vendors() {
  const { setMobileOpen } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = MOCK_VENDORS.filter((v) => {
    const matchSearch = v.company.toLowerCase().includes(searchQuery.toLowerCase()) || v.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "All" || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const renderStars = (rating) => (
    <div className="star-rating">
      {[1,2,3,4,5].map((s) => <span key={s} className={s <= rating ? "" : "star-empty"}>★</span>)}
    </div>
  );

  const getStatusBadge = (status) => {
    const cls = { Active: "badge-success", Pending: "badge-warning", Inactive: "badge-danger" };
    return <span className={`badge ${cls[status]}`}>{status}</span>;
  };

  const columns = ["Vendor", "Contact Person", "Performance (TAT / Close / Qual)", "Rating", "Candidates", "Status", "Actions"];

  const renderRow = (vendor) => (
    <tr key={vendor.id}>
      <td><div className="table-user"><div className="table-user-avatar">{vendor.company.split(" ").map(w=>w[0]).join("").slice(0,2)}</div><div className="table-user-info"><h4>{vendor.company}</h4><p>{vendor.email}</p></div></div></td>
      <td>{vendor.contact}</td>
      <td>
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          TAT: <strong>{vendor.turnaroundTime}</strong> <br/>
          Close: <strong>{vendor.closureScore}</strong> | Qual: <strong>{vendor.qualityScore}</strong>
        </div>
      </td>
      <td>{renderStars(vendor.rating)}</td>
      <td><span style={{fontWeight:700}}>{vendor.candidates}</span> submitted</td>
      <td>{getStatusBadge(vendor.status)}</td>
      <td><div className="table-actions"><button className="table-action-btn" title="View">👁</button><button className="table-action-btn" title="Edit">✏️</button><button className="table-action-btn danger" title="Delete">🗑</button></div></td>
    </tr>
  );

  return (
    <>
      <Navbar title="Vendors" subtitle="Manage your recruitment vendor partners" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left"><h2>All Vendors ({filtered.length})</h2><p>Track vendor registrations, ratings and performance</p></div>
          <div className="page-header-actions"><button className="btn btn-primary" onClick={() => setShowModal(true)} id="add-vendor-btn">+ Add Vendor</button></div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Search vendors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="vendor-search" />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} id="vendor-status-filter">
            <option value="All">All Status</option><option value="Active">Active</option><option value="Pending">Pending</option><option value="Inactive">Inactive</option>
          </select>
        </div>

        <Table columns={columns} data={filtered} renderRow={renderRow} currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} />

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header"><h2>Register New Vendor</h2><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" type="text" placeholder="Enter company name" id="vendor-company-name" /></div>
                <div className="form-group"><label className="form-label">Contact Person</label><input className="form-input" type="text" placeholder="Enter contact name" id="vendor-contact-person" /></div>
                <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="Enter email address" id="vendor-email" /></div>
                <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" type="tel" placeholder="Enter phone number" id="vendor-phone" /></div>
                <div className="form-group">
                  <label className="form-label">Agreement File</label>
                  <input className="form-input" type="file" accept=".pdf,.doc,.docx" style={{ padding: "0.5rem" }} />
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Upload SLA or vendor agreement document.</p>
                </div>
              </div>
              <div className="modal-footer"><button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-success" id="vendor-submit-btn">Register Vendor</button></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Vendors;
