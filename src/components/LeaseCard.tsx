import "../Styles/PropertyCard.css";
import "../Styles/cards.css";
import { MdLocationOn } from "react-icons/md";
import { FaNairaSign } from "react-icons/fa6";
import ButtonAlt from "./ButtonAlt";
import Button from "./Button";
import ApprovalModal from "./ApprovalModal";
import SuccessModal from "./SuccessModal";
import RejectModal from "./RejectModal";
import RejectedModal from "./SuccessModal";
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

    const [currentStatus, setCurrentStatus] = useState(status);
    const [openApprovalModal, setOpenApprovalModal]     = useState(false);
    const [openSuccessModal, setOpenSuccessModal]       = useState(false);
    const [openRejectModal, setOpenRejectModal]         = useState(false);
    const [openRejectedModal, setOpenRejectedModal]     = useState(false);
    const [openCreateLeaseModal, setOpenCreateLeaseModal] = useState(false);
    const [isVisible, setIsVisible]                     = useState(true);
    const [actionError, setActionError]                 = useState('');

    const handleApprovalConfirm = async () => {
        setActionError('');
        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Leases/${id}/approve`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            const response = await request.json();

            if (request.ok && response.success) {
                setOpenApprovalModal(false);
                setOpenSuccessModal(true);
            } else {
                setActionError(response.message || 'Failed to approve lease.');
                setOpenApprovalModal(false);
            }
        } catch {
            setActionError('No details found at the moment.');
            setOpenApprovalModal(false);
        }
    };

    const handleSuccessDone = () => {
        setOpenSuccessModal(false);
        setCurrentStatus("Approved");
        onStatusChange?.(id, "Approved");
    };

    const handleRejectConfirm = async (reason: string) => {
        setActionError('');
        try {
            const request = await fetch(
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
            const response = await request.json();

            if (request.ok && response.success) {
                setOpenRejectModal(false);
                setOpenRejectedModal(true);
            } else {
                setActionError(response.message || 'Failed to reject lease.');
                setOpenRejectModal(false);
            }
        } catch {
            setActionError('No Lease found or No details found at the moment.');
            setOpenRejectModal(false);
        }
    };

    const handleRejectedDone = () => {
        setOpenRejectedModal(false);
        setCurrentStatus("Rejected");
        onStatusChange?.(id, "Rejected");
        setIsVisible(false);
    };

    const handleCreateLease = () => {
        setOpenCreateLeaseModal(false);
    };

    if (!isVisible) return null;

    return (
        <div className="payment-card">
            <div className="property-content">
                <span className="lease-request-status">● {currentStatus}</span>

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

                <div className="divider"></div>

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
                    <p style={{ color: '#e53e3e', fontSize: '13px', marginTop: '8px' }}>
                        ⚠ {actionError}
                    </p>
                )}

                <div className="modal_actions">
                    {currentStatus === "Approved" ? (
                        <Button
                            label="Create Lease"
                            className="btn_create_lease"
                            onClick={() => setOpenCreateLeaseModal(true)}
                        />
                    ) : currentStatus === "Rejected" ? (
                        <p style={{ color: '#94A3B8', fontSize: '13px' }}>
                            This lease request has been rejected.
                        </p>
                    ) : (
                        <>
                            <ButtonAlt label="Reject"  onClick={() => setOpenRejectModal(true)} />
                            <Button    label="Approve" onClick={() => setOpenApprovalModal(true)} />
                        </>
                    )}
                </div>
            </div>

            <ApprovalModal
                title="Approve Lease Request"
                approvalMessage="Are you sure you want to approve this lease request?"
                isOpen={openApprovalModal}
                onClose={() => setOpenApprovalModal(false)}
                onConfirm={handleApprovalConfirm}
                label="Approve Request"
                labelAlt="Cancel"
            />

            <SuccessModal
                title="Approved Successfully"
                message="You have successfully approved this lease request. Tenant notified."
                label="Done"
                path=""
                isOpen={openSuccessModal}
                onClose={() => setOpenSuccessModal(false)}
                onDone={handleSuccessDone}
            />

            <RejectModal
                title="Reject Lease Request"
                message="Are you sure you want to reject this lease request?"
                label="Reject"
                isOpen={openRejectModal}
                onClose={() => setOpenRejectModal(false)}
                onConfirm={handleRejectConfirm}
            />

            <RejectedModal
                title="Rejected Successfully"
                message="You have successfully rejected this lease request. Tenant notified."
                label="Done"
                path=""
                isOpen={openRejectedModal}
                onClose={handleRejectedDone}
            />

            <CreateLeaseModal
                propertyId={propertyId}
                tenantId={tenantId}
                isOpen={openCreateLeaseModal}
                onClose={() => setOpenCreateLeaseModal(false)}
                onLeaseCreated={handleCreateLease}
                leaseId={id}
                startDate={startDate}
                endDate={endDate}
                rentAmount={rentAmount.toString()}
            />
        </div>
    );
};

export default LeaseCard;