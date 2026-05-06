import "../Styles/PropertyCard.css";
import { MdLocationOn } from "react-icons/md";
import { FaNairaSign } from "react-icons/fa6";
import ButtonAlt from "./ButtonAlt";
import { useNavigate } from "react-router-dom";

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
}: PaymentCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="payment-card">
      <div className="property-content">
        <span className="lease-status">● {status}</span>

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
        </div>

        <div className="divider"></div>

        <div className="property-period">
          <p>Lease Period:</p>
          <div className="period">
            <h4>{startDate} - {endDate}</h4>
          </div>
        </div>

        <ButtonAlt
          label="View Payment Schedule"
          onClick={() => navigate(`/payment-schedule/${leaseId}`)}
        />
      </div>
    </div>
  );
};

export default PaymentCard;