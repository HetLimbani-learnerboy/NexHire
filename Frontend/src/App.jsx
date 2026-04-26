import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import HRDashboard from "./pages/HRDashboard";
import Pipeline from "./pages/Pipeline";
import Interviews from "./pages/Interviews";
import VendorDashboard from "./pages/VendorDashboard";
import SubmitCandidate from "./pages/SubmitCandidate";
import MyCandidates from "./pages/MyCandidates";
import VendorProfile from "./pages/VendorProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/users" element={<Users />} />
            <Route path="/hr-dashboard" element={<HRDashboard />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/submit-candidate" element={<SubmitCandidate />} />
            <Route path="/my-candidates" element={<MyCandidates />} />
            <Route path="/vendor-profile" element={<VendorProfile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;