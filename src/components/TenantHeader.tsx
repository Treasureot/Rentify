import "../Styles/Tenant.css"
import { NavLink } from "react-router-dom";
import React from "react"; 
import { HiOutlineBell } from "react-icons/hi";
import { FiChevronDown } from "react-icons/fi";
import LogoImg from "../assets/images/rentify-logo.png"


type TenantHeaderProps = {
    firstName: string;
    lastName: string;
    profileIcon?: string;
}


const TenantHeader = ({
    firstName,
    lastName,
    profileIcon
}: TenantHeaderProps) => {
    return (
        <>
        <div className="tenant_header">
            <div className="tenant_header_left">
                <img src={LogoImg} alt="Rentify" />
                <ul>
                    <li>
                        <NavLink 
                            to="/Tenant" 
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                        Discover
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to="/property" 
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                        Listings
                        </NavLink>
                    </li> 

                    <li>
                        <NavLink 
                            to="/property" 
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                        Management
                        </NavLink>
                    </li>                                            
                </ul>
            </div>

            <div className="tenant_header_right">
                <div className="notification_icon">
                    <HiOutlineBell size={24} />
                </div>

                <div className="profile_icon">
                    <img
                        src={profileIcon || "/default-avatar.png"}
                        alt={`${firstName} ${lastName} profile`}
                    />
                    <span className="profile_name">{firstName} {lastName}</span>
                    <FiChevronDown size={20} />
                </div>                
            </div>
        </div>
        </>
    );
}

export default TenantHeader;