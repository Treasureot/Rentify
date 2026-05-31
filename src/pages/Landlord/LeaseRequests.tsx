import { useState, useEffect, useCallback } from "react";
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

type LeaseFilter = "All" | "Pending" | "Approved" | "Active" | "Rejected" | "Terminated";

const FILTERS: LeaseFilter[] = ["All", "Pending", "Approved", "Active", "Rejected", "Terminated"];

const filterAccent: Record<LeaseFilter, string> = {
    All:        "var(--text-h)",
    Pending:    "#e5a000",
    Approved:   "#2563eb",
    Active:     "var(--primary)",
    Rejected:   "#d92d20",
    Terminated: "#64748b",
};

const LeaseRequests = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";
    const token     = localStorage.getItem("accessToken") || "";

    const [leases, setLeases]         = useState<LeaseItem[]>([]);
    const [activeFilter, setActiveFilter] = useState<LeaseFilter>("All");
    const [isLoading, setIsLoading]   = useState(true);
    const [error, setError]           = useState("");


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
                setLeases(data.data);
            } else {
                setError(data.message || "Failed to load lease requests.");
            }
        } catch {
            setError("No property lease found.");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchLeases(); }, [fetchLeases]);

   
    const handleStatusChange = (id: string, newStatus: string) => {
        setLeases((prev) =>
            prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
    };


    const displayed =
        activeFilter === "All"
            ? leases
            : leases.filter((l) => l.status === activeFilter);

    const countFor = (f: LeaseFilter) =>
        f === "All" ? leases.length : leases.filter((l) => l.status === f).length;

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
                            <h3>Lease Requests</h3>
                            <p>Manage tenant interest and approve, reject, or terminate leases.</p>
                        </div>
                    </div>

                    {/* ── Status filter tabs ── */}
                    <div className="lease_filter_tabs">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                className={`lease_filter_tab ${activeFilter === f ? "lease_filter_tab--active" : ""}`}
                                style={activeFilter === f
                                    ? { borderColor: filterAccent[f], color: filterAccent[f], backgroundColor: `${filterAccent[f]}14` }
                                    : undefined
                                }
                                onClick={() => setActiveFilter(f)}
                            >
                                {f}
                                <span className="lease_filter_count">{countFor(f)}</span>
                            </button>
                        ))}
                    </div>

                    <div className="landlord_property_content">
                        <div className="payment_content">
                            <div className="payment_body">
                                {isLoading ? (
                                    <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                        Loading lease requests…
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
                                ) : displayed.length === 0 ? (
                                    <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                        No {activeFilter.toLowerCase()} lease requests found.
                                    </p>
                                ) : (
                                    displayed.map((lease) => (
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