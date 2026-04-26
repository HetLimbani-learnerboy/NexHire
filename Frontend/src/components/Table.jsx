import React from "react";
import "@/styles/table.css";

function Table({ columns, data, renderRow, currentPage, totalPages, onPageChange }) {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>{columns.map((col, idx) => <th key={idx}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, idx) => renderRow(item, idx))
          ) : (
            <tr><td colSpan={columns.length} style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>No data available</td></tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="table-pagination">
          <span className="table-pagination-info">Page {currentPage} of {totalPages}</span>
          <div className="table-pagination-controls">
            <button className="table-pagination-btn" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} className={`table-pagination-btn ${page === currentPage ? "active" : ""}`} onClick={() => onPageChange(page)}>{page}</button>
            ))}
            <button className="table-pagination-btn" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
