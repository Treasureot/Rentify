import "../Styles/cards.css";
import { useState, useEffect, useRef } from "react";
import UserDetails from "./UserDetails";
import ApprovalModal from "./ApprovalModal";
import SuccessModal from "./SuccessModal";

type UserItem = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isActive: boolean;
    role: string;
};

interface UserTableProps {
    users: UserItem[];
    onSuspend: (id: string) => void;
    onActivate: (id: string) => void;
}

const UserTable = ({ users, onActivate, onSuspend }: UserTableProps) => {
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [detailsUser, setDetailsUser] = useState<UserItem | null>(null);
    const [suspendUser, setSuspendUser] = useState<UserItem | null>(null);
    const [activateUser, setActivateUser] = useState<UserItem | null>(null);
    const [openSuspendSuccess, setOpenSuspendSuccess] = useState(false);
    const [openActivateSuccess, setOpenActivateSuccess] = useState(false);

    const actionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const setRef = (id: string) => (el: HTMLDivElement | null) => {
        if (el) actionRefs.current.set(id, el);
        else actionRefs.current.delete(id);
    };

    const toggleAction = (id: string) => {
        setOpenActionId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openActionId === null) return;
            const activeRef = actionRefs.current.get(openActionId);
            if (activeRef && !activeRef.contains(event.target as Node)) {
                setOpenActionId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openActionId]);

    useEffect(() => {
        if (detailsUser) {
            const updated = users.find((u) => u.id === detailsUser.id);
            if (updated) setDetailsUser(updated);
        }
    }, [users]);

    // Derive display status from isActive boolean
    const getStatusLabel = (isActive: boolean) => (isActive ? "Active" : "Suspended");

    const getStatusClass = (isActive: boolean) =>
        isActive
            ? "user_status user_status--active"
            : "user_status user_status--suspended";

    const getUserRoleClass = (role: string) => {
        switch (role) {
            case "Landlord": return "user_role user_role--landlord";
            case "Tenant":   return "user_role user_role--tenant";
            default:         return "user_role";
        }
    };

    const handleConfirmSuspend = () => {
        if (!suspendUser) return;
        onSuspend(suspendUser.id);
        setSuspendUser(null);
        setOpenSuspendSuccess(true);
    };

    const handleConfirmActivate = () => {
        if (!activateUser) return;
        onActivate(activateUser.id);
        setActivateUser(null);
        setOpenActivateSuccess(true);
    };

    return (
        <>
            <div className="table_group">
                <table className="user_table">
                    <thead>
                        <tr>
                            <th style={{ borderRadius: "10px 0px 0px 0px" }}>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Status</th>
                            <th style={{ borderRadius: "0px 10px 0px 0px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}
                                >
                                    No users yet.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>
                                        <span className={getUserRoleClass(user.role)}>
                                            {user.role ?? "—"}
                                        </span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber || "—"}</td>
                                    <td>
                                        <span className={getStatusClass(user.isActive)}>
                                            {getStatusLabel(user.isActive)}
                                        </span>
                                    </td>

                                    <td className="actions_group">
                                        <div className="action_body" ref={setRef(user.id)}>
                                            <button
                                                className="action_btn"
                                                onClick={() => toggleAction(user.id)}
                                            >
                                                ⋮
                                            </button>

                                            {openActionId === user.id && (
                                                <div className="dropdown_menu">
                                                    <button onClick={() => {
                                                        setDetailsUser(user);
                                                        setOpenActionId(null);
                                                    }}>
                                                        View Details
                                                    </button>

                                                    {user.isActive ? (
                                                        <button onClick={() => {
                                                            setSuspendUser(user);
                                                            setOpenActionId(null);
                                                        }}>
                                                            Suspend
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => {
                                                            setActivateUser(user);
                                                            setOpenActionId(null);
                                                        }}>
                                                            Activate
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {detailsUser && (
                <div className="modal_overlay" onClick={() => setDetailsUser(null)}>
                    <div className="user_details_modal" onClick={(e) => e.stopPropagation()}>
                        <UserDetails
                            id={detailsUser.id}
                            firstName={detailsUser.firstName}
                            lastName={detailsUser.lastName}
                            email={detailsUser.email}
                            phoneNumber={detailsUser.phoneNumber}
                            isActive={detailsUser.isActive}
                            role={detailsUser.role}
                            onClose={() => setDetailsUser(null)}
                            onSuspend={() => {
                                setDetailsUser(null);
                                setSuspendUser(detailsUser);
                            }}
                            onActivate={() => {
                                setDetailsUser(null);
                                setActivateUser(detailsUser);
                            }}
                        />
                    </div>
                </div>
            )}

            {suspendUser && (
                <div className="modal_overlay" onClick={() => setSuspendUser(null)}>
                    <div className="user_details_modal" onClick={(e) => e.stopPropagation()}>
                        <ApprovalModal
                            title="Suspend Account"
                            approvalMessage="Do you want to suspend this account?"
                            label="Suspend"
                            labelAlt="Cancel"
                            onClose={() => setSuspendUser(null)}
                            onConfirm={handleConfirmSuspend}
                            isOpen={!!suspendUser}
                        />
                    </div>
                </div>
            )}

            {activateUser && (
                <div className="modal_overlay" onClick={() => setActivateUser(null)}>
                    <div className="user_details_modal" onClick={(e) => e.stopPropagation()}>
                        <ApprovalModal
                            title="Activate Account"
                            approvalMessage="Do you want to activate this account?"
                            label="Activate"
                            labelAlt="Cancel"
                            onClose={() => setActivateUser(null)}
                            onConfirm={handleConfirmActivate}
                            isOpen={!!activateUser}
                        />
                    </div>
                </div>
            )}

            <SuccessModal
                title="Suspended Successfully"
                message="You have successfully suspended this user. User notified."
                label="Done"
                path=""
                isOpen={openSuspendSuccess}
                onClose={() => setOpenSuspendSuccess(false)}
                onDone={() => setOpenSuspendSuccess(false)}
            />

            <SuccessModal
                title="Activated Successfully"
                message="You have successfully activated this user. User notified."
                label="Done"
                path=""
                isOpen={openActivateSuccess}
                onClose={() => setOpenActivateSuccess(false)}
                onDone={() => setOpenActivateSuccess(false)}
            />
        </>
    );
};

export default UserTable;