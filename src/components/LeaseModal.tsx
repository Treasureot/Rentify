import "../Styles/Cards.css";
import "../Styles/PropertyCard.css";
import Button from "./Button";
import ButtonAlt from "./ButtonAlt";
import Input from "./Input";
import { FaNairaSign } from "react-icons/fa6";
import { useState } from "react";
import type { LeaseData } from "./LeaseCard";

type LeaseModalProps = {
    isOpen: boolean;
    lease: LeaseData;
    onClose: () => void;
    onSave: (updated: LeaseData) => void;
};

const LeaseModal = ({ isOpen, lease, onClose, onSave }: LeaseModalProps) => {
    const [form, setForm] = useState<LeaseData>(lease);

    if (!isOpen) return null;

    const handleChange = (field: keyof LeaseData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!form.startDate || !form.endDate || !form.propertyRentAmount) return;
        onSave(form);
        onClose();
    };

    const handleClose = () => {
        setForm(lease);
        onClose();
    };

    return (
        <div className="modal_overlay" onClick={handleClose}>
            <div className="success_modal" onClick={(e) => e.stopPropagation()}>
                <h3>Lease Details</h3>

                <div className="lease-modal-amount">
                    <FaNairaSign size={16} />
                    <h4>{form.propertyRentAmount}</h4>
                    <span>/ {form.period}</span>
                </div>

                <div className="modal_body">
                    <div className="modal_form">

                        <div className="input_group">
                            <Input
                                label="Rent Amount"
                                type="number"
                                value={form.propertyRentAmount}
                                onChange={(e) => handleChange("propertyRentAmount", e.target.value)}
                            />
                        </div>

                        <div className="input_group">
                            <Input
                                label="Start Date"
                                type="date"
                                value={form.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                            />
                        </div>

                        <div className="input_group">
                            <Input
                                label="End Date"
                                type="date"
                                value={form.endDate}
                                onChange={(e) => handleChange("endDate", e.target.value)}
                            />
                        </div>

                        <div className="modal_actions">
                            <ButtonAlt
                                label="Cancel"
                                type="button"
                                onClick={handleClose}
                            />
                            <Button
                                label="Save Lease"
                                type="button"
                                onClick={handleSave}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaseModal;