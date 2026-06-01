import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { LeaseData } from "../pages/Tenants/TenantLease";
import "../Styles/cards.css";
import "../Styles/Tenant.css";

interface TenantPaymentCardProps {
    lease: LeaseData;
    onCancelRequest?: (leaseId: string) => void;
    onViewSchedule: (leaseId: string) => void;
    onLeaseUpdated?: () => void;
}

const statusStyles: Record<string, string> = {
    Active:   "schedule_status schedule_status--paid",
    Approved: "schedule_status schedule_status--partial",
    Pending:  "schedule_status schedule_status--pending",
    Rejected: "schedule_status schedule_status--overdue",
};

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const TenantPaymentCard = ({
    lease,
    onCancelRequest,
    onViewSchedule,
    onLeaseUpdated,
}: TenantPaymentCardProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [isCancelling, setIsCancelling]           = useState(false);
    const [isInitiating, setIsInitiating]           = useState(false);
    const [actionError, setActionError]             = useState("");


    const handleCancelConfirm = async () => {
        setActionError("");
        setIsCancelling(true);
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Leases/${lease.id}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setShowConfirmCancel(false);
                onCancelRequest?.(lease.id);
                onLeaseUpdated?.();
            } else {
                setActionError(data.message || "Failed to cancel request.");
                setShowConfirmCancel(false);
            }
        } catch {
            setActionError("No details found at the moment.");
            setShowConfirmCancel(false);
        } finally {
            setIsCancelling(false);
        }
    };

    const handleMakePayment = async () => {
        setActionError("");
        setIsInitiating(true);
        try {
            const res = await fetch(
                "https://propms-api.fly.dev/api/v1/Payments/paystack/initialize",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ leaseId: lease.id }),
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                // Store the reference so the callback page can verify it
                localStorage.setItem("paystack_reference", data.data.reference);
                localStorage.setItem("paystack_payment_id", data.data.paymentId);
                window.location.href = data.data.authorizationUrl;
            } else {
                setActionError(data.message || "Could not initialize payment. Please try again.");
            }
        } catch {
            setActionError("No details found at the moment.");
        } finally {
            setIsInitiating(false);
        }
    };

    return (
        <div className={`tenant_payment_card tenant_payment_card--${lease.status.toLowerCase()}`}>

            {/* Top row */}
            <div className="tenant_payment_card__top">
                <div>
                    <h3 className="tenant_payment_card__title">{lease.propertyTitle}</h3>
                    <p className="tenant_payment_card__address">
                        <FaMapMarkerAlt size={12} /> {lease.propertyAddress}
                    </p>
                </div>
                <span className={statusStyles[lease.status] ?? "schedule_status"}>
                    {lease.status}
                </span>
            </div>

            {/* Details grid */}
            <div className="tenant_payment_card__details">
                <div className="tenant_payment_card__detail">
                    <span className="tenant_payment_card__label">Lease ID</span>
                    <span className="tenant_payment_card__value">#{lease.id.slice(0, 8)}…</span>
                </div>
                <div className="tenant_payment_card__detail">
                    <span className="tenant_payment_card__label">Rent</span>
                    <span className="tenant_payment_card__value tenant_payment_card__rent">
                        {formatCurrency(lease.rentAmount)}
                        <span>/year</span>
                    </span>
                </div>
                <div className="tenant_payment_card__detail">
                    <span className="tenant_payment_card__label">Start Date</span>
                    <span className="tenant_payment_card__value">{formatDate(lease.startDate)}</span>
                </div>
                <div className="tenant_payment_card__detail">
                    <span className="tenant_payment_card__label">End Date</span>
                    <span className="tenant_payment_card__value">{formatDate(lease.endDate)}</span>
                </div>
            </div>

            {/* Error */}
            {actionError && (
                <p style={{ color: "#e53e3e", fontSize: "13px", margin: "4px 0 8px" }}>
                    ⚠ {actionError}
                </p>
            )}

            {/* Actions */}
            <div className="tenant_payment_card__actions">

                {/* PENDING — cancel */}
                {lease.status === "Pending" && (
                    <>
                        {!showConfirmCancel ? (
                            <button
                                className="tenant_payment_card__btn tenant_payment_card__btn--cancel"
                                onClick={() => setShowConfirmCancel(true)}
                            >
                                Cancel Request
                            </button>
                        ) : (
                            <div className="tenant_payment_card__confirm">
                                <p>Are you sure you want to cancel this lease request?</p>
                                <div className="tenant_payment_card__confirm_btns">
                                    <button
                                        className="tenant_payment_card__btn tenant_payment_card__btn--ghost"
                                        onClick={() => setShowConfirmCancel(false)}
                                        disabled={isCancelling}
                                    >
                                        No, keep it
                                    </button>
                                    <button
                                        className="tenant_payment_card__btn tenant_payment_card__btn--cancel"
                                        onClick={handleCancelConfirm}
                                        disabled={isCancelling}
                                    >
                                        {isCancelling ? "Cancelling…" : "Yes, cancel"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* APPROVED — make first payment via Paystack */}
                {lease.status === "Approved" && (
                    <button
                        className="tenant_payment_card__btn tenant_payment_card__btn--pay"
                        onClick={handleMakePayment}
                        disabled={isInitiating}
                    >
                        {isInitiating ? (
                            <>
                                <span className="paystack_spinner" /> Redirecting…
                            </>
                        ) : (
                            "Make First Payment"
                        )}
                    </button>
                )}

                {/* ACTIVE — view schedule */}
                {lease.status === "Active" && (
                    <button
                        className="tenant_payment_card__btn tenant_payment_card__btn--schedule"
                        onClick={() => onViewSchedule(lease.id)}
                    >
                        View Payment Schedule
                    </button>
                )}

                {/* REJECTED */}
                {lease.status === "Rejected" && (
                    <p className="tenant_payment_card__rejected_note">
                        This lease request was rejected by the landlord.
                    </p>
                )}
            </div>
        </div>
    );
};

export default TenantPaymentCard;