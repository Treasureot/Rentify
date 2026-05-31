import { useState, useEffect, useCallback } from "react";
import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import "../../Styles/Landlord.css";
import { useNavigate } from "react-router-dom";


type LandlordLease = {
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

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

const LandlordPayment = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";
    const token     = localStorage.getItem("accessToken") || "";
    const navigate  = useNavigate();

    const [leases, setLeases]       = useState<LandlordLease[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState("");


    const fetchLeases = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(
                "https://propms-api.fly.dev/api/v1/Leases/landlord-leases",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                // Only show Active leases on the Payment Schedules page
                setLeases((data.data as LandlordLease[]).filter((l) => l.status === "Active"));
            } else {
                setError(data.message || "Failed to load leases.");
            }
        } catch {
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchLeases(); }, [fetchLeases]);

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
                            <h3>Payment Schedules</h3>
                            <p>Track tenant rent payment timelines for active leases.</p>
                        </div>
                    </div>

                    <div className="landlord_property_content">
                        <div className="payment_content">
                            <h3>Active Leases</h3>

                            <div className="payment_body">
                                {isLoading ? (
                                    <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                        Loading active leases…
                                    </p>
                                ) : error ? (
                                    <div style={{
                                        backgroundColor: "#fff5f5",
                                        border: "1px solid #feb2b2",
                                        borderRadius: "8px",
                                        padding: "12px 16px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        width: "100%",
                                    }}>
                                        <span style={{ color: "#e53e3e", fontSize: "18px" }}>⚠</span>
                                        <p style={{ color: "#e53e3e", fontSize: "14px", margin: 0 }}>{error}</p>
                                    </div>
                                ) : leases.length === 0 ? (
                                    <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                        No active leases found.
                                    </p>
                                ) : (
                                    leases.map((lease) => (
                                        <div className="payment-card" key={lease.id}>
                                            <div className="property-content">

                                                {/* Status badge */}
                                                <span className="lease-status">● {lease.status}</span>

                                                {/* Rent */}
                                                <div className="lease-price" style={{ marginTop: 40 }}>
                                                    <span style={{ fontSize: 14, marginRight: 2 }}>₦</span>
                                                    <h4 style={{ margin: 0 }}>{formatCurrency(lease.rentAmount)}</h4>
                                                    <span className="property-period">/ year</span>
                                                </div>

                                                <div className="property-title">{lease.propertyTitle}</div>

                                                <div className="property-location" style={{ marginTop: 4, fontSize: 13 }}>
                                                    {lease.propertyAddress}
                                                </div>

                                                <div className="divider" />

                                                {/* Tenant details */}
                                                <div className="property-tenant">
                                                    <div className="tenant-details">
                                                        <p>Tenant:</p>
                                                        <h4>{lease.tenantName}</h4>
                                                    </div>
                                                    <div className="tenant-details">
                                                        <p>Email:</p>
                                                        <h4>{lease.tenantEmail}</h4>
                                                    </div>
                                                    <div className="tenant-details">
                                                        <p>Start Date:</p>
                                                        <h4>{formatDate(lease.startDate)}</h4>
                                                    </div>
                                                    <div className="tenant-details">
                                                        <p>End Date:</p>
                                                        <h4>{formatDate(lease.endDate)}</h4>
                                                    </div>
                                                </div>

                                                {/* CTA */}
                                                <div className="modal_actions_card">
                                                    <button
                                                        className="btn_primary"
                                                        style={{ marginTop: 16, marginBottom: 0 }}
                                                        onClick={() => navigate(`/payment-schedule/${lease.id}`)}
                                                    >
                                                        View Payment Schedule
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
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

export default LandlordPayment;