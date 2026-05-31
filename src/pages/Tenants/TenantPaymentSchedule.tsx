import ScheduleTable from "../../components/ScheduleTable";
import type { LeaseData } from "../Tenants/TenantLease";
import "../../Styles/Tenant.css";

interface TenantPaymentScheduleProps {
    lease: LeaseData;
    onBack: () => void;
}

const TenantPaymentSchedule = ({ lease, onBack }: TenantPaymentScheduleProps) => {
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-NG").format(amount);

    return (
        <div className="tenant_schedule">
            <div className="tenant_schedule__header">
                <div className="tenant_schedule__header_left">
                    <button className="property-details__back" onClick={onBack}>
                        &#8592; Back to My Leases
                    </button>
                    <h2>{lease.propertyTitle}</h2>
                    <p>{lease.propertyAddress}</p>
                    <div className="tenant_schedule__meta">
                        <span>Lease #{lease.id.slice(0, 8)}…</span>
                        <span>·</span>
                        <span>₦{formatCurrency(lease.rentAmount)} / year</span>
                        <span>·</span>
                        <span>
                            {formatDate(lease.startDate)}
                            {" — "}
                            {formatDate(lease.endDate)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="tenant_schedule__table">

                <ScheduleTable lease={lease} role="tenant" />
            </div>
        </div>
    );
};

export default TenantPaymentSchedule;