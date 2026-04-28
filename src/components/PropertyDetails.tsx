import "../Styles/PropertyCard.css";
import { FaBed, FaBath } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FiX } from "react-icons/fi";
import ImageCard from "../assets/images/card-1.png"
import React, { useState, useRef, useEffect } from "react";

type PropertyDetailsProps = {
    image: string;
    id: number;
    status?: string;
    price: string;
    period?: string;
    title: string;
    location: string;
    type?: string;
    beds: number;
    baths: number;
    onViewDetails?: () => void;
    onDelete: (id: number) => void;
    onEdit: () => void;
};

const PropertyDetails = ({
    image,
    id,
    status = "AVAILABLE",
    price,
    period = "year",
    title,
    location,
    type,
    beds,
    baths,
    onViewDetails,
    onDelete,
    onEdit,
}: PropertyDetailsProps) => {
    const [showActions, setShowActions] = useState(false);
    const actionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="property-card">
            <button
                className="property_details_close"
                onClick={onViewDetails}
                aria-label="Close details"
            >
                <FiX size={20} />
            </button>

            <div className="property-image-wrapper">
                <img src={ImageCard} alt={title} className="property-image" />
                <span className="property-status">● {status}</span>
            </div>

            <div className="property-content">

                <div className="property-price">
                    {price} <span className="property-period">/ {period}</span>
                </div>

                <div className="property-title">{title}</div>

                <div className="property-location">
                    <MdLocationOn size={14} />
                    {location}
                </div>

                {type && (
                    <div className="property-type">
                        <span className="property_details_label">Type: </span>
                        {type}
                    </div>
                )}

                <div className="property-row">
                    <div className="property-features">
                        <span><FaBed size={16} /> {beds}</span>
                        <span><FaBath size={16} /> {baths}</span>
                    </div>
                </div>

                <div className="actions_group" ref={actionRef}>
                    <button
                        className="action_btn"
                    >   
                    </button>

                    {showActions && (
                        <div className="dropdown_menu">
                            <button className="btn_secondary" onClick={() => {
                                onDelete(id);
                                setShowActions(false);
                            }}>
                                Delete
                            </button>

                            <button className="btn_primary" onClick={() => {
                                onEdit();
                                setShowActions(false);
                            }}>
                                Edit
                            </button>                            
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PropertyDetails;