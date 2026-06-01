import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Input from "./Input";
import Button from "./ButtonAlt";
import "../Styles/cards.css";

interface LeaseRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    propertyTitle?: string;
}

const LeaseRequestModal = ({ isOpen, onClose, onSuccess, propertyTitle }: LeaseRequestModalProps) => {
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Lease request submitted:", { date, description });
        setDate("");
        setDescription("");
        onClose();
        onSuccess();
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal_overlay" onClick={handleOverlayClick}>
            <div className="lease_modal">

                <div className="modal_header">
                    <div>
                        <h3>Request Lease</h3>
                        {propertyTitle && (
                            <p className="lease_modal_subtitle">{propertyTitle}</p>
                        )}
                        <p className="lease_modal_desc">
                            Send a request to the landlord indicating your interest in this property.
                        </p>
                    </div>
                    <button
                        className="modal_close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

    
                <div className="modal_body">
                    <form className="modal_form" onSubmit={handleSubmit}>
                        <div className="input_group">
                            <Input
                                label="Move-in Date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input_group">
                            <Input
                                label="Message to Landlord"
                                type="textarea"
                                placeholder="Hi, I'm interested in this apartment and can move in on the selected date."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="modal_actions">
                            <button
                                type="button"
                                className="btn_secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <Button
                                label="Submit Lease Request"
                                type="submit"
                                className="btn_primary"
                            />
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default LeaseRequestModal;