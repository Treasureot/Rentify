import { Navigate, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Property from "./pages/Property";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Contact from "./pages/Contact";


import Tenant from "./pages/Tenants/Tenant";
import PropertyDetailsPage from "./pages/Tenants/PropertyDetailsPage";
import TenantLease from "./pages/Tenants/TenantLease";
import TenantNotifications from "./pages/Tenants/TenantNotifications";


import Landlord from "./pages/Landlord/Landlord";
import LandlordProperty from "./pages/Landlord/LandlordProperty";
import LandlordPayment from "./pages/Landlord/LandlordPayment";
import PaymentSchedule from "./pages/Landlord/PaymentSchedule";
import LeaseRequests from "./pages/Landlord/LeaseRequests";

import Admin from "./pages/Admin/Admin";
import UserManagement from "./pages/Admin/UserManagement";
import PropertyApproval from "./pages/Admin/PropertyApproval";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import LandlordNotifications from "./pages/Landlord/LandlordNotifications";
import PaystackCallback from "./pages/Landlord/PaystackCallback";

export default function App() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/" element={<Index />} />
      <Route path="/property" element={<Property />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/paystack/callback" element={<PaystackCallback />} />

      {/* ── Tenant ── */}
      <Route path="/tenant" element={<Tenant />} />
      <Route path="/tenant/property/:id" element={<PropertyDetailsPage />} />
      <Route path="/tenant-lease" element={<TenantLease />} />

      {/* ── Landlord ── */}
      <Route path="/landlord" element={<Landlord />} />
      <Route path="/landlord-property" element={<LandlordProperty />} />
      <Route path="/landlord-payment" element={<LandlordPayment />} />
      <Route path="/payment-schedule/:leaseId" element={<PaymentSchedule />} />
      <Route path="/lease-requests" element={<LeaseRequests />} />

      {/* ── Admin ── */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/property-approval" element={<PropertyApproval />} />

       {/* ── Notifications ── */}
      <Route path="/tenant-notifications" element={<TenantNotifications />} />
      <Route path="/landlord-notifications" element={<LandlordNotifications />} />
      <Route path="/admin-notifications" element={<AdminNotifications />} />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}