import "../Styles/PropertyCard.css";
import { MdLocationOn } from "react-icons/md";
import { FiX, FiStar } from "react-icons/fi";
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
    /** Notifies parent when primary image changes */
    onPrimarySet?: (propertyId: string, newPrimaryUrl: string) => void;
};

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-NG", {
        year: "numeric", month: "long", day: "numeric",
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

const PropertyDetails = ({ id, onClose, onDelete, onEdit, onPrimarySet }: PropertyDetailsProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [property, setProperty]     = useState<PropertyDetail | null>(null);
    const [isLoading, setIsLoading]   = useState(true);
    const [error, setError]           = useState("");
    const [activeImage, setActiveImage] = useState<string>("");
    const [settingPrimary, setSettingPrimary] = useState<string | null>(null); 

    // ── Fetch property by ID 
    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true);
            setError("");
            try {
                const res = await fetch(
                    `https://propms-api.fly.dev/api/v1/Properties/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                if (res.ok && data.success) {
                    setProperty(data.data);
                    setActiveImage(data.data.primaryImageUrl || data.data.images?.[0]?.imageUrl || "");
                } else {
                    setError(data.message || "Failed to load property details.");
                }
            } catch {
                setError("No details found at the moment.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperty();
    }, [id, token]);

    // ── Set primary image 
    // POST /Properties/{propertyId}/images/{imageId}/set-primary
    const handleSetPrimary = async (imageId: string, imageUrl: string) => {
        if (settingPrimary) return;
        setSettingPrimary(imageId);
        try {
            const res = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/${id}/images/${imageId}/set-primary`,
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
                
                setProperty((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        primaryImageUrl: imageUrl,
                        images: prev.images.map((img) => ({
                            ...img,
                            isPrimary: img.id === imageId,
                        })),
                    };
                });
                setActiveImage(imageUrl);
                onPrimarySet?.(id, imageUrl);
            } else {
                setError(data.message || "Failed to set primary image.");
            }
        } catch {
            setError("No details found at the moment.");
        } finally {
            setSettingPrimary(null);
        }
    };

    return (
        <div className="property-card" style={{ width: "100%" }}>
            {/* Close button */}
            <button className="property_details_close" onClick={onClose} aria-label="Close details">
                <FiX size={20} />
            </button>

            {isLoading ? (
                <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                    Loading property details…
                </p>
            ) : error ? (
                <div style={{
                    backgroundColor: "#fff5f5", border: "1px solid #feb2b2",
                    borderRadius: "8px", padding: "12px 16px", margin: "16px",
                    display: "flex", alignItems: "center", gap: "8px",
                }}>
                    <span style={{ color: "#e53e3e", fontSize: "18px" }}>⚠</span>
                    <p style={{ color: "#e53e3e", fontSize: "14px", margin: 0 }}>{error}</p>
                </div>
            ) : property && (
                <>
                    {/* Main image */}
                    <div className="property-image-wrapper">
                        <img
                            src={activeImage || "/default-property.png"}
                            alt={property.title}
                            className="property-image"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/default-property.png"; }}
                        />
                        <span className={`property-status status ${getStatusClass(property.status)}`}>
                            ● {property.status}
                        </span>
                        {property.occupancyStatus && (
                            <span className={`status ${getOccupancyClass(property.occupancyStatus)}`}
                                style={{ position: "absolute", top: 12, right: 48 }}>
                                {property.occupancyStatus}
                            </span>
                        )}
                    </div>

                    {/* Image thumbnails with set-primary */}
                    {property.images.length > 0 && (
                        <div style={{ display: "flex", gap: "8px", padding: "8px 16px", overflowX: "auto" }}>
                            {property.images.map((img) => (
                                <div key={img.id} style={{ position: "relative", flexShrink: 0 }}>
                                    <img
                                        src={img.imageUrl}
                                        alt={img.fileName}
                                        onClick={() => setActiveImage(img.imageUrl)}
                                        onError={(e) => { (e.target as HTMLImageElement).src = "/default-property.png"; }}
                                        style={{
                                            width: "64px", height: "64px", objectFit: "cover",
                                            borderRadius: "6px", cursor: "pointer", display: "block",
                                            border: activeImage === img.imageUrl
                                                ? "2px solid var(--primary)"
                                                : "2px solid transparent",
                                        }}
                                    />
                                    {/* Set-primary star button */}
                                    <button
                                        title={img.isPrimary ? "Primary image" : "Set as primary"}
                                        onClick={() => !img.isPrimary && handleSetPrimary(img.id, img.imageUrl)}
                                        disabled={!!settingPrimary || img.isPrimary}
                                        style={{
                                            position: "absolute", top: 2, right: 2,
                                            width: "20px", height: "20px",
                                            borderRadius: "50%", border: "none",
                                            background: img.isPrimary ? "var(--primary)" : "rgba(255,255,255,0.85)",
                                            color: img.isPrimary ? "#fff" : "#94A3B8",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            cursor: img.isPrimary ? "default" : "pointer",
                                            padding: 0,
                                            opacity: settingPrimary === img.id ? 0.5 : 1,
                                            transition: "opacity 0.2s",
                                        }}
                                        aria-label={img.isPrimary ? "Primary image" : "Set as primary image"}
                                    >
                                        <FiStar size={11} />
                                    </button>
                                </div>
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
                                backgroundColor: "#fff5f5", border: "1px solid #feb2b2",
                                borderRadius: "8px", padding: "10px 14px",
                                marginTop: "12px", fontSize: "13px", color: "#e53e3e",
                            }}>
                                <strong>Rejection Reason: </strong>{property.rejectionReason}
                            </div>
                        )}

                        <div className="actions_group" style={{ marginTop: "16px" }}>
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