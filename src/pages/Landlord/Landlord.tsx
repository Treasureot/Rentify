import { useEffect, useState } from "react";
import "../../Styles/Landlord.css"
import LandlordSidebar from '../../components/LandlordSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import RevenueCard from '../../components/RevenueCard';
import DefaultCard from '../../components/DefaultCard';

interface DashboardData {
    totalProperties: number;
    occupiedProperties: number;
    vacantProperties: number;
    pendingApprovalProperties: number;
    totalRentCollected: number;
    overduePaymentsCount: number;
    overdueAmount: number;
}

const Landlord = () => {
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
                    `https://propms-api.fly.dev/api/v1/Dashboard/landlord`,
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
                setError('');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, [token]);

    return (
        <div className="landlord">
            <div className="landlord_body_left">
                <LandlordSidebar />
            </div>

            <div className="landlord_body_right">
                <div className="landlord_dashboard_header">
                    <DashboardHeader
                        firstName={firstName}
                        lastName={lastName}
                    />
                </div>

                <div className="landlord_body">
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
                                label='TOTAL RENT COLLECTED'
                                TotalRevenue={isLoading ? 0 : (dashboardData?.totalRentCollected ?? 0)}
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='OCCUPIED PROPERTIES'
                                TotalValue={isLoading ? 0 : (dashboardData?.occupiedProperties ?? 0)}
                                bgColor='#F0FFF7'
                                colorText='var(--primary)'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='PENDING APPROVALS'
                                TotalValue={isLoading ? 0 : (dashboardData?.pendingApprovalProperties ?? 0)}
                                bgColor='#FFF9E5'
                                colorText='#E5A000'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='VACANT PROPERTIES'
                                TotalValue={isLoading ? 0 : (dashboardData?.vacantProperties ?? 0)}
                                bgColor='#F9F3F4'
                                colorText='#BA1A1A'
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
                                label='OVERDUE AMOUNT'
                                TotalValue={isLoading ? 0 : (dashboardData?.overdueAmount ?? 0)}
                                bgColor='#F2F4F6'
                                colorText='var(--text-h)'
                            />
                        </div>

                        <div className="default_metrics">
                            <DefaultCard
                                label='OVERDUE COUNT'
                                TotalValue={isLoading ? 0 : (dashboardData?.overduePaymentsCount ?? 0)}
                                bgColor='#F2F4F6'
                                colorText='var(--text-h)'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landlord;