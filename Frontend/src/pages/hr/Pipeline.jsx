import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "@/components/Navbar";
import "@/styles/pipeline.css";

const initialCandidates = [
  { id: 1, name: "Aditya Patel", role: "Senior React Developer", stage: "Submitted", date: "2026-04-20" },
  { id: 2, name: "Sneha Sharma", role: "Full Stack Developer", stage: "Screened", date: "2026-04-19" },
  { id: 3, name: "Ravi Verma", role: "DevOps Engineer", stage: "Submitted", date: "2026-04-22" },
  { id: 4, name: "Neha Gupta", role: "Data Analyst", stage: "Interview", date: "2026-04-15" },
  { id: 5, name: "Vikram Joshi", role: "Senior React Developer", stage: "Offered", date: "2026-04-18" },
  { id: 6, name: "Priyanka Das", role: "UI/UX Designer", stage: "Interview", date: "2026-04-21" },
  { id: 7, name: "Kavita Singh", role: "Full Stack Developer", stage: "Screened", date: "2026-04-23" },
];

const stages = ["Submitted", "Screened", "Interview", "Offered", "Hired", "Rejected"];

function Pipeline() {
  const { setMobileOpen } = useOutletContext();
  const [candidates, setCandidates] = useState(initialCandidates);
  const [draggedId, setDraggedId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedId) {
      setCandidates(candidates.map(c => c.id === draggedId ? { ...c, stage: targetStage } : c));
      setDraggedId(null);
    }
  };

  return (
    <>
      <Navbar title="Candidate Pipeline" subtitle="Drag and drop candidates to move them through stages" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page" style={{ display: "flex", flexDirection: "column" }}>
        <div className="pipeline-board">
          {stages.map(stage => {
            const stageCandidates = candidates.filter(c => c.stage === stage);

            return (
              <div
                key={stage}
                className="pipeline-column"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="pipeline-column-header">
                  <h3>{stage}</h3>
                  <span className="badge badge-neutral">{stageCandidates.length}</span>
                </div>

                <div className="pipeline-column-body">
                  {stageCandidates.map(c => (
                    <div
                      key={c.id}
                      className={`pipeline-card ${draggedId === c.id ? "dragging" : ""}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                    >
                      <div className="pipeline-card-header">
                        <h4>{c.name}</h4>
                        <span>{new Date(c.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                      </div>
                      <p>{c.role}</p>
                      <span className="pipeline-card-tag">View Profile</span>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && (
                    <div className="pipeline-drop-zone">
                      Drop candidate here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Pipeline;
