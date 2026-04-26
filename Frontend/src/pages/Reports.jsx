import React from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/reports.css";
import "../styles/forms.css";

function Reports() {
  const { setMobileOpen } = useOutletContext();

  const monthlyHires = [
    { month: "Jan", value: 12 }, { month: "Feb", value: 18 }, { month: "Mar", value: 15 },
    { month: "Apr", value: 28 }, { month: "May", value: 22 }, { month: "Jun", value: 31 },
  ];
  const maxHires = Math.max(...monthlyHires.map(m => m.value));

  const statusDist = [
    { label: "Hired", value: 28, percent: 22, color: "#10b981" },
    { label: "In Pipeline", value: 58, percent: 45, color: "#3b82f6" },
    { label: "Rejected", value: 24, percent: 19, color: "#ef4444" },
    { label: "On Hold", value: 18, percent: 14, color: "#f59e0b" },
  ];

  const vendorMetrics = [
    { name: "TechStaff Solutions", submitted: 48, hired: 12, ratio: "25%", avgDays: 14, rating: 4.8 },
    { name: "InnoRecruit Pvt Ltd", submitted: 35, hired: 8, ratio: "23%", avgDays: 18, rating: 4.5 },
    { name: "CloudHire Global", submitted: 29, hired: 6, ratio: "21%", avgDays: 22, rating: 4.2 },
    { name: "TalentForce India", submitted: 41, hired: 9, ratio: "22%", avgDays: 16, rating: 4.6 },
    { name: "HireWave Tech", submitted: 22, hired: 4, ratio: "18%", avgDays: 25, rating: 3.9 },
  ];

  let gradientStops = "";
  let currentDeg = 0;
  statusDist.forEach(item => {
    const deg = (item.percent / 100) * 360;
    gradientStops += `${item.color} ${currentDeg}deg ${currentDeg + deg}deg, `;
    currentDeg += deg;
  });
  gradientStops = gradientStops.slice(0, -2);

  return (
    <>
      <Navbar title="Reports" subtitle="Analytics, metrics, and vendor performance insights" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="reports-grid">
          <div className="report-metric-card navy"><div className="report-metric-icon navy">📊</div><h2>128</h2><p>Total Candidates This Quarter</p></div>
          <div className="report-metric-card emerald"><div className="report-metric-icon emerald">✅</div><h2>28</h2><p>Successful Hires</p></div>
          <div className="report-metric-card amber"><div className="report-metric-icon amber">⏱</div><h2>18 days</h2><p>Avg. Time to Fill</p></div>
        </div>

        <div className="reports-two-col">
          <div className="chart-card">
            <div className="chart-card-header"><h3>Monthly Hires</h3><span className="badge badge-info">2026</span></div>
            <div className="chart-body">
              <div className="bar-chart">
                {monthlyHires.map((m, idx) => (
                  <div className="bar-chart-item" key={m.month}>
                    <span className="bar-chart-value">{m.value}</span>
                    <div className={`bar-chart-bar ${idx % 2 === 0 ? "" : "alt"}`} style={{ height: `${(m.value / maxHires) * 100}%` }} />
                    <span className="bar-chart-label">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header"><h3>Hiring Status Distribution</h3><span className="badge badge-neutral">This Quarter</span></div>
            <div className="chart-body">
              <div className="donut-chart-container">
                <div className="donut-chart" style={{ background: `conic-gradient(${gradientStops})` }}>
                  <div className="donut-center"><h3>128</h3><p>Total</p></div>
                </div>
                <div className="donut-legend">
                  {statusDist.map(item => (
                    <div className="legend-item" key={item.label}>
                      <div className="legend-dot" style={{ background: item.color }} />
                      <span className="legend-label">{item.label}</span>
                      <span className="legend-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header"><h3>Vendor Performance Breakdown</h3><button className="btn btn-sm btn-outline">Export CSV</button></div>
          <div className="data-table-container" style={{ border: "none" }}>
            <table className="data-table">
              <thead><tr><th>Vendor</th><th>Submitted</th><th>Hired</th><th>Conversion</th><th>Avg. Days to Fill</th><th>Rating</th></tr></thead>
              <tbody>
                {vendorMetrics.map((v, idx) => (
                  <tr key={idx}>
                    <td><div className="table-user"><div className="table-user-avatar">{v.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div><div className="table-user-info"><h4>{v.name}</h4></div></div></td>
                    <td style={{fontWeight:700}}>{v.submitted}</td>
                    <td><span className="badge badge-success">{v.hired}</span></td>
                    <td style={{fontWeight:600, color:"var(--emerald-600)"}}>{v.ratio}</td>
                    <td>{v.avgDays} days</td>
                    <td><div className="star-rating">{[1,2,3,4,5].map(s => <span key={s} className={s <= Math.round(v.rating) ? "" : "star-empty"}>★</span>)}<span style={{marginLeft:6,color:"var(--text-secondary)",fontSize:13}}>{v.rating}</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;
