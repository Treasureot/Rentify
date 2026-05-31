import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TenantHeader from "../../components/TenantHeader";
import TenantSidebar from "../../components/TenantSidebar";
import LeaseRequestModal from "../../components/LeaseRequestModal";
import { FaBed, FaBath } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../Styles/Tenant.css";
import Button from "../../components/Button";
import SuccessModal from "../../components/SuccessModal";

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
    rejectionReason: string | null;
    primaryImageUrl: string;
    createdDate: string;
    landlord: PropertyLandlord;
    images: PropertyImage[];
};

const formatCurrency = (amount: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const parseDetail = (description: string, key: string): number => {
    const match = description?.match(new RegExp(`${key}:(\\d+)`));
    return match ? parseInt(match[1]) : 0;
};

const ImageCarousel = ({ images, title }: { images: PropertyImage[]; title: string }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="carousel__main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                No images available
            </div>
        );
    }

    const goPrev = () =>
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    const goNext = () =>
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div className="carousel">
            <div className="carousel__main">
                <img
                    src={images[activeIndex].imageUrl}
                    alt={`${title} — image ${activeIndex + 1}`}
                    className="carousel__main-img"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-property.png";
                    }}
                />
                {images.length > 1 && (
                    <>
                        <button
                            className="carousel__arrow carousel__arrow--prev"
                            onClick={goPrev}
                            aria-label="Previous image"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <button
                            className="carousel__arrow carousel__arrow--next"
                            onClick={goNext}
                            aria-label="Next image"
                        >
                            <FiChevronRight size={20} />
                        </button>
                        <span className="carousel__counter">
                            {activeIndex + 1} / {images.length}
                        </span>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="carousel__thumbnails">
                    {images.map((img, index) => (
                        <button
                            key={img.id}
                            className={`carousel__thumb ${index === activeIndex ? "carousel__thumb--active" : ""}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`View image ${index + 1}`}
                        >
                            <img
                                src={img.imageUrl}
                                alt={`Thumbnail ${index + 1}`}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/default-property.png";
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const PropertyDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const token     = localStorage.getItem("accessToken") || "";
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";

    const [property, setProperty]             = useState<PropertyDetail | null>(null);
    const [isLoading, setIsLoading]           = useState(true);
    const [error, setError]                   = useState("");
    const [isLeaseModalOpen, setIsLeaseModalOpen]     = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

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

    const handleLeaseSubmitSuccess = () => {
        setIsLeaseModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    return (
        <div className="tenant">
            <div className="tenant_top">
                <TenantHeader firstName={firstName} lastName={lastName} />
            </div>

            <div className="tenant_bottom">
                <div className="tenant_sidebar">
                    <TenantSidebar />
                </div>

                <div className="tenant_body_right">
                    <button
                        className="property-details__back"
                        onClick={() => navigate(-1)}
                    >
                        &#8592; Back to listings
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
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ color: '#e53e3e', fontSize: '18px' }}>⚠</span>
                            <p style={{ color: '#e53e3e', fontSize: '14px', margin: 0 }}>{error}</p>
                        </div>
                    ) : property ? (
                        <div className="property-details__layout">
                            <div className="property-details">
                                <ImageCarousel images={property.images} title={property.title} />

                                <h2 className="property-details__title">{property.title}</h2>
                                <p className="property-details__price">
                                    {formatCurrency(property.rentAmount)} <span>/year</span>
                                </p>
                                <p className="property-details__location">
                                    <MdLocationOn size={16} /> {property.location}
                                </p>
                                {property.address && (
                                    <p className="property-details__location" style={{ marginTop: 4 }}>
                                        <MdLocationOn size={14} /> {property.address}
                                    </p>
                                )}
                                <div className="property-details__meta">
                                    <span>{property.propertyType || "Property"}</span>
                                    <span>{property.occupancyStatus || "—"}</span>
                                    <span>
                                        <FaBed size={14} /> {parseDetail(property.description, "Beds") || "—"} Bed
                                    </span>
                                    <span>
                                        <FaBath size={14} /> {parseDetail(property.description, "Baths") || "—"} Bath
                                    </span>
                                </div>
                                {property.description && (
                                    <p style={{ marginTop: 16, fontSize: 14, color: 'var(--bodytext)', lineHeight: 1.6 }}>
                                        {property.description}
                                    </p>
                                )}
                            </div>

                            <div className="property_landlord">
                                <div className="landlord_info">
                                    <h3>Landlord Information</h3>

                                    <div className="landlord_group">
                                        <p className="landlord_label">Name</p>
                                        <p className="landlord_value">{property.landlord.fullName}</p>
                                    </div>

                                    <div className="landlord_group">
                                        <p className="landlord_label">Email</p>
                                        <p className="landlord_value">{property.landlord.email}</p>
                                    </div>

                                    {property.landlord.phoneNumber && (
                                        <div className="landlord_group">
                                            <p className="landlord_label">Phone Number</p>
                                            <p className="landlord_value">{property.landlord.phoneNumber}</p>
                                        </div>
                                    )}
                                </div>

                                {property.occupancyStatus !== "Occupied" && (
                                    <Button
                                        label="Request Lease"
                                        onClick={() => setIsLeaseModalOpen(true)}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="property-details__not-found">
                            <h2>Property not found</h2>
                            <p>This listing may have been removed or the link is invalid.</p>
                            <button
                                className="property-details__back"
                                onClick={() => navigate("/tenant")}
                            >
                                Return to listings
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <LeaseRequestModal
                isOpen={isLeaseModalOpen}
                onClose={() => setIsLeaseModalOpen(false)}
                onSuccess={handleLeaseSubmitSuccess}
                propertyTitle={property?.title}
                propertyId={property?.id}
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                title="Lease Request Sent!"
                label="Done"
                message="Your lease request has been successfully sent to the landlord. You will receive a response within 24-48 hours."
                onClose={() => setIsSuccessModalOpen(false)}
                path="/tenant-lease"
            />
        </div>
    );
};

export default PropertyDetailsPage;