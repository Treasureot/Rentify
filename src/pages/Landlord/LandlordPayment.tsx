import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import PaymentCard from "../../components/PaymentCard";
import "../../Styles/Landlord.css";

const LandlordPayment = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

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
                            <h3>Payment Schedules</h3>
                            <p>Track tenant rent payment timelines</p>
                        </div>
                    </div>

                    <div className="landlord_property_content">
                        <div className="payment_content">
                            <h3>Active Leases</h3>

                            <div className="payment_body">
                                <PaymentCard
                                    id={3}
                                    leaseId={103}
                                    status="Active"
                                    propertyRentAmount="1,800,000"
                                    period="year"
                                    propertyTitle="Lekki 2-Bedroom Flat"
                                    PropertyAddress="15 Admiralty Way, Lekki Phase 1, Lagos"
                                    tenantName="John Doe"
                                    tenantPhone="08012345678"
                                    startDate="2026-05-03"
                                    endDate="2027-04-01"
                                />

                                <PaymentCard
                                    id={2}
                                    leaseId={102}
                                    status="Active"
                                    propertyRentAmount="1,800,000"
                                    period="year"
                                    propertyTitle="Lekki 2-Bedroom Flat"
                                    PropertyAddress="15 Admiralty Way, Lekki Phase 1, Lagos"
                                    tenantName="John Doe"
                                    tenantPhone="08012345678"
                                    startDate="2026-05-03"
                                    endDate="2027-04-01"
                                />

                                <PaymentCard
                                    id={1}
                                    leaseId={101}
                                    status="Active"
                                    propertyRentAmount="1,800,000"
                                    period="year"
                                    propertyTitle="Lekki 2-Bedroom Flat"
                                    PropertyAddress="15 Admiralty Way, Lekki Phase 1, Lagos"
                                    tenantName="John Doe"
                                    tenantPhone="08012345678"
                                    startDate="2026-05-03"
                                    endDate="2027-04-01"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandlordPayment;