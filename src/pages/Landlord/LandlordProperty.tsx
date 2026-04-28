import "../../Styles/Landlord.css";
import LandlordSidebar from "../../components/LandlordSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import Button from "../../components/Button";
import PropertyTable from "../../components/PropertyTable";
import AddPropertyModal, { type Property } from "../../components/AddPropertyModal";
import React, { useState } from "react";

const initialProperties: Property[] = [
    {
        id: 1,
        title: "3 Bedroom Duplex",
        location: "Ajah, Lagos",
        type: "Shop",
        rent: "₦2,000,000/year",
        status: "Pending Approval",
        occupancystatus: "Occupied"
    },
    {
        id: 2,
        title: "3 Bedroom Duplex",
        location: "Ajah, Lagos",
        type: "Apartment",
        rent: "₦2,000,000/year",
        status: "Approved",
        occupancystatus: "Vacant"
    },
];

const LandlordProperty = () => {
    const [openModal, setOpenModal] = useState(false);
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    const handleSaveProperty = (property: Property) => {
        setProperties((prev) => {
            const exists = prev.find((p) => p.id === property.id);
            if (exists) {
                return prev.map((p) => (p.id === property.id ? property : p));
            }
            return [...prev, property];
        });

        setOpenModal(false);
        setSelectedProperty(null);
    };

    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm("Are you sure?");
        if (!confirmDelete) return;
        setProperties((prev) => prev.filter((p) => p.id !== id));
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
                    <DashboardHeader firstName="Tunde" lastName="Omoniyi" />
                </div>

                <div className="landlord_body">
                    <div className="landlord_property_header">
                        <div className="landlord_property_header_left">
                            <h3>My Properties</h3>
                            <p>Manage and view all your properties</p>
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
                        <PropertyTable
                            properties={properties}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    </div>

                    <AddPropertyModal
                        isOpen={openModal}
                        onClose={() => {
                            setOpenModal(false);
                            setSelectedProperty(null);
                        }}
                        property={selectedProperty}
                        onAdd={handleSaveProperty}
                    />
                </div>
            </div>
        </div>
    );
};

export default LandlordProperty;