import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../Styles/index.css"

type DashboardHeaderProps = {
    firstName: string;
    lastName: string;
    profileIcon?: string;
};

const DashboardHeader = ({
    firstName,
    lastName,
    profileIcon,
}: DashboardHeaderProps) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fullName =
    `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Landlord";
    

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("firstName");
        localStorage.removeItem("lastName");

        window.location.href = "/login";
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="dashboard_header">
            <div className="dashboard_header_left">
                <h2>Welcome Back{firstName ? `, ${firstName}` : ""} 👋</h2>
                <p>Here is what is happening with your portfolio today.</p>
            </div>

            <div className="dashboard_header_right">
                <div
                    className="profile_dropdown"
                    ref={dropdownRef}
                >
                    <div
                        className="profile_icon"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <img
                            src={profileIcon || "/default-avatar.png"}
                            alt={fullName}
                        />
                        <span className="profile_name">{fullName}</span>
                        <FiChevronDown size={18} />
                    </div>

                    {open && (
                        <div className="dropdown_menu">
                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;