import '../Styles/Landlord.css'
import { NavLink } from "react-router-dom";
import LogoImg from '../assets/images/rentify-logoWhite.svg';
import { FiGrid, FiHome, FiBarChart2 } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaRegMoneyBillAlt } from "react-icons/fa";

const LandlordSidebar = () => {
    return (
        <>
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
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default LandlordSidebar;