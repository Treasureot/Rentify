import React, { useState, useEffect } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { FiChevronDown } from "react-icons/fi";


type DashboardHeaderProps = {
    firstName: string;
    lastName: string;
    profileIcon?: string;
};

const DashboardHeader = ({
    firstName,
    lastName,
    profileIcon
}: DashboardHeaderProps) => {


    return (
        <div className="dashboard_header">
            <div className="dashboard_header_left">
                <h2>Welcome Back, {firstName} 👋</h2>
                <p>Here is what is happening with your portfolio today.</p>
            </div>

            <div className="dashboard_header_right">
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
    );
}

export default DashboardHeader;