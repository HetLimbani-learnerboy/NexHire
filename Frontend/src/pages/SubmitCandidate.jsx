import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/forms.css";

function SubmitCandidate() {
  const { setMobileOpen } = useOutletContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobId: "",
  });
  const [resume, setResume] = useState(null);

  const activeJobs = [
    { id: "J001", title: "Senior React Developer" },
    { id: "J002", title: "Full Stack Developer" },
    { id: "J003", title: "UI/UX Designer" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload a resume.");
      return;
    }
    alert(`Candidate ${formData.firstName} ${formData.lastName} submitted successfully for Job ${formData.jobId}! (Mock)`);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", jobId: "" });
    setResume(null);
  };

  return (
    <>
      <Navbar title="Submit Candidate" subtitle="Add a new profile to your assigned requisitions" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Candidate Submission Portal</h2>
            <p>Upload resumes and submit profiles for your assigned jobs.</p>
          </div>
        </div>

        <div className="dashboard-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="dashboard-card-header">
            <h3>Candidate Details</h3>
          </div>
          <div className="dashboard-card-body">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" type="text" required placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" type="text" required placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" required placeholder="john.doe@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" required placeholder="+1 234 567 8900" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assign to Job Requisition</label>
                <select className="form-select" required value={formData.jobId} onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}>
                  <option value="">Select an active job</option>
                  {activeJobs.map(job => (
                    <option key={job.id} value={job.id}>{job.id} - {job.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Resume Upload (PDF, DOCX)</label>
                <div style={{ border: "2px dashed var(--gray-300)", padding: "40px 20px", textAlign: "center", borderRadius: "var(--radius-md)", background: "var(--gray-50)", cursor: "pointer" }} onClick={() => document.getElementById("resume-upload").click()}>
                  <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📄</div>
                  <p style={{ margin: "0 0 5px", fontWeight: 600, color: "var(--navy-600)" }}>Click to upload or drag and drop</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>{resume ? resume.name : "SVG, PNG, JPG or GIF (max. 800x400px)"}</p>
                  <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={(e) => setResume(e.target.files[0])} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "20px", borderTop: "1px solid var(--gray-100)" }}>
                <button type="button" className="btn btn-outline" onClick={() => { setFormData({ firstName: "", lastName: "", email: "", phone: "", jobId: "" }); setResume(null); }}>Clear Form</button>
                <button type="submit" className="btn btn-success">Submit Candidate</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubmitCandidate;
