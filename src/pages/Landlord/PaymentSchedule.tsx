import "../../Styles/Landlord.css";
import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import Button from "../../components/Button";
import ScheduleTable from "../../components/ScheduleTable";
import { useNavigate, useParams } from "react-router-dom";

const PaymentSchedule = () => {
    const navigate = useNavigate();
    const { leaseId } = useParams<{ leaseId: string }>();

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
                        <ScheduleTable />
                    </div>
                </div>
            </div>
        </div>        
        </>

    );
};

export default PaymentSchedule;