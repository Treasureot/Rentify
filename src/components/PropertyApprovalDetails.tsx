import "../Styles/PropertyCard.css";
import { MdLocationOn } from "react-icons/md";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState } from "react";
import { type PropertyItem } from "./PropertyApprovalTable";

type PropertyApprovalDetailsProps = {
    property: PropertyItem;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
};

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
        year:  "numeric",
        month: "long",
        day:   "numeric",
    });

const getStatusClass = (status: string) => {
    switch (status) {
        case "Approved": return "property_status property_status--approved";
        case "Rejected": return "property_status property_status--rejected";
        default:         return "property_status property_status--pending";
    }
};

const PropertyApprovalDetails = ({
    property,
    onClose,
    onApprove,
    onReject,
}: PropertyApprovalDetailsProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = property.images ?? [];
    const hasImages = images.length > 0;

    const goToPrev = () =>
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    const goToNext = () =>
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div className="property-card" style={{ width: "100%" }}>
            <button
                className="property_details_close"
                onClick={onClose}
                aria-label="Close details"
            >
                <FiX size={20} />
            </button>

            {/* Image carousel */}
            <div className="property-image-wrapper">
                {hasImages ? (
                    <img
                        src={images[currentIndex].imageUrl}
                        alt={images[currentIndex].fileName || property.title}
                        className="property-image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/default-property.png";
                        }}
                    />
                ) : (
                    <div className="property-image property-image--placeholder">
                        No images uploaded
                    </div>
                )}

                <span className={getStatusClass(property.status)}>
                    ● {property.status}
                </span>

                {images.length > 1 && (
                    <>
                        <button
                            className="carousel-btn carousel-btn--prev"
                            onClick={goToPrev}
                            aria-label="Previous image"
                        >
                            <FiChevronLeft size={20} />
                        </button>

                        <button
                            className="carousel-btn carousel-btn--next"
                            onClick={goToNext}
                            aria-label="Next image"
                        >
                            <FiChevronRight size={20} />
                        </button>

                        <div className="carousel-dots">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    className={`carousel-dot${i === currentIndex ? " carousel-dot--active" : ""}`}
                                    onClick={() => setCurrentIndex(i)}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="property-content">
                <div className="property-price">
                    {formatCurrency(property.rentAmount)}
                    <span className="property-period"> / year</span>
                </div>

                <div className="property-title">{property.title}</div>

                <div className="property-location">
                    <MdLocationOn size={16} /> {property.location}
                </div>

                {property.address && (
                    <div className="property-location" style={{ marginTop: "4px" }}>
                        <MdLocationOn size={14} /> {property.address}
                    </div>
                )}

                {property.description && (
                    <p style={{ fontSize: "13px", color: "var(--bodytext)", marginTop: "8px" }}>
                        {property.description}
                    </p>
                )}

                <div className="divider" />

                <div className="property-group">
                    <span>Property Type:</span>
                    <span>{property.propertyType || "—"}</span>
                </div>

                <div className="property-group">
                    <span>Occupancy:</span>
                    <span>{property.occupancyStatus || "—"}</span>
                </div>

                <div className="property-group">
                    <span>Submitted By:</span>
                    <span>{property.landlord.fullName}</span>
                </div>

                <div className="property-group">
                    <span>Landlord Email:</span>
                    <span>{property.landlord.email}</span>
                </div>

                <div className="property-group">
                    <span>Landlord Phone:</span>
                    <span>{property.landlord.phoneNumber || "—"}</span>
                </div>

                <div className="property-group">
                    <span>Date Submitted:</span>
                    <span>{formatDate(property.createdDate)}</span>
                </div>


                {property.status === "Rejected" && property.rejectionReason && (
                    <div style={{
                        backgroundColor: '#fff5f5',
                        border: '1px solid #feb2b2',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        marginTop: '10px',
                        fontSize: '13px',
                        color: '#e53e3e',
                    }}>
                        <strong>Rejection Reason: </strong>{property.rejectionReason}
                    </div>
                )}

                <div className="divider" />


                {property.status === "Pending" && (
                    <div className="actions_group">
                        <div className="dropdown_menu">
                            <button className="btn_secondary" onClick={() => onReject(property.id)}>
                                Reject
                            </button>
                            <button className="btn_primary" onClick={() => onApprove(property.id)}>
                                Approve
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyApprovalDetails;