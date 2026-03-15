// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PortalPublic from "./pages/PortalPublic";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ValidatorKhususDashboard from "./pages/ValidatorKhususDashboard";
import KATUDashboard from "./pages/KATUDashboard";
import ApproverDashboard from "./pages/ApproverDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ValidatorUmumDashboard from "./pages/ValidatorUmumDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalPublic />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/validator-khusus" element={<ValidatorKhususDashboard />} />
        <Route path="/dashboard/katu" element={<KATUDashboard />} />
        <Route path="/dashboard/approver" element={<ApproverDashboard />} />
        <Route path="/dashboard/staff" element={<StaffDashboard />} />
        <Route path="/dashboard/validator-umum" element={<ValidatorUmumDashboard />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}