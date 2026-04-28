import React, { useState, useEffect, useRef } from "react";
import "../Styles/Cards.css";
import { type Property } from "../components/AddPropertyModal";
import PropertyDetails from "../components/PropertyDetails";

interface PropertyTableProps {
    properties: Property[];
    onDelete: (id: number) => void;
    onEdit: (property: Property) => void;
}

const PropertyTable = ({ properties, onDelete, onEdit }: PropertyTableProps) => {
    const [openActionId, setOpenActionId] = useState<number | null>(null);
    const [detailsProperty, setDetailsProperty] = useState<Property | null>(null);
    const actionRef = useRef<HTMLDivElement>(null);

    const toggleAction = (id: number) => {
        setOpenActionId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
                setOpenActionId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusClass = (status: Property["status"]) => {
        switch (status) {
            case "Approved":         return "approved";
            case "Pending Approval": return "pending_approval";
            case "Pending":          return "pending";
            case "Rejected":         return "rejected";
            default:                 return "";
        }
    };

    return (
        <>
            <div className="table_group">
                <table className="property_table">
                    <thead>
                        <tr>
                            <th style={{ borderRadius: "10px 0px 0px 0px" }}>Title</th>
                            <th>Location</th>
                            <th>Property Type</th>
                            <th>Rent Amount</th>
                            <th>Status</th>
                            <th style={{ borderRadius: "0px 10px 0px 0px" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {properties.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}
                                >
                                    No properties yet. Click "Add New Property" to get started.
                                </td>
                            </tr>
                        ) : (
                            properties.map((property) => (
                                <tr key={property.id}>
                                    <td>{property.title}</td>
                                    <td>{property.location}</td>
                                    <td>{property.type}</td>
                                    <td>{property.rent}</td>
                                    <td>
                                        <span className={`status ${getStatusClass(property.status)}`}>
                                            {property.status}
                                        </span>
                                    </td>

                                    <td className="actions_group">
                                        <div className="action_body" ref={actionRef}>
                                            <button
                                                className="action_btn"
                                                onClick={() => toggleAction(property.id)}
                                            >
                                                ⋮
                                            </button>

                                            {openActionId === property.id && (
                                                <div className="dropdown_menu">
                                                    <button onClick={() => {
                                                        onEdit(property);
                                                        setOpenActionId(null);
                                                    }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => {
                                                        onDelete(property.id);
                                                        setOpenActionId(null);
                                                    }}>
                                                        Delete
                                                    </button>
                                                    <button onClick={() => {
                                                        setDetailsProperty(property);
                                                        setOpenActionId(null);
                                                    }}>
                                                        View Details
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {detailsProperty && (
                <div
                    className="modal_overlay"
                    onClick={() => setDetailsProperty(null)}
                >
                    <div
                        className="property_details_modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PropertyDetails
                            id={detailsProperty.id}
                            image="/default-property.png"
                            title={detailsProperty.title}
                            location={detailsProperty.location}
                            price={detailsProperty.rent}
                            status={detailsProperty.status}
                            type={detailsProperty.type}
                            beds={0}
                            baths={0}
                            onViewDetails={() => setDetailsProperty(null)}
                            onEdit={() => {
                                onEdit(detailsProperty);
                                setDetailsProperty(null);
                            }}
                            onDelete={(id) => {
                                onDelete(id);
                                setDetailsProperty(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyTable;