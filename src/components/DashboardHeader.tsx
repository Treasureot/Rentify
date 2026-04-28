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

    const [displayFirstName, setDisplayFirstName] = useState(firstName);
    const [displayLastName, setDisplayLastName] = useState(lastName);

    useEffect(() => {
        const storedFirst = localStorage.getItem("firstName");
        const storedLast  = localStorage.getItem("lastName");

        if (storedFirst) setDisplayFirstName(storedFirst);
        if (storedLast)  setDisplayLastName(storedLast);
        
    }, []);
    return (
        <div className="dashboard_header">
            <div className="dashboard_header_left">
                <h2>Welcome Back, {displayFirstName} 👋</h2>
                <p>Here is what is happening with your portfolio today.</p>
            </div>

            <div className="dashboard_header_right">
                <div className="notification_icon">
                    <HiOutlineBell size={24} />
                </div>

                <div className="profile_icon">
                    <img
                        src={profileIcon || "/default-avatar.png"}
                        alt={`${displayFirstName} ${displayLastName} profile`}
                    />
                    <span className="profile_name">{displayFirstName} {displayLastName}</span>
                    <FiChevronDown size={20} />
                </div>
            </div>
        </div>
    );
}

export default DashboardHeader;