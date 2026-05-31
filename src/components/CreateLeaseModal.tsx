import "../Styles/Cards.css";
import "../Styles/PropertyCard.css";
import Button from "./Button";
import ButtonAlt from "./ButtonAlt";
import Input from "./Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type CreateLeaseProps = {
    leaseId: string;
    propertyId: string;
    tenantId: string;
    startDate: string;
    endDate: string;
    rentAmount: string;
    isOpen: boolean;
    onClose: () => void;
    onLeaseCreated: () => void;
};

const CreateLeaseModal = ({
    propertyId,
    tenantId,
    isOpen,
    onClose,
    onLeaseCreated,
}: CreateLeaseProps) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken") || "";

    const [startDate, setStartDate]   = useState("");
    const [endDate, setEndDate]       = useState("");
    const [rentAmount, setRentAmount] = useState("");
    const [isLoading, setIsLoading]   = useState(false);
    const [error, setError]           = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setStartDate("");
        setEndDate("");
        setRentAmount("");
        setError("");
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const request = await fetch(
                `https://propms-api.fly.dev/api/v1/Leases`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        propertyId,
                        tenantId,
                        startDate: new Date(startDate).toISOString(),
                        endDate:   new Date(endDate).toISOString(),
                        rentAmount: parseFloat(rentAmount),
                    }),
                }
            );

            const response = await request.json();

            if (request.ok && response.success) {
                handleClose();
                onLeaseCreated();
                navigate("/landlord-payment");
            } else {
                setError(response.message || "Failed to create lease. Please try again.");
            }

        } catch {
            setError("Network error. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal_overlay" onClick={handleClose}>
            <div className="approval_modal" onClick={(e) => e.stopPropagation()}>
                <h3>Lease Details Form</h3>

                <div className="modal_body">
                    <form className="modal_form" onSubmit={handleSubmit}>

                        <div className="input_group">
                            <Input
                                label="Start Date"
                                type="date"
                                placeholder="DD/MM/YYYY"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input_group">
                            <Input
                                label="End Date"
                                type="date"
                                placeholder="DD/MM/YYYY"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input_group">
                            <Input
                                label="Rent Amount"
                                type="number"
                                placeholder="0.00"
                                value={rentAmount}
                                onChange={(e) => setRentAmount(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '8px' }}>
                                ⚠ {error}
                            </p>
                        )}

                        <div className="modal_actions">
                            <ButtonAlt
                                label="Cancel"
                                type="button"
                                onClick={handleClose}
                            />
                            <Button
                                label={isLoading ? "Creating..." : "Create Lease"}
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

export default CreateLeaseModal;