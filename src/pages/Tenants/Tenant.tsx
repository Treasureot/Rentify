import TenantHeader from "../../components/TenantHeader";
import TenantSidebar from "../../components/TenantSidebar"

const Tenant = () => {
    return (
        <>
        <div className="tenant">
            <div className="tenant_top">
                <TenantHeader 
                firstName="Sarah"
                lastName ="Sarah"
                />
            </div>

            <div className="tenant_bottom">
                <div className="tenant_body_left">
                    <TenantSidebar />
                </div>
            </div>
        </div>
        </>
    );
}

export default Tenant;