import DashboardHeader from "../../components/DashboardHeader";
import LandlordSidebar from "../../components/LandlordSidebar";
import NotificationsPage from "../../components/NotificationsPage";
import "../../Styles/Landlord.css";
import "../../Styles/Cards.css";

const LandlordNotifications = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

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
                    <NotificationsPage role="landlord" />
                </div>
            </div>
        </div>
    );
};

export default LandlordNotifications;