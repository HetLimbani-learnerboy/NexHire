
import React from "react";

function Loader({
  fullPage = false,
  size = 42,
  text = "Loading..."
}) {
  const spinnerStyle = {
    width: size,
    height: size,
    border:
      "4px solid #e2e8f0",
    borderTop:
      "4px solid #10b981",
    borderRadius: "50%",
    animation:
      "spin 0.8s linear infinite"
  };

  const wrapperStyle = fullPage
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "rgba(255,255,255,.72)",
        backdropFilter:
          "blur(6px)"
      }
    : {
        display: "flex",
        alignItems: "center",
        justifyContent:
          "center",
        padding: "45px"
      };

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          textAlign:
            "center"
        }}
      >
        <div
          style={
            spinnerStyle
          }
        />

        <p
          style={{
            marginTop: 14,
            fontSize: 14,
            fontWeight: 700,
            color:
              "#64748b"
          }}
        >
          {text}
        </p>
      </div>

      <style>
        {`
          @keyframes spin{
            from{
              transform:rotate(0deg);
            }
            to{
              transform:rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Loader;