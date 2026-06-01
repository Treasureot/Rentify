import "../Styles/cards.css";
import Input from "../components/Input";
import Button from "../components/Button";
import ButtonAlt from "../components/ButtonAlt";
import React, { useState, useEffect, useCallback } from "react";
import { type Property } from "../pages/Landlord/LandlordProperty";

const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const DESCRIPTION_MAX = 2000;
const TITLE_MAX       = 200;

interface AddPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (property: Property) => void;
    onRefresh?: () => void;
    property?: Property | null;
}

interface FormErrors {
    title?:       string;
    description?: string;
    address?:     string;
    location?:    string;
    rent?:        string;
    images?:      string;
}

function AddPropertyModal({ isOpen, onClose, onAdd, onRefresh, property }: AddPropertyModalProps) {
    const token = localStorage.getItem("accessToken") || "";

    const [title, setTitle]           = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation]     = useState("");
    const [address, setAddress]       = useState("");
    const [rent, setRent]             = useState("");
    const [type, setType]             = useState("");
    const [images, setImages]         = useState<File[]>([]);
    const [errors, setErrors]         = useState<FormErrors>({});
    const [isLoading, setIsLoading]   = useState(false);
    const [apiError, setApiError]     = useState("");

    // Populate form when editing
    useEffect(() => {
        if (property) {
            setTitle(property.title || "");
            setDescription(property.description || "");
            setLocation(property.location || "");
            setAddress(property.address || "");
            setRent(property.rentAmount?.toString() || "");
            setType(property.propertyType || "");
        } else {
            resetForm();
        }
    }, [property, isOpen]);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setLocation("");
        setAddress("");
        setRent("");
        setType("");
        setImages([]);
        setErrors({});
        setApiError("");
    };

    const validateTitle = (value: string): string | undefined => {
        if (!value.trim()) return "Title is required.";
        if (value.length > TITLE_MAX)
            return `Title must be ${TITLE_MAX} characters or fewer (${value.length}/${TITLE_MAX}).`;
    };

    const validateDescription = (value: string): string | undefined => {
        if (!value.trim()) return "Description is required.";
        if (value.length > DESCRIPTION_MAX)
            return `Description must be ${DESCRIPTION_MAX} characters or fewer (${value.length}/${DESCRIPTION_MAX}).`;
    };

    const validateImages = (files: File[]): string | undefined => {
        const oversized = files.filter((f) => f.size > IMAGE_MAX_BYTES);
        if (oversized.length > 0) {
            return `These files exceed 2 MB: ${oversized.map((f) => f.name).join(", ")}`;
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
        setErrors((prev) => ({ ...prev, title: validateTitle(value) }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescription(value);
        setErrors((prev) => ({ ...prev, description: validateDescription(value) }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setImages(files);
        setErrors((prev) => ({ ...prev, images: validateImages(files) }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError("");

        const newErrors: FormErrors = {
            title:       validateTitle(title),
            description: validateDescription(description),
            images:      validateImages(images),
        };

        if (Object.values(newErrors).some(Boolean)) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("location", location);
            formData.append("address", address);
            formData.append("rentAmount", rent);
            formData.append("propertyType", type);
            images.forEach((file) => formData.append("images", file));

            const url = property
                ? `https://propms-api.fly.dev/api/v1/Properties/${property.id}`
                : `https://propms-api.fly.dev/api/v1/Properties`;

            const method = property ? "PUT" : "POST";

            const request = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const response = await request.json();

            if (request.ok && response.success) {
                onAdd(response.data);
                onRefresh?.();
                resetForm();
                onClose();
            } else {
                setApiError(response.message || "Failed to save property. Please try again.");
            }

        } catch {
            setApiError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEsc = useCallback(
        (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); },
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

                        <div className="input_group">
                            <Input
                                label="Property Title"
                                type="text"
                                placeholder="e.g Mini Flat in Yaba"
                                value={title}
                                onChange={handleTitleChange}
                                required
                            />
                            <div className="input_meta">
                                {errors.title ? (
                                    <span className="input_error">{errors.title}</span>
                                ) : (
                                    <span className="input_count">{title.length}/{TITLE_MAX}</span>
                                )}
                            </div>
                        </div>

                        <div className="input_group">
                            <label>Description</label>
                            <textarea
                                placeholder="Write here"
                                value={description}
                                onChange={handleDescriptionChange}
                                required
                            />
                            <div className="input_meta">
                                {errors.description ? (
                                    <span className="input_error">{errors.description}</span>
                                ) : (
                                    <span className="input_count">{description.length}/{DESCRIPTION_MAX}</span>
                                )}
                            </div>
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
                                label="Address"
                                type="text"
                                placeholder="e.g 12 Bode Thomas Street"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input_body">
                            <Input
                                label="Rent Amount (₦)"
                                type="number"
                                value={rent}
                                placeholder="e.g 2000000"
                                onChange={(e) => setRent(e.target.value)}
                                required
                            />

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
                        </div>

                        <div className="input_group">
                            <label>
                                Upload Images{" "}
                                <span className="input_hint">Max 2 MB per image</span>
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {errors.images && (
                                <span className="input_error">{errors.images}</span>
                            )}
                            {images.length > 0 && !errors.images && (
                                <ul className="image_preview_list">
                                    {images.map((f) => (
                                        <li key={f.name} className="image_preview_item">
                                            ✓ {f.name}{" "}
                                            <span className="input_count">
                                                ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {apiError && (
                            <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '8px' }}>
                                ⚠ {apiError}
                            </p>
                        )}

                        <div className="modal_actions">
                            <ButtonAlt
                                label="Cancel"
                                type="button"
                                onClick={onClose}
                            />
                            <Button
                                label={isLoading
                                    ? (property ? "Saving..." : "Submitting...")
                                    : (property ? "Save Changes" : "Submit for Approval")
                                }
                                type="submit"
                                disabled={isLoading}
                            />
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddPropertyModal;