import "../Styles/PropertyCard.css";
import { MdLocationOn } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

type PropertyImage = {
    id: string;
    imageUrl: string;
    fileName: string;
    isPrimary: boolean;
};

type PropertyLandlord = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
};

type PropertyDetail = {
    id: string;
    title: string;
    description: string;
    location: string;
    address: string;
    rentAmount: number;
    propertyType: string;
    status: string;
    occupancyStatus: string;
    rejectionReason: string;
    primaryImageUrl: string;
    createdDate: string;
    landlord: PropertyLandlord;
    images: PropertyImage[];
};

type PropertyDetailsProps = {
    id: string;
    onClose: () => void;
    onDelete: (id: string) => void;
    onEdit: () => void;
};

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

const getStatusClass = (status: string) => {
    switch (status) {
        case "Approved":         return "approved";
        case "Pending Approval": return "pending_approval";
        case "Pending":          return "pending";
        case "Rejected":         return "rejected";
        default:                 return "";
    }
};

const getOccupancyClass = (occupancy: string) => {
    switch (occupancy) {
        case "Occupied": return "occupied";
        case "Vacant":   return "vacant";
        default:         return "";
    }
};

const PropertyDetails = ({ id, onClose, onDelete, onEdit }: PropertyDetailsProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [property, setProperty] = useState<PropertyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeImage, setActiveImage] = useState<string>("");

    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true);
            setError("");

            try {
                const request = await fetch(
                    `https://propms-api.fly.dev/api/v1/Properties/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );

                const response = await request.json();

                if (request.ok && response.success) {
                    setProperty(response.data);
                    setActiveImage(response.data.primaryImageUrl || "");
                } else {
                    setError(response.message || "Failed to load property details.");
                }

            } catch {
                setError("Network error. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperty();
    }, [id, token]);

    return (
        <div className="property-card" style={{ width: "100%" }}>
            <button
                className="property_details_close"
                onClick={onClose}
                aria-label="Close details"
            >
                <FiX size={20} />
            </button>

            {isLoading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                    Loading property details...
                </p>
            ) : error ? (
                <div style={{
                    backgroundColor: '#fff5f5',
                    border: '1px solid #feb2b2',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    margin: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ color: '#e53e3e', fontSize: '18px' }}>⚠</span>
                    <p style={{ color: '#e53e3e', fontSize: '14px', margin: 0 }}>{error}</p>
                </div>
            ) : property && (
                <>
                    {/* Main image */}
                    <div className="property-image-wrapper">
                        <img
                            src={activeImage || "/default-property.png"}
                            alt={property.title}
                            className="property-image"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/default-property.png";
                            }}
                        />
                        <span className={`property-status status ${getStatusClass(property.status)}`}>
                            ● {property.status}
                        </span>
                        <span className={`status ${getOccupancyClass(property.occupancyStatus)}`}>
                            {property.occupancyStatus}
                        </span>
                    </div>

                    {/* Image thumbnails */}
                    {property.images.length > 1 && (
                        <div style={{ display: "flex", gap: "8px", padding: "8px 16px", overflowX: "auto" }}>
                            {property.images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.imageUrl}
                                    alt={img.fileName}
                                    onClick={() => setActiveImage(img.imageUrl)}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        border: activeImage === img.imageUrl
                                            ? "2px solid var(--primary)"
                                            : "2px solid transparent",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="property-content">

                        <div className="property-price">
                            {formatCurrency(property.rentAmount)}
                            <span className="property-period"> / year</span>
                        </div>

                        <div className="property-title">{property.title}</div>

                        <div className="property-location">
                            <MdLocationOn size={14} /> {property.location}
                        </div>

                        {property.address && (
                            <div className="property-location" style={{ marginTop: "4px" }}>
                                <MdLocationOn size={14} /> {property.address}
                            </div>
                        )}

                        {property.propertyType && (
                            <div className="property-type">
                                <span className="property_details_label">Type: </span>
                                {property.propertyType}
                            </div>
                        )}

                        {property.description && (
                            <div style={{ marginTop: "8px", fontSize: "14px", color: "var(--bodytext)" }}>
                                <span className="property_details_label">Description: </span>
                                {property.description}
                            </div>
                        )}

                        {/* Landlord info */}
                        <div style={{ marginTop: "12px", fontSize: "14px" }}>
                            <span className="property_details_label">Landlord: </span>
                            {property.landlord.fullName}
                            {property.landlord.phoneNumber && (
                                <span style={{ color: "var(--bodytext)", marginLeft: "8px" }}>
                                    · {property.landlord.phoneNumber}
                                </span>
                            )}
                        </div>

                        <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--bodytext)" }}>
                            <span className="property_details_label">Listed: </span>
                            {formatDate(property.createdDate)}
                        </div>

                        {/* Rejection reason */}
                        {property.status === "Rejected" && property.rejectionReason && (
                            <div style={{
                                backgroundColor: '#fff5f5',
                                border: '1px solid #feb2b2',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                marginTop: '12px',
                                fontSize: '13px',
                                color: '#e53e3e',
                            }}>
                                <strong>Rejection Reason: </strong>{property.rejectionReason}
                            </div>
                        )}

                        <div className="actions_group">
                            <div className="dropdown_menu">
                                <button className="btn_secondary" onClick={() => onDelete(property.id)}>
                                    Delete
                                </button>
                                <button className="btn_primary" onClick={onEdit}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PropertyDetails;