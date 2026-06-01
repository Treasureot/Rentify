import "../Styles/cards.css";
import { useState, useEffect } from "react";
import ApprovalModal from "./ApprovalModal";
import SuccessModal from "./SuccessModal";
import RejectModal from "./RejectModal";
import RejectedModal from "./SuccessModal";
import type { LeaseData } from "../pages/Tenants/TenantLease";

export type ScheduleItem = {
    id: string;
    leaseId: string;
    paymentId?: string;
    dueDate: string;
    amountDue: number;
    amountPaid: number;
    balanceDue: number;
    status: "Pending" | "Paid" | "Overdue" | "Partial";
    payments: any[];
};

const statusStyles: Record<string, string> = {
    Paid:    "schedule_status schedule_status--paid",
    Pending: "schedule_status schedule_status--pending",
    Overdue: "schedule_status schedule_status--overdue",
    Partial: "schedule_status schedule_status--partial",
};

const formatAmount = (amount: number) =>
    `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

type ScheduleTableProps = {
    lease: LeaseData;
    role?: "tenant" | "landlord";
    onPayment?: (item: ScheduleItem) => void;
};

const ScheduleTable = ({ lease, role = "landlord", onPayment }: ScheduleTableProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [schedules, setSchedules]             = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading]             = useState(true);
    const [error, setError]                     = useState("");
    const [selectedItemId, setSelectedItemId]   = useState<string | null>(null);

    // landlord modals
    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [openSuccessModal, setOpenSuccessModal]   = useState(false);
    const [openRejectModal, setOpenRejectModal]     = useState(false);
    const [openRejectedModal, setOpenRejectedModal] = useState(false);
    const [successMessage, setSuccessMessage]   = useState("");

    // paystack (tenant)
    const [initiatingId, setInitiatingId] = useState<string | null>(null);
    const [paystackError, setPaystackError] = useState("");


    useEffect(() => {
        const fetchSchedules = async () => {
            setIsLoading(true);
            setError("");
            try {
                const res = await fetch(
                    `https://propms-api.fly.dev/api/v1/Payments/schedules/lease/${lease.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                if (res.ok && data.success) {
                    setSchedules(data.data);
                } else {
                    setError(data.message || "Failed to load payment schedule.");
                }
            } catch {
                setError("Network error. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedules();
    }, [lease.id, token]);


    const totalDue     = schedules.reduce((s, r) => s + r.amountDue, 0);
    const totalPaid    = schedules.reduce((s, r) => s + r.amountPaid, 0);
    const totalBalance = schedules.reduce((s, r) => s + r.balanceDue, 0);

    const updateStatus = (id: string, status: ScheduleItem["status"]) => {
        setSchedules((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;
                if (status === "Paid")    return { ...s, status, amountPaid: s.amountDue, balanceDue: 0 };
                if (status === "Pending") return { ...s, status, amountPaid: 0, balanceDue: s.amountDue };
                return { ...s, status };
            })
        );
    };


    const handlePayNow = async (item: ScheduleItem) => {
        setPaystackError("");
        setInitiatingId(item.id);
        try {
            const res = await fetch(
                "https://propms-api.fly.dev/api/v1/Payments/paystack/initialize",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    // Pass the rent schedule ID so the backend knows which slot to pay
                    body: JSON.stringify({ rentScheduleId: item.id, leaseId: lease.id }),
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                // Persist so the callback page can verify
                localStorage.setItem("paystack_reference", data.data.reference);
                localStorage.setItem("paystack_payment_id", data.data.paymentId);
                localStorage.setItem("paystack_schedule_id", item.id);
                // Full-page redirect to Paystack checkout
                window.location.href = data.data.authorizationUrl;
            } else {
                setPaystackError(data.message || "Payment initialization failed. Please try again.");
            }
        } catch {
            setPaystackError("Network error. Please check your connection.");
        } finally {
            setInitiatingId(null);
        }
    };

    // ── LANDLORD: confirm ─────────────────────────────────
    const handleApprovalConfirm = async () => {
        if (!selectedItemId) return;
        setOpenApprovalModal(false);
        setIsLoading(true);
        try {
            const schedule = schedules.find((s) => s.id === selectedItemId);
            if (!schedule) throw new Error("Schedule not found");
            const paymentId = schedule.payments?.[0]?.id;
            if (!paymentId) throw new Error("No payment available for confirmation");

            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Payments/${paymentId}/confirm`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccessMessage(data.message || "Payment confirmed successfully.");
                updateStatus(selectedItemId, "Paid");
                setOpenSuccessModal(true);
            } else {
                setError(data.message || "Payment confirmation failed.");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to confirm payment");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessDone = () => {
        if (selectedItemId) {
            const item = schedules.find((s) => s.id === selectedItemId);
            if (item) onPayment?.(item);
        }
        setOpenSuccessModal(false);
        setSelectedItemId(null);
    };

    // ── LANDLORD: reject ──────────────────────────────────
    const handleRejectConfirm = async (reason: string) => {
        if (!selectedItemId) return;
        setIsLoading(true);
        try {
            const schedule = schedules.find((s) => s.id === selectedItemId);
            if (!schedule) throw new Error("Schedule not found");
            const paymentId = schedule.payments?.[0]?.id;
            if (!paymentId) throw new Error("No payment available for rejection");

            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Payments/${paymentId}/reject`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ reason }),
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccessMessage(data.message || "Payment rejected successfully.");
                updateStatus(selectedItemId, "Pending");
                setOpenRejectModal(false);
                setOpenRejectedModal(true);
            } else {
                setError(data.message || "Payment rejection failed.");
                setOpenRejectModal(false);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to reject payment");
            setOpenRejectModal(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRejectedDone = () => {
        setOpenRejectedModal(false);
        setSelectedItemId(null);
    };

    // ── render states ─────────────────────────────────────
    if (isLoading) {
        return (
            <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                Loading payment schedule…
            </p>
        );
    }

    if (error) {
        return (
            <div style={{
                backgroundColor: "#fff5f5", border: "1px solid #feb2b2",
                borderRadius: "8px", padding: "12px 16px",
                display: "flex", alignItems: "center", gap: "8px",
            }}>
                <span style={{ color: "#e53e3e", fontSize: "18px" }}>⚠</span>
                <p style={{ color: "#e53e3e", fontSize: "14px", margin: 0 }}>{error}</p>
            </div>
        );
    }

    if (schedules.length === 0) {
        return (
            <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                No payment schedule found for this lease.
            </p>
        );
    }

    const isPayableTenant = role === "tenant";

    return (
        <>
            {/* Summary cards */}
            <div className="schedule_summary">
                <div className="schedule_summary_item">
                    <span>Total Due</span>
                    <strong>{formatAmount(totalDue)}</strong>
                </div>
                <div className="schedule_summary_paid">
                    <span>Total Paid</span>
                    <strong className="schedule_summary_item--paid">{formatAmount(totalPaid)}</strong>
                </div>
                <div className="schedule_summary_bal">
                    <span>Balance Remaining</span>
                    <strong className="schedule_summary_item--balance">{formatAmount(totalBalance)}</strong>
                </div>
            </div>

            {/* Paystack error banner */}
            {paystackError && (
                <div style={{
                    backgroundColor: "#fff5f5", border: "1px solid #feb2b2",
                    borderRadius: "8px", padding: "10px 14px", marginBottom: "12px",
                    display: "flex", alignItems: "center", gap: "8px",
                }}>
                    <span style={{ color: "#e53e3e", fontSize: "16px" }}>⚠</span>
                    <p style={{ color: "#e53e3e", fontSize: "13px", margin: 0 }}>{paystackError}</p>
                </div>
            )}

            {/* Table */}
            <div className="schedule_table_wrapper">
                <table className="schedule_table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Due Date</th>
                            <th>Amount Due</th>
                            <th>Amount Paid</th>
                            <th>Balance Due</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((item, index) => {
                            const isPayable =
                                item.status === "Pending" ||
                                item.status === "Overdue" ||
                                item.status === "Partial";

                            return (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(item.dueDate)}</td>
                                    <td>{formatAmount(item.amountDue)}</td>
                                    <td>{formatAmount(item.amountPaid)}</td>
                                    <td>{formatAmount(item.balanceDue)}</td>
                                    <td>
                                        <span className={statusStyles[item.status] ?? "schedule_status"}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        {isPayable && (
                                            <div className="schedule_action_buttons">
                                                {isPayableTenant ? (
                                                    /* ── Tenant: pay via Paystack ── */
                                                    <button
                                                        className="schedule_pay_btn paystack_pay_btn"
                                                        onClick={() => handlePayNow(item)}
                                                        disabled={initiatingId === item.id}
                                                        title="Pay securely via Paystack"
                                                    >
                                                        {initiatingId === item.id ? (
                                                            <>
                                                                <span className="paystack_spinner" />
                                                                Redirecting…
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="paystack_badge">P</span>
                                                                Pay Now
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    /* ── Landlord: confirm / reject ── */
                                                    <>
                                                        <button
                                                            className="schedule_pay_btn"
                                                            onClick={() => {
                                                                setSelectedItemId(item.id);
                                                                setOpenApprovalModal(true);
                                                            }}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            className="schedule_reject_btn"
                                                            onClick={() => {
                                                                setSelectedItemId(item.id);
                                                                setOpenRejectModal(true);
                                                            }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Landlord modals only */}
            {!isPayableTenant && (
                <>
                    <ApprovalModal
                        title="Confirm Payment"
                        approvalMessage="Are you sure you want to confirm this tenant payment?"
                        isOpen={openApprovalModal}
                        onClose={() => setOpenApprovalModal(false)}
                        onConfirm={handleApprovalConfirm}
                        label="Confirm Payment"
                        labelAlt="Cancel"
                    />
                    <SuccessModal
                        title="Payment Confirmed"
                        message={successMessage}
                        label="Done"
                        path=""
                        isOpen={openSuccessModal}
                        onClose={() => setOpenSuccessModal(false)}
                        onDone={handleSuccessDone}
                    />
                    <RejectModal
                        title="Reject Payment"
                        message="Please provide a reason for rejecting this payment."
                        label="Reject"
                        isOpen={openRejectModal}
                        onClose={() => { setOpenRejectModal(false); setSelectedItemId(null); }}
                        onConfirm={handleRejectConfirm}
                    />
                    <RejectedModal
                        title="Payment Rejected"
                        message={successMessage}
                        label="Done"
                        path=""
                        isOpen={openRejectedModal}
                        onClose={handleRejectedDone}
                        onDone={handleRejectedDone}
                    />
                </>
            )}
        </>
    );
};

export default ScheduleTable;