import "../Styles/Cards.css";
import Button from "./Button";
import ButtonAlt from "./ButtonAlt";
import { useState, useEffect } from "react";

type RejectModalProps = {
    title: string;
    message?: string;
    label: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
};

const RejectModal = ({
    title,
    message,
    label,
    isOpen,
    onClose,
    onConfirm,
}: RejectModalProps) => {
    const [reason, setReason] = useState("");


    useEffect(() => {
        if (isOpen) {
            setReason("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        const trimmedReason = reason.trim();
        if (!trimmedReason) return;

        onConfirm(trimmedReason);
    };

    const handleClose = () => {
        setReason("");
        onClose();
    };

    return (
        <div className="modal_overlay" onClick={handleClose}>
            <div
                className="reject_modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h3>{title}</h3>

                {message && <p>{message}</p>}

                <div className="reject_reason">
                    <p>Reason for Rejection</p>

                    <textarea
                        placeholder="Enter reason for rejecting this payment..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                    />
                </div>

                <div className="modal_actions">
                    <ButtonAlt label="Cancel" onClick={handleClose} />

                    <Button
                        label={label}
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                    />
                </div>
            </div>
        </div>
    );
};

export default RejectModal;