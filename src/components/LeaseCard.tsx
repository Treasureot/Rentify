import "../Styles/PropertyCard.css";
import "../styles/Cards.css";
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

export type LeaseData = {
  leaseId: number;
  tenantName: string;
  tenantPhone: string;
  propertyTitle: string;
  PropertyAddress: string;
  propertyRentAmount: string;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
};

type LeaseCardProps = {
  id: number;
  leaseId: number;
  status: string;
  propertyRentAmount: string;
  period?: string;
  propertyTitle: string;
  PropertyAddress: string;
  tenantId: number;
  tenantEmail?: string;
  tenantName: string;
  tenantPhone: string;
  message: string;
  createdDate: string;
  onDelete?: (leaseId: number) => void;
  onLeaseCreated?: () => void;
};

const LeaseCard = ({
  id,
  leaseId,
  status = "Pending",
  propertyRentAmount,
  period = "year",
  propertyTitle,
  PropertyAddress,
  tenantId,
  tenantName,
  tenantPhone,
  message,
  createdDate,
  onDelete,
  onLeaseCreated,
}: LeaseCardProps) => {
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openRejectedModal, setOpenRejectedModal] = useState(false);
  const [openCreateLeaseModal, setOpenCreateLeaseModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleApprovalConfirm = () => {
    setOpenApprovalModal(false);
    setOpenSuccessModal(true);
  };

  const handleSuccessDone = () => {
    setOpenSuccessModal(false);
    setIsApproved(true);
  };

  const handleRejectConfirm = (reason: string) => {
    console.log("Rejection reason:", reason);
    setOpenRejectModal(false);
    setOpenRejectedModal(true);
  };

  const handleRejectedDone = () => {
    setOpenRejectedModal(false);
    setIsVisible(false);
    onDelete?.(leaseId);
  };

  const handleCreateLease = () => {
    onLeaseCreated?.();
    setOpenCreateLeaseModal(false);
  };

  if (!isVisible) return null;

  return (
    <div className="payment-card">
      <div className="property-content">
        <span className="lease-request-status">● {isApproved ? "Approved" : status}</span>

        <div className="lease-price">
          <FaNairaSign size={20} />
          <h4>{propertyRentAmount}</h4>
          <span className="property-period">/ {period}</span>
        </div>

        <div className="property-title">{propertyTitle}</div>

        <div className="property-location">
          <MdLocationOn size={14} />
          {PropertyAddress}
        </div>

        <div className="divider"></div>

        <div className="property-tenant">
          <div className="tenant-details">
            <p>Tenant:</p>
            <h4>{tenantName}</h4>
          </div>
          <div className="tenant-details">
            <p>Phone:</p>
            <h4>{tenantPhone}</h4>
          </div>
          <div className="tenant-details">
            <p>Date Created:</p>
            <h4>{createdDate}</h4>
          </div>
        </div>

        <div className="divider"></div>

        <div className="message-content">
          <p>Message:</p>
          <div className="message">
            <h4>{message}</h4>
          </div>
        </div>

        <div className="modal_actions">
          {isApproved ? (
            <Button
              label="Create Lease"
              className="btn_create_lease"
              onClick={() => setOpenCreateLeaseModal(true)}
            />
          ) : (
            <>
              <ButtonAlt label="Reject" onClick={() => setOpenRejectModal(true)} />
              <Button label="Approve" onClick={() => setOpenApprovalModal(true)} />
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
        message="You have successfully approved this lease request. Tenant notified"
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
        message="You have successfully rejected this lease request. Tenant notified"
        label="Done"
        path=""
        isOpen={openRejectedModal}
        onClose={handleRejectedDone}
      />

      <CreateLeaseModal
        propertyId={id}
        tenantId={tenantId}
        isOpen={openCreateLeaseModal}
        onClose={() => setOpenCreateLeaseModal(false)}
        onLeaseCreated={handleCreateLease} 
        leaseId={0} 
        startDate={""} 
        endDate={""} 
        rentAmount={""}      
        />
    </div>
  );
};

export default LeaseCard;