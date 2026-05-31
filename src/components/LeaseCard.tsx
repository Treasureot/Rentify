import "../Styles/PropertyCard.css";
import "../Styles/Cards.css";
import { MdLocationOn } from "react-icons/md";
import { FaNairaSign } from "react-icons/fa6";
import ButtonAlt from "./ButtonAlt";
import Button from "./Button";
import ApprovalModal from "./ApprovalModal";
import SuccessModal from "./SuccessModal";
import RejectModal from "./RejectModal";
import CreateLeaseModal from "./CreateLeaseModal";
import { useState } from "react";

type LeaseCardProps = {
    id: string;
    propertyId: string;
    propertyTitle: string;
    propertyAddress: string;
    tenantId: string;
    tenantName: string;
    tenantEmail: string;
    startDate: string;
    endDate: string;
    rentAmount: number;
    status: string;
    createdDate: string;
    onStatusChange?: (id: string, newStatus: string) => void;
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG").format(amount);

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

/** Map a status string to its pill colour class */
const statusClass = (s: string) => {
    switch (s) {
        case "Active":     return "lease-request-status lease-request-status--active";
        case "Approved":   return "lease-request-status lease-request-status--approved";
        case "Rejected":   return "lease-request-status lease-request-status--rejected";
        case "Terminated": return "lease-request-status lease-request-status--terminated";
        default:           return "lease-request-status"; // Pending — amber (existing default)
    }
};

const LeaseCard = ({
    id,
    propertyId,
    propertyTitle,
    propertyAddress,
    tenantId,
    tenantName,
    tenantEmail,
    startDate,
    endDate,
    rentAmount,
    status,
    createdDate,
    onStatusChange,
}: LeaseCardProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [currentStatus, setCurrentStatus]             = useState(status);
    const [openApprovalModal, setOpenApprovalModal]     = useState(false);
    const [openSuccessModal, setOpenSuccessModal]       = useState(false);
    const [openRejectModal, setOpenRejectModal]         = useState(false);
    const [openRejectSuccessModal, setOpenRejectSuccessModal] = useState(false);
    const [openCreateLeaseModal, setOpenCreateLeaseModal]     = useState(false);
    // terminate
    const [openTerminateModal, setOpenTerminateModal]         = useState(false);
    const [openTerminateSuccessModal, setOpenTerminateSuccessModal] = useState(false);

    const [isVisible, setIsVisible]   = useState(true);
    const [actionError, setActionError] = useState("");
    const [successMsg, setSuccessMsg]   = useState("");

    // ── Approve ───────────────────────────────────────────
    const handleApprovalConfirm = async () => {
        setActionError("");
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Leases/${id}/approve`,
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
                setOpenApprovalModal(false);
                setSuccessMsg("You have successfully approved this lease request. Tenant notified.");
                setOpenSuccessModal(true);
            } else {
                setActionError(data.message || "Failed to approve lease.");
                setOpenApprovalModal(false);
            }
        } catch {
            setActionError("Network error. Please check your connection.");
            setOpenApprovalModal(false);
        }
    };

    const handleApproveDone = () => {
        setOpenSuccessModal(false);
        setCurrentStatus("Approved");
        onStatusChange?.(id, "Approved");
    };

    // ── Reject ────────────────────────────────────────────
    const handleRejectConfirm = async (reason: string) => {
        setActionError("");
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Leases/${id}/reject`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ reason }),
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setOpenRejectModal(false);
                setSuccessMsg("You have successfully rejected this lease request. Tenant notified.");
                setOpenRejectSuccessModal(true);
            } else {
                setActionError(data.message || "Failed to reject lease.");
                setOpenRejectModal(false);
            }
        } catch {
            setActionError("Network error. Please check your connection.");
            setOpenRejectModal(false);
        }
    };

    const handleRejectDone = () => {
        setOpenRejectSuccessModal(false);
        setCurrentStatus("Rejected");
        onStatusChange?.(id, "Rejected");
        // Hide rejected cards after a beat so the list stays clean
        setIsVisible(false);
    };

    // ── Create Lease (Approved → Active) ──────────────────
    const handleLeaseCreated = () => {
        setOpenCreateLeaseModal(false);
        setCurrentStatus("Active");
        onStatusChange?.(id, "Active");
    };

    // ── Terminate (Active → Terminated) ──────────────────
    const handleTerminateConfirm = async () => {
        setActionError("");
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Leases/${id}/terminate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            if (res.ok && data.success) {
                setOpenTerminateModal(false);
                setSuccessMsg(data.message || "Lease has been terminated successfully. Tenant notified.");
                setOpenTerminateSuccessModal(true);
            } else {
                setActionError(data.message || "Failed to terminate lease.");
                setOpenTerminateModal(false);
            }
        } catch {
            setActionError("Network error. Please check your connection.");
            setOpenTerminateModal(false);
        }
    };

    const handleTerminateDone = () => {
        setOpenTerminateSuccessModal(false);
        setCurrentStatus("Terminated");
        onStatusChange?.(id, "Terminated");
    };

    if (!isVisible) return null;

    return (
        <div className="payment-card">
            <div className="property-content">
                <span className={statusClass(currentStatus)}>● {currentStatus}</span>

                <div className="lease-price">
                    <FaNairaSign size={20} />
                    <h4>{formatCurrency(rentAmount)}</h4>
                    <span className="property-period">/ year</span>
                </div>

                <div className="property-title">{propertyTitle}</div>

                <div className="property-location">
                    <MdLocationOn size={14} />
                    {propertyAddress}
                </div>

                <div className="divider" />

                <div className="property-tenant">
                    <div className="tenant-details">
                        <p>Tenant:</p>
                        <h4>{tenantName}</h4>
                    </div>
                    <div className="tenant-details">
                        <p>Email:</p>
                        <h4>{tenantEmail}</h4>
                    </div>
                    <div className="tenant-details">
                        <p>Start Date:</p>
                        <h4>{formatDate(startDate)}</h4>
                    </div>
                    <div className="tenant-details">
                        <p>End Date:</p>
                        <h4>{formatDate(endDate)}</h4>
                    </div>
                    <div className="tenant-details">
                        <p>Date Created:</p>
                        <h4>{formatDate(createdDate)}</h4>
                    </div>
                </div>

                {actionError && (
                    <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "8px" }}>
                        ⚠ {actionError}
                    </p>
                )}

                {/* ── Action area ── */}
                <div className="modal_actions" style={{ marginTop: "16px" }}>

                    {/* Pending — approve / reject */}
                    {currentStatus === "Pending" && (
                        <>
                            <ButtonAlt label="Reject"  onClick={() => setOpenRejectModal(true)} />
                            <Button    label="Approve" onClick={() => setOpenApprovalModal(true)} />
                        </>
                    )}

                    {/* Approved — create formal lease */}
                    {currentStatus === "Approved" && (
                        <Button
                            label="Create Lease"
                            className="btn_create_lease"
                            onClick={() => setOpenCreateLeaseModal(true)}
                        />
                    )}

                    {/* Active — terminate */}
                    {currentStatus === "Active" && (
                        <ButtonAlt
                            label="Terminate Lease"
                            onClick={() => setOpenTerminateModal(true)}
                        />
                    )}

                    {/* Rejected */}
                    {currentStatus === "Rejected" && (
                        <p style={{ color: "#94A3B8", fontSize: "13px" }}>
                            This lease request has been rejected.
                        </p>
                    )}

                    {/* Terminated */}
                    {currentStatus === "Terminated" && (
                        <p style={{ color: "#94A3B8", fontSize: "13px" }}>
                            This lease has been terminated.
                        </p>
                    )}
                </div>
            </div>

            {/* ── Modals ── */}

            <ApprovalModal
                title="Approve Lease Request"
                approvalMessage="Are you sure you want to approve this lease request?"
                isOpen={openApprovalModal}
                onClose={() => setOpenApprovalModal(false)}
                onConfirm={handleApprovalConfirm}
                label="Approve"
                labelAlt="Cancel"
            />

            <SuccessModal
                title="Approved Successfully"
                message={successMsg}
                label="Done"
                path=""
                isOpen={openSuccessModal}
                onClose={handleApproveDone}
                onDone={handleApproveDone}
            />

            <RejectModal
                title="Reject Lease Request"
                message="Please provide a reason for rejecting this lease request."
                label="Reject"
                isOpen={openRejectModal}
                onClose={() => setOpenRejectModal(false)}
                onConfirm={handleRejectConfirm}
            />

            <SuccessModal
                title="Rejected Successfully"
                message={successMsg}
                label="Done"
                path=""
                isOpen={openRejectSuccessModal}
                onClose={handleRejectDone}
                onDone={handleRejectDone}
            />

            <CreateLeaseModal
                propertyId={propertyId}
                tenantId={tenantId}
                isOpen={openCreateLeaseModal}
                onClose={() => setOpenCreateLeaseModal(false)}
                onLeaseCreated={handleLeaseCreated}
                leaseId={id}
                startDate={startDate}
                endDate={endDate}
                rentAmount={rentAmount.toString()}
            />

            {/* Terminate confirm */}
            <ApprovalModal
                title="Terminate Lease"
                approvalMessage="Are you sure you want to terminate this lease? This action cannot be undone and the tenant will be notified."
                isOpen={openTerminateModal}
                onClose={() => setOpenTerminateModal(false)}
                onConfirm={handleTerminateConfirm}
                label="Terminate"
                labelAlt="Cancel"
            />

            <SuccessModal
                title="Lease Terminated"
                message={successMsg}
                label="Done"
                path=""
                isOpen={openTerminateSuccessModal}
                onClose={handleTerminateDone}
                onDone={handleTerminateDone}
            />
        </div>
    );
};

export default LeaseCard;