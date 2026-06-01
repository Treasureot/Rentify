import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Input from "./Input";
import Button from "./Button";
import "../Styles/cards.css";

interface LeaseRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    propertyTitle?: string;
    propertyId?: string;
}

const LeaseRequestModal = ({
    isOpen,
    onClose,
    onSuccess,
    propertyTitle,
    propertyId,
}: LeaseRequestModalProps) => {
    const token = localStorage.getItem("accessToken") || "";

    const [date, setDate]             = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading]   = useState(false);
    const [error, setError]           = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setDate("");
        setDescription("");
        setError("");
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Leases/request`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        propertyId,
                        moveInDate: new Date(date).toISOString(),
                        message: description,
                    }),
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                handleClose();
                onSuccess();
            } else {
                setError(response.message || "Failed to submit lease request. Please try again.");
            }
        } catch {
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleClose();
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
                        onClick={handleClose}
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
                            <label>Message to Landlord</label>
                            <textarea
                                placeholder="Hi, I'm interested in this apartment and can move in on the selected date."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                style={{
                                    padding: '12px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    fontSize: '14px',
                                    minHeight: '90px',
                                    resize: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {error && (
                            <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '8px' }}>
                                ⚠ {error}
                            </p>
                        )}

                        <div className="modal_actions">
                            <button
                                type="button"
                                className="btn_secondary"
                                onClick={handleClose}
                                style={{ marginTop: 0 }}
                            >
                                Cancel
                            </button>
                            <Button
                                label={isLoading ? "Submitting..." : "Submit Lease Request"}
                                type="submit"
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default LeaseRequestModal;