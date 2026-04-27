import React from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import "@/styles/reports.css";
import "@/styles/forms.css";

function Reports() {
  const { setMobileOpen } = useOutletContext();
  const [dateRange, setDateRange] = React.useState({ from: "2026-01-01", to: "2026-04-30" });
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:5001/api/admin/reports", {
      headers: {
        "role": "admin"
      }
    })
      .then(r => r.json())
      .then(res => {
        if(res.success) {
          setData(res);
        } else {
          // Fallback or handle error if needed
          console.error("Failed to load reports:", res.message);
          setData({ totalQuarter: 0, totalHired: 0, avgDays: 0, monthlyHires: [], statusDist: [], vendorMetrics: [] });
        }
      })
      .catch(err => {
        console.error("API error:", err);
        // Fallback so it stops loading even on complete network failure
        setData({ totalQuarter: 0, totalHired: 0, avgDays: 0, monthlyHires: [], statusDist: [], vendorMetrics: [] });
      });
  }, []);

  if (!data) return <div style={{padding:"2rem", textAlign:"center"}}>Loading reports...</div>;

  const { totalQuarter, totalHired, avgDays, monthlyHires, statusDist, vendorMetrics } = data;

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Vendor,Submitted,Hired,Ratio,AvgDays,Rating\n" + 
      vendorMetrics.map(v => `${v.name},${v.submitted},${v.hired},${v.ratio},${v.avgDays},${v.rating}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendor_performance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxHires = Math.max(1, ...monthlyHires.map(m => m.value));

  let gradientStops = "";
  let currentDeg = 0;
  statusDist.forEach(item => {
    const deg = (item.percent / 100) * 360;
    gradientStops += `${item.color} ${currentDeg}deg ${currentDeg + deg}deg, `;
    currentDeg += deg;
  });
  gradientStops = gradientStops.slice(0, -2) || "transparent 0deg 360deg";

  return (
    <>
      <Navbar title="Reports" subtitle="Analytics, metrics, and vendor performance insights" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="reports-grid">
          <div className="report-metric-card navy"><div className="report-metric-icon navy">📊</div><h2>{totalQuarter}</h2><p>Total Candidates This Quarter</p></div>
          <div className="report-metric-card emerald"><div className="report-metric-icon emerald">✅</div><h2>{totalHired}</h2><p>Successful Hires</p></div>
          <div className="report-metric-card amber"><div className="report-metric-icon amber">⏱</div><h2>{avgDays} days</h2><p>Avg. Time to Fill</p></div>
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
                  <div className="donut-center"><h3>{totalQuarter}</h3><p>Total</p></div>
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
          <div className="dashboard-card-header" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <h3>Vendor Performance Breakdown</h3>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: "auto" }}>
              <input type="date" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} style={{ padding: "0.4rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-300)" }} />
              <span>to</span>
              <input type="date" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} style={{ padding: "0.4rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gray-300)" }} />
              <button className="btn btn-sm btn-outline" onClick={handleExportCSV}>Export CSV</button>
            </div>
          </div>
          <div className="data-table-container" style={{ border: "none" }}>
            <table className="data-table">
              <thead><tr><th>Vendor</th><th>Submitted</th><th>Hired</th><th>Sub-to-Hire Ratio</th><th>Avg. Days to Fill</th><th>Rating</th></tr></thead>
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
