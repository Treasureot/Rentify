import "../Styles/cards.css"
import { FiX } from "react-icons/fi";
import { useEffect, useRef } from "react"

type UserDetailsProps = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    role: string;
    onSuspend: () => void;
    onActivate: () => void;
    onClose: () => void;
};

const UserDetails = ({
    firstName,
    lastName,
    email,
    phoneNumber,
    isActive,
    role,
    onSuspend,
    onActivate,
    onClose
}: UserDetailsProps) => {

    const actionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="user_card" style={{ width: "100%" }}>
            <button
                className="property_details_close"
                onClick={onClose}
                aria-label="Close details"
            >
                <FiX size={20} />
            </button>

            <div className="user_content">
                <div className="user_header">
                    <h3>User Details</h3>
                </div>

                <div className="user_group">
                    <div className="user_body_left">Role:</div>
                    <div className="user_body_right">{role || "—"}</div>
                </div>

                <div className="divider"></div>

                <div className="user_group">
                    <div className="user_body_left">Name:</div>
                    <div className="user_body_right">{firstName} {lastName}</div>
                </div>

                <div className="divider"></div>

                <div className="user_group">
                    <div className="user_body_left">Email:</div>
                    <div className="user_body_right">{email}</div>
                </div>

                <div className="divider"></div>

                <div className="user_group">
                    <div className="user_body_left">Phone:</div>
                    <div className="user_body_right">{phoneNumber || "—"}</div>
                </div>

                <div className="divider"></div>

                <div className="user_group">
                    <div className="user_body_left">Status:</div>
                    <div className="user_body_right">
                        <span className={isActive
                            ? "user_status user_status--active"
                            : "user_status user_status--suspended"
                        }>
                            {isActive ? "Active" : "Suspended"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="actions_group" ref={actionRef}>
                {isActive ? (
                    <button className="btn_primary" onClick={onSuspend}>
                        Suspend Account
                    </button>
                ) : (
                    <button className="btn_primary" onClick={onActivate}>
                        Activate Account
                    </button>
                )}
            </div>
        </div>
    );
}

export default UserDetails;