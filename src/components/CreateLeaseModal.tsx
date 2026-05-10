import "../Styles/Cards.css";
import "../Styles/PropertyCard.css";
import Button from "./Button";
import ButtonAlt from "./ButtonAlt";
import Input from "./Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type CreateLeaseProps = {
    leaseId: number;
    propertyId: number;
    tenantId: number;
    startDate: string;
    endDate: string;
    rentAmount: string;
    isOpen: boolean;
    onClose: () => void;
    onLeaseCreated: () => void;
};


export type SavedLease = {
    leaseId: number;
    propertyId: number;
    tenantId: number;
    startDate: string;
    endDate: string;
    rentAmount: string;
    status: "Active";
};

const CreateLeaseModal = ({
    propertyId,
    tenantId,
    isOpen,
    onClose,
    onLeaseCreated
}: CreateLeaseProps) => {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rentAmount, setRentAmount] = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setStartDate("");
        setEndDate("");
        setRentAmount("");
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // --- REPLACE THIS BLOCK WITH API ---
        const newLease: SavedLease = {
            leaseId: Date.now(),
            propertyId,
            tenantId,
            startDate,
            endDate,
            rentAmount,
            status: "Active",
        };

        const existing: SavedLease[] = JSON.parse(
            localStorage.getItem("activeLeases") ?? "[]"
        );
        localStorage.setItem(
            "activeLeases",
            JSON.stringify([...existing, newLease])
        );

        handleClose();
        navigate("/landlord-payment");
        onLeaseCreated();
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

                        <div className="modal_actions">
                            <ButtonAlt
                                label="Cancel"
                                type="button"
                                onClick={handleClose}
                            />
                            <Button
                                label="Create Lease"
                                type="submit"
                            />
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateLeaseModal;