import { Navigate, Route, Routes } from "react-router-dom";
import TenantLogin from "./pages/Tenants/TenantLogin";
import SignUp from "./pages/SignUp";
import Index from "./pages/Index";
import Property from "./pages/Property";
import LandlordLogin from "./pages/Landlord/LandlordLogin";
import Contact from "./pages/Contact"
import Landlord from "./pages/Landlord/Landlord";
import LandlordProperty from "./pages/Landlord/LandlordProperty"
import Tenant from "./pages/Tenants/Tenant"
import LandlordPayment from "./pages/Landlord/LandlordPayment";
import PaymentSchedule from "./pages/Landlord/PaymentSchedule";
import LeaseRequests from "./pages/Landlord/LeaseRequests";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index/>} />
      <Route path="/property" element={<Property />} />
      <Route path="/tenant-login" element={<TenantLogin />} />
      <Route path="/landlord-login" element={<LandlordLogin />} />     
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/landlord" element={<Landlord />} />
      <Route path="/landlord-property" element={<LandlordProperty />} />
      <Route path="/tenant" element={<Tenant />} />
      <Route path="/landlord-payment" element={<LandlordPayment />} />
      <Route path="/payment-schedule/:leaseId" element={<PaymentSchedule/>} />
      <Route path="/lease-requests" element={<LeaseRequests/>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}