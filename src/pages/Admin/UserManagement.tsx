import "../../Styles/Admin.css";
import '../../Styles/Landlord.css';
import "../../Styles/Cards.css";
import AdminSidebar from "../../components/AdminSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import UserTable from "../../components/UserTable";
import { useState, useEffect } from "react";

type UserItem = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
};

const UserManagement = () => {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName  = localStorage.getItem('lastName')  || '';
    const token     = localStorage.getItem('accessToken') || '';

    const [users, setUsers]       = useState<UserItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]       = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError('');

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Admin/users`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );

                const response = await request.json();

                if (request.ok && response.success) {
                    setUsers(response.data);
                } else {
                    setError(response.message || 'Failed to load users.');
                }

            } catch (err) {
                setError('No User Found');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleSuspend = async (id: string) => {
        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Admin/users/${id}/suspend`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                setUsers((prev) =>
                    prev.map((u) => (u.id === id ? { ...u, isActive: false } : u))
                );
            } else {
                setError(response.message || 'Failed to suspend user.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        }
    };

    const handleActivate = async (id: string) => {
        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Admin/users/${id}/activate`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                setUsers((prev) =>
                    prev.map((u) => (u.id === id ? { ...u, isActive: true } : u))
                );
            } else {
                setError(response.message || 'Failed to activate user.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        }
    };

    return (
        <div className="admin">
            <div className="admin_body_left">
                <AdminSidebar />
            </div>

            <div className="admin_body_right">
                <div className="admin_dashboard_header">
                    <DashboardHeader
                        firstName={firstName}
                        lastName={lastName}
                    />
                </div>

                <div className="admin_body">
                    <div className="admin_property_header">
                        <div className="admin_property_header_left">
                            <h3>User Management</h3>
                            <p>Manage landlords, tenants and account statuses.</p>
                        </div>
                    </div>

                    <div className="admin_property_content">
                        {isLoading ? (
                            <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                Loading users...
                            </p>
                        ) : error ? (
                            <div style={{
                                backgroundColor: '#fff5f5',
                                border: '1px solid #feb2b2',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ color: '#e53e3e', fontSize: '18px' }}>⚠</span>
                                <p style={{ color: '#e53e3e', fontSize: '14px', margin: 0 }}>{error}</p>
                            </div>
                        ) : (
                            <UserTable
                                users={users}
                                onSuspend={handleSuspend}
                                onActivate={handleActivate}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagement;