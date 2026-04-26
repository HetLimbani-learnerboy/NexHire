import React from "react";

function Loader({ fullPage = false, size = 40 }) {
  const spinnerStyle = {
    width: size, height: size,
    border: "3px solid var(--gray-200)",
    borderTopColor: "var(--emerald-500)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  };

  if (fullPage) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(241,245,249,0.8)", backdropFilter: "blur(4px)", zIndex: 9999 }}>
        <div style={{ textAlign: "center" }}>
          <div style={spinnerStyle} />
          <p style={{ marginTop: 16, fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={spinnerStyle} />
    </div>
  );
}

export default Loader;
