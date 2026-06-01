import { useEffect, useState } from "react";
import "../../Styles/Admin.css";
import '../../Styles/Landlord.css';
import "../../Styles/cards.css";
import AdminSidebar from "../../components/AdminSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import RevenueCard from "../../components/RevenueCard";
import DefaultCard from "../../components/DefaultCard";
// import Activity from "../../components/Activity";

interface DashboardData {
    totalUsers: number;
    totalLandlords: number;
    totalTenants: number;
    totalProperties: number;
    pendingApprovals: number;
    activeLeases: number;
    totalRevenue: number;
    overduePayments: number;
}

const Admin = () => {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName  = localStorage.getItem('lastName')  || '';
    const token     = localStorage.getItem('accessToken') || '';

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            setIsLoading(true);
            setError('');

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Dashboard/admin`,
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
                    setDashboardData(response.data);
                } else {
                    setError(response.message || 'Failed to load dashboard data.');
                }

            } catch (err) {
                setError('No details found at the moment.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, [token]);

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
                    {error && (
                        <div style={{
                            backgroundColor: '#fff5f5',
                            border: '1px solid #feb2b2',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ color: '#e53e3e', fontSize: '18px' }}>⚠</span>
                            <p style={{ color: '#e53e3e', fontSize: '14px', margin: 0 }}>{error}</p>
                        </div>
                    )}

                    <div className="landlord_metrics">
                        <div className="revenue_metrics">
                            <RevenueCard
                                label='TOTAL REVENUE'
                                TotalRevenue={isLoading ? 0 : (dashboardData?.totalRevenue ?? 0)}
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='ACTIVE LEASES'
                                TotalValue={isLoading ? 0 : (dashboardData?.activeLeases ?? 0)}
                                bgColor='#F0FFF7'
                                colorText='var(--primary)'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='PENDING APPROVALS'
                                TotalValue={isLoading ? 0 : (dashboardData?.pendingApprovals ?? 0)}
                                bgColor='#FFF9E5'
                                colorText='#E5A000'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='OVERDUE PAYMENTS'
                                TotalValue={isLoading ? 0 : (dashboardData?.overduePayments ?? 0)}
                                bgColor='#F9F3F4'
                                colorText='#BA1A1A'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='TOTAL USERS'
                                TotalValue={isLoading ? 0 : (dashboardData?.totalUsers ?? 0)}
                                bgColor='#F2F4F6'
                                colorText='var(--text-h)'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='TOTAL PROPERTIES'
                                TotalValue={isLoading ? 0 : (dashboardData?.totalProperties ?? 0)}
                                bgColor='#F2F4F6'
                                colorText='var(--text-h)'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='TOTAL LANDLORDS'
                                TotalValue={isLoading ? 0 : (dashboardData?.totalLandlords ?? 0)}
                                bgColor='#F2F4F6'
                                colorText='var(--text-h)'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='TOTAL TENANTS'
                                TotalValue={isLoading ? 0 : (dashboardData?.totalTenants ?? 0)}
                                bgColor='#F2F4F6'
                                colorText='var(--text-h)'
                            />
                        </div>
                    </div>

                    {/* <div className="recent_activities">
                        <div className="activities_header">
                            <h3>Recent Activity</h3>
                        </div>

                        <div className="activity_body">
                            <Activity
                                title='Payment received from John Doe'
                                time='2 hours ago'
                                description='Transaction for Penthouse B, Rentify Towers completed successfully'
                                amount={450000}
                            />
                        </div>

                        <div className="activity_body">
                            <Activity
                                title='New Tenant Assigned'
                                time='Yesterday'
                                description='Sarah Jenkins has been verified and assigned to Unit 402, Lekki Heights.'
                            />
                        </div>

                        <div className="activity_body">
                            <Activity
                                title='Maintenance Request: Plumbing'
                                time='Oct 12'
                                description='Unit 105 reported a leak in the master bathroom. Urgent attention required.'
                            />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Admin;