import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import api from "@/utils/api";
import "@/styles/forms.css";

function VendorProfile() {
  const { setMobileOpen } = useOutletContext();

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);

  const [slaFile, setSlaFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/vendor/profile');
        if (res.data.success && res.data.profile) {
          setFormData(res.data.profile);
        }
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/vendor/profile', formData);
      if (res.data.success) {
        alert(res.data.message || "Vendor profile saved successfully!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    }
  };

  return (
    <>
      <Navbar title="Vendor Profile" subtitle="Manage your agency details and agreements" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Agency Settings</h2>
            <p>Update your company information and upload compliance documents.</p>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Profile Info Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Company Information</h3>
            </div>
            <div className="dashboard-card-body">
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input className="form-input" type="text" name="companyName" required value={formData.companyName} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input className="form-input" type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" name="email" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="text" name="phone" required value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input className="form-input" type="url" name="website" value={formData.website} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Address</label>
                  <textarea className="form-textarea" name="address" rows="3" value={formData.address} onChange={handleChange} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--gray-100)" }}>
                  <button type="button" className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-success">Save Changes</button>
                </div>
              </form>
            </div>
          </div>

          {/* Compliance & SLA Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Compliance & Agreements</h3>
              <span className="badge badge-success">Verified</span>
            </div>
            <div className="dashboard-card-body">
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Current SLA Status</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "var(--gray-50)", border: "1px solid var(--gray-200)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "24px" }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 600 }}>NexHire_Vendor_Agreement_2026.pdf</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>Signed on: Jan 15, 2026 • Valid until: Jan 15, 2027</p>
                  </div>
                  <button className="btn btn-sm btn-outline">Download</button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Upload New Agreement / SLA</label>
                <div style={{ border: "2px dashed var(--gray-300)", padding: "30px 20px", textAlign: "center", borderRadius: "var(--radius-md)", background: "var(--white)", cursor: "pointer" }} onClick={() => document.getElementById("sla-upload").click()}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>📁</div>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, color: "var(--navy-600)" }}>Click to upload revised document</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>{slaFile ? slaFile.name : "PDF or DOCX (max. 10MB)"}</p>
                  <input id="sla-upload" type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={(e) => setSlaFile(e.target.files[0])} />
                </div>
              </div>
              {slaFile && (
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn-primary" onClick={() => { alert("Document uploaded for review! (Mock)"); setSlaFile(null); }}>Submit for Review</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorProfile;
