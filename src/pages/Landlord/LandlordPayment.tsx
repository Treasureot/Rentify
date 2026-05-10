import { useState } from "react";
import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import PaymentCard from "../../components/PaymentCard";
import type { LeaseData } from "../../components/LeaseCard";
import "../../Styles/Landlord.css";

// remove once API is integrated
const SEED_LEASES: LeaseData[] = [
    {
        leaseId: 103,
        status: "Active",
        propertyRentAmount: "1,800,000",
        period: "year",
        propertyTitle: "Lekki 2-Bedroom Flat",
        PropertyAddress: "15 Admiralty Way, Lekki Phase 1, Lagos",
        tenantName: "John Doe",
        tenantPhone: "08012345678",
        startDate: "2026-05-03",
        endDate: "2027-04-01",
    },
    {
        leaseId: 102,
        status: "Active",
        propertyRentAmount: "1,800,000",
        period: "year",
        propertyTitle: "Lekki 2-Bedroom Flat",
        PropertyAddress: "15 Admiralty Way, Lekki Phase 1, Lagos",
        tenantName: "Jane Smith",
        tenantPhone: "08087654321",
        startDate: "2026-05-03",
        endDate: "2027-04-01",
    },
    {
        leaseId: 101,
        status: "Active",
        propertyRentAmount: "1,800,000",
        period: "year",
        propertyTitle: "Lekki 2-Bedroom Flat",
        PropertyAddress: "15 Admiralty Way, Lekki Phase 1, Lagos",
        tenantName: "Emeka Obi",
        tenantPhone: "08011223344",
        startDate: "2026-05-03",
        endDate: "2027-04-01",
    },
];

const LandlordPayment = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

    // replace SEED_LEASES with API call when ready
    const [allLeases, setAllLeases] = useState<LeaseData[]>(SEED_LEASES);

    const handleLeaseUpdated = (updated: LeaseData) => {
        setAllLeases((prev) =>
            prev.map((l) => (l.leaseId === updated.leaseId ? updated : l))
        );
    };

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
                            <p>Track tenant rent payment timelines</p>
                        </div>
                    </div>

                    <div className="landlord_property_content">
                        <div className="payment_content">
                            <h3>Active Leases</h3>

                            <div className="payment_body">
                                {allLeases.map((lease) => (
                                    <PaymentCard
                                        key={lease.leaseId}
                                        id={lease.leaseId}
                                        leaseId={lease.leaseId}
                                        status={lease.status}
                                        propertyRentAmount={lease.propertyRentAmount}
                                        period={lease.period}
                                        propertyTitle={lease.propertyTitle}
                                        PropertyAddress={lease.PropertyAddress}
                                        tenantName={lease.tenantName}
                                        tenantPhone={lease.tenantPhone}
                                        startDate={lease.startDate}
                                        endDate={lease.endDate}
                                        pendingLease={lease}
                                        onLeaseUpdated={handleLeaseUpdated}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandlordPayment;