import '../Styles/Admin.css'
import { NavLink } from "react-router-dom";
import LogoImg from '../assets/images/rentify-logoWhite.svg';
import { FiGrid } from "react-icons/fi";
import { HiOutlineUsers, HiOutlineBell } from 'react-icons/hi';
import { BiBuildingHouse } from "react-icons/bi"



const AdminSidebar = () => {

    return (
        <div>
            <div className="admin_sidebar">
                <div className="logo_header">
                    <img src={LogoImg} alt="Rentify Logo" />
                    <p>ADMIN PORTAL</p>
                </div>

                <div className="admin_sidebar_link">
                    <ul>
                        <li>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                <div className="sidebar-item">
                                    <FiGrid size={20}/>
                                    <span>Dashboard</span>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/user-management"
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                <div className="sidebar-item">
                                    <HiOutlineUsers size={20} />
                                    <span>User Management</span>
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/property-approval"
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                <div className="sidebar-item">
                                    <BiBuildingHouse size={20} />
                                    <span>Property Approval</span>
                                </div>
                            </NavLink>
                        </li>  

                        <li>
                            <NavLink
                                to="/admin-notifications"
                                className={({ isActive }) => isActive ? "active" : ""}
                            >
                                <div className="sidebar-item">
                                    <HiOutlineBell size={20} />
                                    <span>Notifications</span>
                                </div>
                            </NavLink>
                        </li>                         
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;