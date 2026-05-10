import "../Styles/PropertyCard.css";
import "../styles/Cards.css";
import { MdLocationOn } from "react-icons/md";
import { FaNairaSign } from "react-icons/fa6";
import ButtonAlt from "./ButtonAlt";
import Button from "./Button";
import LeaseModal from "./LeaseModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { LeaseData } from "./LeaseCard";

type PaymentCardProps = {
  id: number;
  leaseId: number;
  status: string;
  propertyRentAmount: string;
  period?: string;
  propertyTitle: string;
  PropertyAddress: string;
  tenantName: string;
  tenantPhone: string;
  startDate: string;
  endDate: string;
  pendingLease?: LeaseData;
  onLeaseUpdated?: (updated: LeaseData) => void;
};

const PaymentCard = ({
  leaseId,
  status = "Active",
  propertyRentAmount,
  period = "year",
  propertyTitle,
  PropertyAddress,
  tenantName,
  tenantPhone,
  startDate,
  endDate,
  pendingLease,
  onLeaseUpdated,
}: PaymentCardProps) => {
  const navigate = useNavigate();
  const [openLeaseModal, setOpenLeaseModal] = useState(false);
  const [leaseData, setLeaseData] = useState<LeaseData | null>(pendingLease ?? null);

  const handleSave = (updated: LeaseData) => {
    setLeaseData(updated);
    onLeaseUpdated?.(updated);
    setOpenLeaseModal(false);
  };

  const displayData = {
    propertyRentAmount: leaseData?.propertyRentAmount ?? propertyRentAmount,
    period: leaseData?.period ?? period,
    propertyTitle: leaseData?.propertyTitle ?? propertyTitle,
    PropertyAddress: leaseData?.PropertyAddress ?? PropertyAddress,
    tenantName: leaseData?.tenantName ?? tenantName,
    tenantPhone: leaseData?.tenantPhone ?? tenantPhone,
    startDate: leaseData?.startDate ?? startDate,
    endDate: leaseData?.endDate ?? endDate,
  };

  return (
    <div className="payment-card">
      <div className="property-content">
        <span className="lease-status">● {status}</span>

        <div className="lease-price">
          <FaNairaSign size={20} />
          <h4>{displayData.propertyRentAmount}</h4>
          <span className="property-period">/ {displayData.period}</span>
        </div>

        <div className="property-title">{displayData.propertyTitle}</div>

        <div className="property-location">
          <MdLocationOn size={14} />
          {displayData.PropertyAddress}
        </div>

        <div className="divider"></div>

        <div className="property-tenant">
          <div className="tenant-details">
            <p>Tenant:</p>
            <h4>{displayData.tenantName}</h4>
          </div>
          <div className="tenant-details">
            <p>Phone:</p>
            <h4>{displayData.tenantPhone}</h4>
          </div>
        </div>

        <div className="divider"></div>

        <div className="property-period">
          <p>Lease Period:</p>
          <div className="period">
            <h4>{displayData.startDate} - {displayData.endDate}</h4>
          </div>
        </div>

      <div className="modal_actions_card">
        <Button
          label="View Payment Schedule"
          onClick={() => navigate(`/payment-schedule/${leaseId}`)}
        />

        <ButtonAlt
          label="View Lease Schedule"
          onClick={() => setOpenLeaseModal(true)}
        />
      </div>
      </div>

      {leaseData && (
        <LeaseModal
          isOpen={openLeaseModal}
          lease={leaseData}
          onClose={() => setOpenLeaseModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PaymentCard;