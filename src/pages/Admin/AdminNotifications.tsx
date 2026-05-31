import DashboardHeader from "../../components/DashboardHeader";
import AdminSidebar from "../../components/AdminSidebar";
import NotificationsPage from "../../components/NotificationsPage";
import "../../Styles/Admin.css";
import "../../Styles/Cards.css";

const AdminNotifications = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

    return (
        <div className="admin">
            <div className="admin_body_left">
                <AdminSidebar />
            </div>
            <div className="admin_body_right">
                <div className="admin_dashboard_header">
                    <DashboardHeader firstName={firstName} lastName={lastName} />
                </div>
                <div className="admin_body">
                    <NotificationsPage role="admin" />
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;