import "../Styles/Cards.css"


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
};

const ScheduleTable = ({ schedules = SAMPLE_SCHEDULES }: ScheduleTableProps) => {
    const totalDue     = schedules.reduce((sum, s) => sum + s.amountDue, 0);
    const totalPaid    = schedules.reduce((sum, s) => sum + s.amountPaid, 0);
    const totalBalance = schedules.reduce((sum, s) => sum + s.balanceDue, 0);

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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ScheduleTable;
export type { ScheduleItem };