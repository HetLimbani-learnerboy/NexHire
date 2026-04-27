import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Table from "@/components/Table";
import api from "@/utils/api";
import "@/styles/forms.css";

function FinalSelection() {
  const { setMobileOpen } = useOutletContext();
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerDetails, setOfferDetails] = useState({ salary: "", joiningDate: "", notes: "" });

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const res = await api.get('/manager/decisions');
        if (res.data.success) {
          setDecisions(res.data.decisions || []);
        }
      } catch (error) {
        console.error("Error fetching decisions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDecisions();
  }, []);

  const handleDecision = async (candidate, action) => {
    if (action === "Reject") {
      if (window.confirm(`Are you sure you want to reject ${candidate.candidate}?`)) {
        try {
          const res = await api.post(`/manager/decisions/${candidate.id}`, { status: "Rejected" });
          if (res.data.success) {
            setDecisions(decisions.map(d => d.id === candidate.id ? { ...d, status: "Rejected" } : d));
          }
        } catch (error) {
          console.error("Error rejecting candidate:", error);
        }
      }
    } else if (action === "Offer") {
      setSelectedCandidate(candidate);
      setShowOfferModal(true);
    }
  };

  const submitOffer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/manager/decisions/${selectedCandidate.id}`, { status: "Offered", offerDetails });
      if (res.data.success) {
        setDecisions(decisions.map(d => d.id === selectedCandidate.id ? { ...d, status: "Offered" } : d));
        setShowOfferModal(false);
        setOfferDetails({ salary: "", joiningDate: "", notes: "" });
        alert("Offer request sent to HR!");
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert("Failed to submit offer.");
    }
  };

  const getStatusBadge = (status) => {
    const m = { "Pending Decision": "badge-warning", "Offered": "badge-success", "Rejected": "badge-danger" };
    return <span className={`badge ${m[status] || "badge-neutral"}`}>{status}</span>;
  };

  const renderRow = (item) => (
    <tr key={item.id}>
      <td>
        <div className="table-user">
          <div className="table-user-avatar">{item.candidate.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
          <div className="table-user-info">
            <h4>{item.candidate}</h4>
            <p>{item.id}</p>
          </div>
        </div>
      </td>
      <td>{item.role}</td>
      <td><strong>{item.avgScore} / 5.0</strong></td>
      <td><span className="badge badge-info">{item.recommendation}</span></td>
      <td>{getStatusBadge(item.status)}</td>
      <td>
        {item.status === "Pending Decision" ? (
          <div className="table-actions">
            <button className="btn btn-sm btn-success" onClick={() => handleDecision(item, "Offer")}>Offer</button>
            <button className="btn btn-sm btn-danger" onClick={() => handleDecision(item, "Reject")}>Reject</button>
          </div>
        ) : (
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Decision Made</span>
        )}
      </td>
    </tr>
  );

  return (
    <>
      <Navbar title="Final Selections" subtitle="Make final hiring decisions and extend offers" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Pending Decisions ({decisions.filter(d => d.status === "Pending Decision").length})</h2>
            <p>Review interview feedback aggregates and make final hiring decisions.</p>
          </div>
        </div>

        <Table columns={["Candidate", "Role", "Avg Score", "Recommendation", "Status", "Action"]} data={decisions} renderRow={renderRow} currentPage={1} totalPages={1} onPageChange={() => {}} />

        {showOfferModal && selectedCandidate && (
          <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
            <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
              <div className="modal-header">
                <h2>Extend Offer to {selectedCandidate.candidate}</h2>
                <button className="modal-close" onClick={() => setShowOfferModal(false)}>✕</button>
              </div>
              <form onSubmit={submitOffer}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Offered Salary (LPA)</label>
                    <input className="form-input" type="text" required placeholder="e.g. 18.5" value={offerDetails.salary} onChange={(e) => setOfferDetails({ ...offerDetails, salary: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expected Joining Date</label>
                    <input className="form-input" type="date" required value={offerDetails.joiningDate} onChange={(e) => setOfferDetails({ ...offerDetails, joiningDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Offer Notes for HR</label>
                    <textarea className="form-textarea" placeholder="Any special conditions or sign-on bonus details..." value={offerDetails.notes} onChange={(e) => setOfferDetails({ ...offerDetails, notes: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowOfferModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Send Offer Request to HR</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FinalSelection;
