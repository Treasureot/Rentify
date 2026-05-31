import { useState, useEffect } from "react";
import "../../Styles/Landlord.css";
import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import Button from "../../components/Button";
import PropertyTable from "../../components/PropertyTable";
import AddPropertyModal from "../../components/AddPropertyModal";

export type Property = {
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
    landlord: {
        id: string;
        fullName: string;
        email: string;
        phoneNumber: string;
    };
    images: {
        id: string;
        imageUrl: string;
        fileName: string;
        isPrimary: boolean;
    }[];
};

const LandlordProperty = () => {
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName")  || "";
    const token     = localStorage.getItem("accessToken") || "";

    const [properties, setProperties]             = useState<Property[]>([]);
    const [isLoading, setIsLoading]               = useState(true);
    const [error, setError]                       = useState("");
    const [openModal, setOpenModal]               = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const fetchProperties = async () => {
        setIsLoading(true);
        setError("");

        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/my-properties`, 
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
                setProperties(response.data);  
            } else {
                setError(response.message || "Failed to load properties.");
            }

        } catch {
            setError("No Property Available. Please add a property to get started.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [token]);

    const handleSaveProperty = (property: Property) => {
        setProperties((prev) => {
            const exists = prev.find((p) => p.id === property.id);
            if (exists) return prev.map((p) => (p.id === property.id ? property : p));
            return [...prev, property];
        });
        setOpenModal(false);
        setSelectedProperty(null);
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this property?");
        if (!confirmDelete) return;

        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Properties/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                setProperties((prev) => prev.filter((p) => p.id !== id));
            } else {
                setError(response.message || "Failed to delete property.");
            }
        } catch {
            setError("Network error. Please check your connection.");
        }
    };

    const handleEdit = (property: Property) => {
        setSelectedProperty(property);
        setOpenModal(true);
    };

    return (
        <div className="landlord">
            <div className="landlord_body_left">
                <LandlordSidebar />
            </div>

            <div className="landlord_body_right">
                <div className="landlord_dashboard_header">
                    <DashboardHeader
                        firstName={firstName}
                        lastName={lastName}
                    />
                </div>

                <div className="landlord_body">
                    <div className="landlord_property_header">
                        <div className="landlord_property_header_left">
                            <h3>My Properties</h3>
                            <p>Manage and view all your properties.</p>
                        </div>

                        <div className="landlord_property_header_right">
                            <Button
                                label="Add New Property"
                                onClick={() => {
                                    setSelectedProperty(null);
                                    setOpenModal(true);
                                }}
                            />
                        </div>
                    </div>

                    <div className="landlord_property_content">
                        {isLoading ? (
                            <p style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                                Loading properties...
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
                        ) : (
                            <PropertyTable
                                properties={properties}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        )}
                    </div>

                    <AddPropertyModal
                        isOpen={openModal}
                        onClose={() => {
                            setOpenModal(false);
                            setSelectedProperty(null);
                        }}
                        property={selectedProperty}
                        onAdd={handleSaveProperty}
                        onRefresh={fetchProperties}
                    />
                </div>
            </div>
        </div>
    );
};

export default LandlordProperty;