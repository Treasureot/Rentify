import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TenantHeader from "../../components/TenantHeader";
import TenantSidebar from "../../components/TenantSidebar";
import LeaseRequestModal from "../../components/LeaseRequestModal";
import { FaBed, FaBath } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import cardImg from "../../assets/images/card-1.png";
import "../../Styles/Tenant.css";
import Button from "../../components/ButtonAlt";
import SuccessModal from "../../components/SuccessModal";

const allProperties = [
    { id: 1,  price: "₦1,200,000", title: "2-Bedroom Apartment in Lekki",        location: "Lekki Phase 1, Lagos",   beds: 2, baths: 2, landlordName: "Mr. Ade Bello",    landlordEmail: "ade.bello@email.com",    landlordPhone: "+234 801 234 5678" },
    { id: 2,  price: "₦850,000",   title: "Self-Contained Studio in Yaba",       location: "Yaba, Lagos",            beds: 1, baths: 1, landlordName: "Mrs. Kemi Osei",   landlordEmail: "kemi.osei@email.com",    landlordPhone: "+234 802 345 6789" },
    { id: 3,  price: "₦2,500,000", title: "3-Bedroom Duplex in Victoria Island", location: "Victoria Island, Lagos", beds: 3, baths: 3, landlordName: "Mr. Tunde Lawal",  landlordEmail: "tunde.lawal@email.com",  landlordPhone: "+234 803 456 7890" },
    { id: 4,  price: "₦950,000",   title: "1-Bedroom Flat in Surulere",          location: "Surulere, Lagos",        beds: 1, baths: 1, landlordName: "Mrs. Ngozi Eze",   landlordEmail: "ngozi.eze@email.com",    landlordPhone: "+234 804 567 8901" },
    { id: 5,  price: "₦1,800,000", title: "3-Bedroom Apartment in Ikoyi",        location: "Ikoyi, Lagos",           beds: 3, baths: 2, landlordName: "Mr. Emeka Okafor", landlordEmail: "emeka.okafor@email.com", landlordPhone: "+234 805 678 9012" },
    { id: 6,  price: "₦700,000",   title: "Self-Contained in Gbagada",           location: "Gbagada, Lagos",         beds: 1, baths: 1, landlordName: "Mrs. Amaka Nwosu", landlordEmail: "amaka.nwosu@email.com",  landlordPhone: "+234 806 789 0123" },
    { id: 7,  price: "₦1,400,000", title: "2-Bedroom Flat in Ajah",              location: "Ajah, Lagos",            beds: 2, baths: 2, landlordName: "Mr. Seun Adeyemi", landlordEmail: "seun.adeyemi@email.com", landlordPhone: "+234 807 890 1234" },
    { id: 8,  price: "₦3,000,000", title: "4-Bedroom Duplex in Banana Island",   location: "Banana Island, Lagos",   beds: 4, baths: 4, landlordName: "Dr. Fola Abiodun", landlordEmail: "fola.abiodun@email.com", landlordPhone: "+234 808 901 2345" },
    { id: 9,  price: "₦600,000",   title: "Mini Flat in Mushin",                 location: "Mushin, Lagos",          beds: 1, baths: 1, landlordName: "Mr. Biodun Salami", landlordEmail: "biodun.salami@email.com", landlordPhone: "+234 809 012 3456" },
    { id: 10, price: "₦1,100,000", title: "2-Bedroom Bungalow in Ikeja",         location: "Ikeja, Lagos",           beds: 2, baths: 1, landlordName: "Mrs. Bisi Fagbemi", landlordEmail: "bisi.fagbemi@email.com",  landlordPhone: "+234 810 123 4567" },
    { id: 11, price: "₦2,200,000", title: "3-Bedroom Terrace in Oniru",          location: "Oniru, Lagos",           beds: 3, baths: 3, landlordName: "Mr. Chidi Obiora",  landlordEmail: "chidi.obiora@email.com",  landlordPhone: "+234 811 234 5678" },
    { id: 12, price: "₦780,000",   title: "1-Bedroom Apartment in Ojota",        location: "Ojota, Lagos",           beds: 1, baths: 1, landlordName: "Mrs. Yetunde Ogun", landlordEmail: "yetunde.ogun@email.com",  landlordPhone: "+234 812 345 6789" },
];

const ImageCarousel = ({ images, title }: { images: string[]; title: string }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const goPrev = () =>
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    const goNext = () =>
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <div className="carousel">
            <div className="carousel__main">
                <img
                    src={images[activeIndex]}
                    alt={`${title} — image ${activeIndex + 1}`}
                    className="carousel__main-img"
                />
                <button
                    className="carousel__arrow carousel__arrow--prev"
                    onClick={goPrev}
                    aria-label="Previous image"
                >
                    &#8249;
                </button>
                <button
                    className="carousel__arrow carousel__arrow--next"
                    onClick={goNext}
                    aria-label="Next image"
                >
                    &#8250;
                </button>
                <span className="carousel__counter">
                    {activeIndex + 1} / {images.length}
                </span>
            </div>

            <div className="carousel__thumbnails">
                {images.map((img, index) => (
                    <button
                        key={index}
                        className={`carousel__thumb ${index === activeIndex ? "carousel__thumb--active" : ""}`}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`View image ${index + 1}`}
                    >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

const PropertyDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const property = allProperties.find((p) => p.id === Number(id));
    const propertyImages = [cardImg, cardImg, cardImg, cardImg, cardImg];

    const handleLeaseSubmitSuccess = () => {
        setIsLeaseModalOpen(false);
        setIsSuccessModalOpen(true);
    };

    return (
        <div className="tenant">
            <div className="tenant_top">
                <TenantHeader
                    firstName="Sarah"
                    lastName="Doe"
                />
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

                    {property ? (
                        <div className="property-details__layout">

                            <div className="property-details">
                                <ImageCarousel images={propertyImages} title={property.title} />

                                <h2 className="property-details__title">{property.title}</h2>
                                <p className="property-details__price">
                                    {property.price} <span>/year</span>
                                </p>
                                <p className="property-details__location">
                                    <MdLocationOn size={16} /> {property.location}
                                </p>
                                <div className="property-details__meta">
                                    <span><FaBed size={14} /> {property.beds} Bed{property.beds > 1 ? "s" : ""}</span>
                                    <span><FaBath size={14} /> {property.baths} Bath{property.baths > 1 ? "s" : ""}</span>
                                </div>
                            </div>


                            <div className="property_landlord">
                                <div className="landlord_info">
                                    <h3>Landlord Information</h3>

                                    <div className="landlord_group">
                                        <p className="landlord_label">Name</p>
                                        <p className="landlord_value">{property.landlordName}</p>
                                    </div>

                                    <div className="landlord_group">
                                        <p className="landlord_label">Email</p>
                                        <p className="landlord_value">{property.landlordEmail}</p>
                                    </div>

                                    <div className="landlord_group">
                                        <p className="landlord_label">Phone Number</p>
                                        <p className="landlord_value">{property.landlordPhone}</p>
                                    </div>
                                </div>

                                <Button
                                    className="btn_primary"
                                    label="Request Lease"
                                    onClick={() => setIsLeaseModalOpen(true)}
                                />
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
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                title="Lease Request Sent!"
                label="Done"
                message="Your lease request has been successfully sent to the landlord. You will receive a response within 24-48 hours."
                onClose={() => setIsSuccessModalOpen(false)}
                path="/tenant"
            />
        </div>
    );
};

export default PropertyDetailsPage;