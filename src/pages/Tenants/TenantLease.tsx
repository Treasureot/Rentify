import { useState, useEffect } from "react";
import TenantPaymentCard from "../../components/TenantPaymentCard";
import TenantPaymentSchedule from "../Tenants/TenantPaymentSchedule";
import TenantHeader from "../../components/TenantHeader";
import TenantSidebar from "../../components/TenantSidebar";
import "../../Styles/Tenant.css";

type LeaseStatus = "All" | "Active" | "Pending" | "Approved" | "Rejected";

export type LeaseData = {
    id: string;
    propertyId: string;
    propertyTitle: string;
    propertyAddress: string;
    tenantId: string;
    tenantName: string;
    tenantEmail: string;
    startDate: string;
    endDate: string;
    rentAmount: number;
    status: string;
    createdDate: string;
};

const STATUS_TABS: LeaseStatus[] = ["All", "Active", "Pending", "Approved", "Rejected"];

const TenantLease = () => {
    const token     = localStorage.getItem('accessToken') || '';
    const firstName = localStorage.getItem('firstName') || '';
    const lastName  = localStorage.getItem('lastName')  || '';

    const [allLeases, setAllLeases]                   = useState<LeaseData[]>([]);
    const [activeTab, setActiveTab]                   = useState<LeaseStatus>("All");
    const [viewingScheduleFor, setViewingScheduleFor] = useState<string | null>(null);
    const [isLoading, setIsLoading]                   = useState(true);
    const [error, setError]                           = useState('');

    useEffect(() => {
        const fetchLeases = async () => {
            setIsLoading(true);
            setError('');

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Leases/my-leases`,
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
                    setAllLeases(response.data);
                } else {
                    setError(response.message || 'Failed to load leases.');
                }

            } catch {
                setError('No details found at the moment.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeases();
    }, [token]);

    const filteredLeases =
        activeTab === "All"
            ? allLeases
            : allLeases.filter((l) => l.status === activeTab);


    const scheduleForLease = viewingScheduleFor
        ? allLeases.find((l) => l.id === viewingScheduleFor) ?? null
        : null;

    if (scheduleForLease) {
        return (
            <div className="tenant">
                <div className="tenant_top">
                    <TenantHeader firstName={firstName} lastName={lastName} />
                </div>
                <div className="tenant_bottom">
                    <div className="tenant_sidebar">
                        <TenantSidebar />
                    </div>
                    <div className="tenant_body_right">
                        <TenantPaymentSchedule
                            lease={scheduleForLease}
                            onBack={() => setViewingScheduleFor(null)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tenant">
            <div className="tenant_top">
                <TenantHeader firstName={firstName} lastName={lastName} />
            </div>

            <div className="tenant_bottom">
                <div className="tenant_sidebar">
                    <TenantSidebar />
                </div>

                <div className="tenant_body_right">
                    <div className="tenant_lease_requests">

                        <div className="tenant_header">
                            <h2>My Leases</h2>
                            <p>Track and manage all your lease requests.</p>
                        </div>

                        <div className="lease_tabs">
                            {STATUS_TABS.map((tab) => {
                                const count =
                                    tab === "All"
                                        ? allLeases.length
                                        : allLeases.filter((l) => l.status === tab).length;
                                return (
                                    <button
                                        key={tab}
                                        className={`lease_tab ${activeTab === tab ? "lease_tab--active" : ""} lease_tab--${tab.toLowerCase()}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                        <span className="lease_tab_count">{count}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="tenant_lease_body">
                            {isLoading ? (
                                <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                    Loading leases...
                                </p>
                            ) : error ? (
                                <div style={{
                                    backgroundColor: '#fff5f5',
                                    border: '1px solid #feb2b2',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}>
                                    <span style={{ color: '#e53e3e', fontSize: '18px' }}>⚠</span>
                                    <p style={{ color: '#e53e3e', fontSize: '14px', margin: 0 }}>{error}</p>
                                </div>
                            ) : filteredLeases.length > 0 ? (
                                filteredLeases.map((lease) => (
                                    <TenantPaymentCard
                                        key={lease.id}
                                        lease={lease}
                                        onViewSchedule={() => setViewingScheduleFor(lease.id)}
                                    />
                                ))
                            ) : (
                                <div className="lease_empty">
                                    <p>No {activeTab.toLowerCase()} leases found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantLease;