import "../Styles/Cards.css";
import Button from "./Button";
import ButtonAlt from "./ButtonAlt";
import { useState } from "react";

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

    if (!isOpen) return null; 

    const handleConfirm = () => {
        if (!reason.trim()) return;
        onConfirm(reason);
        setReason("");
    };

    const handleClose = () => {
        setReason("");
        onClose();
    };

    return (
        <div className="modal_overlay" onClick={handleClose}>
            <div className="success_modal" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                {message && <p>{message}</p>}

                <div className="reject_reason">
                    <p>Reason for Rejection:</p>
                    <textarea 
                        placeholder="Provide a reason for rejecting this request"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <div className="modal_actions">

                    <ButtonAlt 
                        label="Cancel"
                        onClick={handleClose}
                    />
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