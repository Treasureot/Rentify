import { Navigate, Route, Routes } from "react-router-dom";
import TenantLogin from "./pages/TenantLogin";
import SignUp from "./pages/SignUp";
import Index from "./pages/Index";
import Property from "./pages/Property";
import LandlordLogin from "./pages/LandlordLogin";
import Contact from "./pages/Contact"
import Landlord from "./pages/Landlord";


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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

