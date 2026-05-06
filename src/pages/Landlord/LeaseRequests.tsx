import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import "../../Styles/Landlord.css";
import LeaseCard from "../../components/LeaseCard";


const LeaseRequests = () => {

    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

    return (
        <>
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
                            <p>Manage tenant interest and approve or reject rental requests</p>
                        </div>
                    </div>

                    <div className="landlord_property_content">
                        <div className="payment_content">
                            <div className="payment_body">
                                <LeaseCard
                                    id={3}
                                    leaseId={103}
                                    tenantId={203}
                                    status="Pending"
                                    propertyRentAmount="1,800,000"
                                    period="year"
                                    propertyTitle="Lekki 2-Bedroom Flat"
                                    PropertyAddress="15 Admiralty Way, Lekki Phase 1, Lagos"
                                    tenantName="John Doe"
                                    tenantPhone="08012345678"
                                    createdDate="2026-05-03"
                                    message="I'm interested, I can move in next month"
                                />

                                <LeaseCard
                                    id={2}
                                    tenantId={202}
                                    leaseId={102}
                                    status="Pending"
                                    propertyRentAmount="1,800,000"
                                    period="year"
                                    propertyTitle="Lekki 2-Bedroom Flat"
                                    PropertyAddress="15 Admiralty Way, Lekki Phase 1, Lagos"
                                    tenantName="John Doe"
                                    tenantPhone="08012345678"
                                    createdDate="2026-05-03"
                                    message="I'm interested, I can move in next month"
                                />

                                <LeaseCard
                                    id={1}
                                    tenantId={201}
                                    leaseId={101}
                                    status="Active"
                                    propertyRentAmount="1,800,000"
                                    period="year"
                                    propertyTitle="Lekki 2-Bedroom Flat"
                                    PropertyAddress="15 Admiralty Way, Lekki Phase 1, Lagos"
                                    tenantName="John Doe"
                                    tenantPhone="08012345678"
                                    createdDate="2026-05-03"
                                    message="I'm interested, I can move in next month"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
        </>
    );
}

export default LeaseRequests;