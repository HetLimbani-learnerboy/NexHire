import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";

const initialNotifications = [
  { id: 1, type: "info", title: "New Job Requisition", message: "A new job 'Frontend Developer' has been created and is pending approval.", time: "2 mins ago", isRead: false },
  { id: 2, type: "success", title: "Candidate Shortlisted", message: "John Doe has been shortlisted for the Backend Role.", time: "1 hour ago", isRead: false },
  { id: 3, type: "warning", title: "Interview Reminder", message: "Upcoming interview with Jane Smith in 30 minutes.", time: "30 mins ago", isRead: false },
  { id: 4, type: "info", title: "Vendor Registered", message: "TechStaff Solutions has completed registration and is pending review.", time: "3 hours ago", isRead: true },
  { id: 5, type: "success", title: "Candidate Hired", message: "Arjun Mehta has been successfully hired for Backend Engineer (Java).", time: "1 day ago", isRead: true },
  { id: 6, type: "info", title: "System Update", message: "NexHire ATS will be undergoing maintenance at 12:00 AM.", time: "1 day ago", isRead: true },
];

function Notifications() {
  const { setMobileOpen } = useOutletContext();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getTypeColor = (type) => {
    const m = { info: "blue", success: "green", warning: "orange" };
    return m[type] || "blue";
  };

  return (
    <>
      <Navbar title="Notifications" subtitle="Stay updated with your latest alerts" onHamburgerClick={() => setMobileOpen(true)} />
      <div className="dashboard-page">
        <div className="page-header">
          <div className="page-header-left">
            <h2>Notifications {unreadCount > 0 && <span className="badge badge-danger" style={{ verticalAlign: "middle" }}>{unreadCount} new</span>}</h2>
            <p>View job updates, interview reminders, and stage change alerts</p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-outline btn-sm" onClick={markAllAsRead}>Mark all as read</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-body">
            <div className="activity-list">
              {notifications.map((notif) => (
                <div className="activity-item" key={notif.id} style={{ opacity: notif.isRead ? 0.6 : 1, cursor: "pointer" }} onClick={() => markAsRead(notif.id)}>
                  <div className={`activity-dot ${getTypeColor(notif.type)}`} />
                  <div className="activity-text" style={{ flex: 1 }}>
                    <p style={{ fontWeight: notif.isRead ? 400 : 600 }}>{notif.title}</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "4px 0 0" }}>{notif.message}</p>
                    <span>{notif.time}</span>
                  </div>
                  {!notif.isRead && (
                    <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}>
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notifications;
