import "../Styles/Cards.css";
import Input from "../components/Input";
import Button from "../components/Button";
import ButtonAlt from "../components/ButtonAlt";
import React, { useState, useEffect, useCallback } from "react";


export interface Property {
    id: number;
    title: string;
    location: string;
    type: string;
    rent: string;
    status: "Pending Approval" | "Approved" | "Pending" | "Rejected";
    occupancystatus: "Occupied" | "Vacant";
}

interface AddPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (property: Property) => void;
    property?: Property | null;
}

function AddPropertyModal({ isOpen, onClose, onAdd, property }: AddPropertyModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [rent, setRent] = useState("");
    const [type, setType] = useState("");
    const [images, setImages] = useState<File[]>([]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setLocation("");
        setRent("");
        setType("");
        setImages([]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newProperty: Property = {
            id: property?.id ?? Date.now(),
            title,
            location,
            type,
            rent: `₦${Number(rent).toLocaleString()}/year`,
            status: property?.status ?? "Pending Approval",
            occupancystatus: property?.occupancystatus ?? "Vacant",
        };

        resetForm();
        onClose();
        onAdd(newProperty);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleEsc = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose?.();
        },
        [onClose]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [handleEsc]);

    if (!isOpen) return null;

    return (
        <div className="modal_overlay" onClick={onClose}>
            <div className="add_modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal_header">
                    <h3>{property ? "Edit Property" : "Add Property"}</h3>
                </div>

                <div className="modal_body">
                    <form className="modal_form" onSubmit={handleSubmit}>

                        <Input
                            label="Property Title"
                            type="text"
                            placeholder="e.g Mini Flat in Yaba"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <div className="input_group">
                            <label>Description</label>
                            <textarea
                                placeholder="Write here"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input_body">
                            <Input
                                label="Location"
                                type="text"
                                placeholder="e.g Yaba, Lagos"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />

                            <Input
                                label="Rent Amount"
                                type="text"
                                value={rent}
                                placeholder="e.g 2000000"
                                onChange={(e) => setRent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input_group">
                            <label>Property Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Shop">Shop</option>
                                <option value="Land">Land</option>
                            </select>
                        </div>

                        <div className="input_group">
                            <label>Upload Images</label>
                            <input type="file" multiple onChange={handleFileChange} />
                        </div>

                        <div className="modal_actions">
                            <ButtonAlt
                                label="Cancel"
                                type="button"
                                onClick={onClose}
                            />
                            <Button label="Submit for Approval" type="submit" />
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default AddPropertyModal;