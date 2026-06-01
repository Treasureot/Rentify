import TenantHeader from "../../components/TenantHeader";
import TenantSidebar from "../../components/TenantSidebar";
import NotificationsPage from "../../components/NotificationsPage";
import "../../Styles/Tenant.css";
import "../../Styles/cards.css";

const TenantNotifications = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

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
                    <NotificationsPage role="tenant" />
                </div>
            </div>
        </div>
    );
};

export default TenantNotifications;