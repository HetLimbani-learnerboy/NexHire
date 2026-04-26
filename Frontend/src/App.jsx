import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import LandingPage from "@/pages/common/LandingPage";
import Login from "@/pages/common/Login";
import DashboardLayout from "@/pages/common/DashboardLayout";
import Profile from "@/pages/common/Profile";
import Notifications from "@/pages/common/Notifications";

import Dashboard from "@/pages/admin/Dashboard";
import Vendors from "@/pages/admin/Vendors";
import Jobs from "@/pages/admin/Jobs";
import Candidates from "@/pages/admin/Candidates";
import Reports from "@/pages/admin/Reports";
import Users from "@/pages/admin/Users";

import HRDashboard from "@/pages/hr/HRDashboard";
import Pipeline from "@/pages/hr/Pipeline";
import Interviews from "@/pages/hr/Interviews";

import VendorDashboard from "@/pages/vendor/VendorDashboard";
import SubmitCandidate from "@/pages/vendor/SubmitCandidate";
import MyCandidates from "@/pages/vendor/MyCandidates";
import VendorProfile from "@/pages/vendor/VendorProfile";

import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import ReviewCandidates from "@/pages/manager/ReviewCandidates";
import Feedback from "@/pages/manager/Feedback";
import FinalSelection from "@/pages/manager/FinalSelection";

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
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/review-candidates" element={<ReviewCandidates />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/final-selection" element={<FinalSelection />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;