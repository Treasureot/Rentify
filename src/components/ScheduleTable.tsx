import "../Styles/Cards.css";
import { useState } from "react";
import ApprovalModal from "./ApprovalModal";
import SuccessModal from "./SuccessModal";
import RejectModal from "./RejectModal";
import RejectedModal from "./SuccessModal";

type ScheduleItem = {
    id: string;
    leaseId: string;
    dueDate: string;
    amountDue: number;
    amountPaid: number;
    balanceDue: number;
    status: "Pending" | "Paid" | "Overdue" | "Partial";
    payments: unknown[];
};

const SAMPLE_SCHEDULES: ScheduleItem[] = [
    { id: "1",  leaseId: "101", dueDate: "2026-05-01", amountDue: 150000, amountPaid: 150000, balanceDue: 0,      status: "Paid",    payments: [] },
    { id: "2",  leaseId: "101", dueDate: "2026-06-01", amountDue: 150000, amountPaid: 75000,  balanceDue: 75000,  status: "Partial", payments: [] },
    { id: "3",  leaseId: "101", dueDate: "2026-07-01", amountDue: 150000, amountPaid: 0,      balanceDue: 150000, status: "Overdue", payments: [] },
    { id: "4",  leaseId: "101", dueDate: "2026-08-01", amountDue: 150000, amountPaid: 0,      balanceDue: 150000, status: "Pending", payments: [] },
    { id: "5",  leaseId: "101", dueDate: "2026-09-01", amountDue: 150000, amountPaid: 0,      balanceDue: 150000, status: "Pending", payments: [] },
];

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
    schedules?: ScheduleItem[];
    onPayment?: (item: ScheduleItem) => void;
};

const ScheduleTable = ({
    schedules: initialSchedules = SAMPLE_SCHEDULES,
    onPayment,
}: ScheduleTableProps) => {
    const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [openRejectedModal, setOpenRejectedModal] = useState(false);

    const totalDue     = schedules.reduce((sum, s) => sum + s.amountDue, 0);
    const totalPaid    = schedules.reduce((sum, s) => sum + s.amountPaid, 0);
    const totalBalance = schedules.reduce((sum, s) => sum + s.balanceDue, 0);

    const toggleAction = (id: string) => {
        setOpenActionId((prev) => (prev === id ? null : id));
    };

    const updateStatus = (
        id: string, 
        status: ScheduleItem["status"]) => {
        setSchedules((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;
                if (status === "Paid") {
                    return { ...s, status, amountPaid: s.amountDue, balanceDue: 0 };
                }
                if (status === "Pending") {
                    return { ...s, status, amountPaid: 0, balanceDue: s.amountDue };
                }
                return { ...s, status };
            })
        );
    };

    const handleOpenConfirm = (item: ScheduleItem) => {
        setSelectedItemId(item.id);
        setOpenActionId(null);
        setOpenApprovalModal(true);
    };

    const handleOpenReject = (item: ScheduleItem) => {
        setSelectedItemId(item.id);
        setOpenActionId(null);
        setOpenRejectModal(true);
    };

    const handleApprovalConfirm = () => {
        setOpenApprovalModal(false);
        setOpenSuccessModal(true);
    };

    const handleSuccessDone = () => {
        if (selectedItemId) {
            updateStatus(selectedItemId, "Paid");
            const item = schedules.find((s) => s.id === selectedItemId);
            if (item) onPayment?.(item);
        }
        setOpenSuccessModal(false);
        setSelectedItemId(null);
    };

    const handleRejectConfirm = (reason: string) => {
        console.log("Rejection reason:", reason);
        setOpenRejectModal(false);
        setOpenRejectedModal(true);
    };

    const handleRejectedDone = () => {
        if (selectedItemId) updateStatus(selectedItemId, "Pending");
        setOpenRejectedModal(false);
        setSelectedItemId(null);
    };

    return (
        <>
            <div className="schedule_summary">
                <div className="schedule_summary_item">
                    <span>Total Due</span>
                    <strong>{formatAmount(totalDue)}</strong>
                </div>
                <div className="schedule_summary_paid">
                    <span>Total Paid</span>
                    <strong className="schedule_summary_item--paid">
                        {formatAmount(totalPaid)}
                    </strong>
                </div>
                <div className="schedule_summary_bal">
                    <span>Balance Remaining</span>
                    <strong className="schedule_summary_item--balance">
                        {formatAmount(totalBalance)}
                    </strong>
                </div>
            </div>

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
                        {schedules.map((item, index) => (
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
                                <td className="actions_group">
                                    {(item.status === "Pending" || item.status === "Overdue" || item.status === "Partial") && (
                                        <div className="action_body">
                                            <button
                                                className="action_btn"
                                                onClick={() => toggleAction(item.id)}
                                            >
                                                ⋮
                                            </button>
                                            {openActionId === item.id && (
                                                <div className="dropdown_menu">
                                                    <button onClick={() => handleOpenConfirm(item)}>
                                                        Confirm Payment
                                                    </button>
                                                    <button onClick={() => handleOpenReject(item)}>
                                                        Reject Payment
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ApprovalModal
                title="Confirm Payment"
                approvalMessage="Are you sure you want to confirm this payment?"
                isOpen={openApprovalModal}
                onClose={() => setOpenApprovalModal(false)}
                onConfirm={handleApprovalConfirm}
                label="Proceed"
                labelAlt="Cancel"
            />

            <SuccessModal
                title="Payment Confirmed"
                message="You have successfully confirmed this payment. Tenant notified"
                label="Done"
                path=""
                isOpen={openSuccessModal}
                onClose={() => setOpenSuccessModal(false)}
                onDone={handleSuccessDone}
            />

            <RejectModal
                title="Reject Payment"
                message="Are you sure you want to reject this payment?"
                label="Reject"
                isOpen={openRejectModal}
                onClose={() => setOpenRejectModal(false)}
                onConfirm={handleRejectConfirm}
            />

            <RejectedModal
                title="Payment Rejected"
                message="You have successfully rejected this payment. Tenant notified"
                label="Done"
                path=""
                isOpen={openRejectedModal}
                onClose={handleRejectedDone}
            />
        </>
    );
};

export default ScheduleTable;
export type { ScheduleItem };