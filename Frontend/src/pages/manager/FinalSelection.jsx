// Source: :contentReference[oaicite:0]{index=0}

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

  React.useEffect(() => {
    fetchSelections();
  }, []);

  const fetchSelections = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/selections");
      const data = await res.json();
      if (data.success) {
        setDecisions(data.selections);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecision = async (candidate, action) => {
    if (action === "Reject") {
      if (window.confirm(`Are you sure you want to reject ${candidate.candidate_name}?`)) {
        try {
          const res = await fetch(`http://localhost:5001/api/selections/${candidate.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Rejected" })
          });
          const data = await res.json();
          if (data.success) fetchSelections();
        } catch (err) {
          console.error(err);
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
      const res = await fetch(`http://localhost:5001/api/selections/${selectedCandidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Offered",
          offer_salary: offerDetails.salary,
          joining_date: offerDetails.joiningDate,
          offer_notes: offerDetails.notes
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchSelections();
        setShowOfferModal(false);
        setOfferDetails({ salary: "", joiningDate: "", notes: "" });
      }
    } catch (err) {
      console.error(err);
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
          <div className="table-user-avatar">
            {item.candidate_name?.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <div className="table-user-info">
            <h4>{item.candidate_name}</h4>
            <p>{item.id}</p>
          </div>
        </div>
      </td>
      <td>{item.role}</td>
      <td><strong>{item.avg_score} / 5.0</strong></td>
      <td><span className="badge badge-info">{item.recommendation}</span></td>
      <td>{getStatusBadge(item.status)}</td>
      <td>
        {item.status === "Pending Decision" ? (
          <div className="table-actions">
            <button className="btn btn-sm btn-success" onClick={() => handleDecision(item, "Offer")}>
              Offer
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => handleDecision(item, "Reject")}>
              Reject
            </button>
          </div>
        ) : (
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Decision Made
          </span>
        )}
      </td>
    </tr>
  );

  return (
    <>
      <Navbar
        title="Final Selections"
        subtitle="Make final hiring decisions and extend offers"
        onHamburgerClick={() => setMobileOpen(true)}
      />

      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>
              Pending Decisions ({decisions.filter(d => d.status === "Pending Decision").length})
            </h2>
            <p>
              Review interview feedback aggregates and make final hiring decisions.
            </p>
          </div>
        </div>

        {/* 🔥 BIG BOLD PHASE 2 BANNER */}
        <div
          style={{
            marginBottom: "20px",
            padding: "18px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeeba",
            borderRadius: "10px",
            textAlign: "center"
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#856404"
            }}
          >
            🚧 We will implement this in Phase 2
          </span>
        </div>

        <Table
          columns={["Candidate", "Role", "Avg Score", "Recommendation", "Status", "Action"]}
          data={decisions}
          renderRow={renderRow}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />

        {showOfferModal && selectedCandidate && (
          <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
            <div
              className="modal-content slide-up"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "500px" }}
            >
              <div className="modal-header">
                <h2>Extend Offer to {selectedCandidate.candidate_name}</h2>
                <button className="modal-close" onClick={() => setShowOfferModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={submitOffer}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Offered Salary (LPA)</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="e.g. 18.5"
                      value={offerDetails.salary}
                      onChange={(e) =>
                        setOfferDetails({ ...offerDetails, salary: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expected Joining Date</label>
                    <input
                      className="form-input"
                      type="date"
                      required
                      value={offerDetails.joiningDate}
                      onChange={(e) =>
                        setOfferDetails({ ...offerDetails, joiningDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Offer Notes for HR</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Any special conditions or sign-on bonus details..."
                      value={offerDetails.notes}
                      onChange={(e) =>
                        setOfferDetails({ ...offerDetails, notes: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowOfferModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Send Offer Request to HR
                  </button>
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