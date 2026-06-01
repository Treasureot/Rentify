import "../../Styles/Admin.css";
import "../../Styles/Landlord.css";
import "../../Styles/cards.css";
import AdminSidebar from "../../components/AdminSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import PropertyApprovalTable from "../../components/PropertyApprovalTable";

const PropertyApproval = () => {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName  = localStorage.getItem('lastName')  || '';

    return (
        <div className="admin">
            <div className="admin_body_left">
                <AdminSidebar />
            </div>

            <div className="admin_body_right">
                <div className="admin_dashboard_header">
                    <DashboardHeader
                        firstName={firstName}
                        lastName={lastName}
                    />
                </div>

                <div className="admin_body">
                    <div className="admin_property_header">
                        <div className="admin_property_header_left">
                            <h3>Pending Property Approval</h3>
                            <p>Review and approve submitted properties.</p>
                        </div>
                    </div>

                    <div className="admin_property_content">
                        <PropertyApprovalTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyApproval;