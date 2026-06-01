import { useState, useEffect } from "react";
import "../../Styles/Landlord.css";
import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import Button from "../../components/Button";
import ScheduleTable from "../../components/ScheduleTable";
import { useNavigate, useParams } from "react-router-dom";
import type { LeaseData } from "../Tenants/TenantLease";

const PaymentSchedule = () => {
    const navigate = useNavigate();
    const { leaseId } = useParams<{ leaseId: string }>();
    const token = localStorage.getItem("accessToken") || "";

    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

    const [lease, setLease]       = useState<LeaseData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]       = useState("");

    useEffect(() => {
        if (!leaseId) return;

        const fetchLease = async () => {
            setIsLoading(true);
            setError("");

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Leases/${leaseId}`,
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
                    setLease(response.data);
                } else {
                    setError(response.message || "Failed to load lease details.");
                }
            } catch {
                setError("No details found at the moment.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLease();
    }, [leaseId, token]);

    return (
        <div className="landlord">
            <div className="landlord_body_left">
                <LandlordSidebar />
            </div>

            <div className="landlord_body_right">
                <div className="landlord_dashboard_header">
                    <DashboardHeader firstName={firstName} lastName={lastName} />
                </div>

                <div className="landlord_body">
                    <div className="landlord_property_header">
                        <div className="landlord_property_header_left">
                            <h3>Payment Schedule</h3>
                            <p>Lease #{leaseId}</p>
                        </div>
                        <div className="landlord_property_header_right">
                            <Button
                                label="Back"
                                onClick={() => navigate("/landlord-payment")}
                            />
                        </div>
                    </div>

                    <div className="landlord_property_content">
                        {isLoading ? (
                            <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                Loading lease...
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
                        ) : lease ? (
                            <ScheduleTable lease={lease} />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSchedule;