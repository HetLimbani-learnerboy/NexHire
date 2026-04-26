import React, { useState } from "react";
import Navbar from "../components/Navbar";

const initialNotifications = [
  { id: 1, type: "info", title: "New Job Requisition", message: "A new job 'Frontend Developer' has been created.", time: "2 mins ago", isRead: false },
  { id: 2, type: "success", title: "Candidate Shortlisted", message: "John Doe has been shortlisted for the Backend Role.", time: "1 hour ago", isRead: false },
  { id: 3, type: "warning", title: "Interview Reminder", message: "Upcoming interview with Jane Smith in 30 minutes.", time: "30 mins ago", isRead: true },
  { id: 4, type: "info", title: "System Update", message: "NexHire ATS will be undergoing maintenance at 12:00 AM.", time: "1 day ago", isRead: true }
];

function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="page-container fade-in">
      <Navbar title="Notifications" subtitle="Stay updated with your latest alerts" />
      
      <div className="page-content slide-up">
        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ margin: 0, color: "var(--navy-900)" }}>All Notifications</h3>
            <button 
              onClick={markAllAsRead}
              style={{ background: "transparent", color: "var(--emerald-500)", fontWeight: "600" }}
            >
              Mark all as read
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {notifications.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>No notifications right now.</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${notif.isRead ? "var(--gray-200)" : "var(--emerald-200)"}`,
                  backgroundColor: notif.isRead ? "var(--white)" : "var(--emerald-50)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  transition: "var(--transition-base)"
                }}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{
                      width: "10px", 
                      height: "10px", 
                      borderRadius: "50%", 
                      backgroundColor: notif.isRead ? "transparent" : "var(--emerald-500)",
                      marginTop: "0.5rem"
                    }} />
                    <div>
                      <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--navy-900)", fontSize: "1rem" }}>{notif.title}</h4>
                      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>{notif.message}</p>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginTop: "0.5rem" }}>{notif.time}</span>
                    </div>
                  </div>
                  {!notif.isRead && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      style={{ fontSize: "0.85rem", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-sm)", background: "var(--white)", border: "1px solid var(--gray-200)" }}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
