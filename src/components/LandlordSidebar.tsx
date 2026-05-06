import '../Styles/Landlord.css'
import { NavLink, useLocation } from "react-router-dom";
import LogoImg from '../assets/images/rentify-logoWhite.svg';
import { FiGrid, FiHome } from "react-icons/fi";
import { HiOutlineDocumentText, HiOutlineClipboard } from "react-icons/hi";

const LandlordSidebar = () => {
    const location = useLocation();

    return (
        <div>
            <div className="landlord_sidebar">
                <div className="logo_header">
                    <img src={LogoImg} alt="Rentify Logo" />
                    <p>LANDLORD PORTAL</p>
                </div>

                <div className="landlord_sidebar_link">
                    <ul>
                        <li>
                            <NavLink
                                to="/landlord"
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                <div className="sidebar-item">
                                    <FiGrid />
                                    <span>Dashboard</span>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/landlord-property"
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                <div className="sidebar-item">
                                    <FiHome />
                                    <span>Properties</span>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/landlord-payment"
                                className={() =>
                                    location.pathname === "/landlord-payment" ||
                                    location.pathname.startsWith("/payment-schedule")
                                        ? "active"
                                        : ""
                                }
                            >
                                <div className="sidebar-item">
                                    <HiOutlineDocumentText />
                                    <span>Payment Schedules</span>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/lease-requests"
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                <div className="sidebar-item">
                                    <HiOutlineClipboard />
                                    <span>Lease Requests</span>
                                </div>
                            </NavLink>
                        </li>                        
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LandlordSidebar;