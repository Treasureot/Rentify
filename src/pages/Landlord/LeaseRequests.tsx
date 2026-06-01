import { useState, useEffect } from "react";
import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import "../../Styles/Landlord.css";
import LeaseCard from "../../components/LeaseCard";

type LeaseItem = {
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

const LeaseRequests = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";
    const token     = localStorage.getItem("accessToken") || "";

    const [leases, setLeases]       = useState<LeaseItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState('');

    useEffect(() => {
        const fetchLeases = async () => {
            setIsLoading(true);
            setError('');

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Leases/landlord-leases`,
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
                    setLeases(response.data);
                } else {
                    setError(response.message || 'Failed to load lease requests.');
                }

            } catch (err) {
                setError('No details found at the moment.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeases();
    }, [token]);


    const handleStatusChange = (id: string, newStatus: string) => {
        setLeases((prev) =>
            prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
    };

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
                    <div className="landlord_property_header">
                        <div className="landlord_property_header_left">
                            <h3>Lease Requests</h3>
                            <p>Manage tenant interest and approve or reject rental requests.</p>
                        </div>
                    </div>

                    <div className="landlord_property_content">
                        <div className="payment_content">
                            <div className="payment_body">
                                {isLoading ? (
                                    <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                        Loading lease requests...
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
                                ) : leases.length === 0 ? (
                                    <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                        No lease requests found.
                                    </p>
                                ) : (
                                    leases.map((lease) => (
                                        <LeaseCard
                                            key={lease.id}
                                            id={lease.id}
                                            propertyId={lease.propertyId}
                                            propertyTitle={lease.propertyTitle}
                                            propertyAddress={lease.propertyAddress}
                                            tenantId={lease.tenantId}
                                            tenantName={lease.tenantName}
                                            tenantEmail={lease.tenantEmail}
                                            startDate={lease.startDate}
                                            endDate={lease.endDate}
                                            rentAmount={lease.rentAmount}
                                            status={lease.status}
                                            createdDate={lease.createdDate}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaseRequests;