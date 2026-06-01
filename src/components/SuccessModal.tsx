// SuccessModal.tsx
import "../Styles/cards.css";
import SuccessImg from "../assets/images/firework.png";
import { useNavigate } from "react-router-dom";

type SuccessModalProps = {
    title: string;
    message: string;
    path: string;
    label: string;
    isOpen: boolean;
    onClose: () => void;
    onDone?: () => void;
};

const SuccessModal = ({
    title,
    message,
    path,
    label,
    isOpen,
    onClose,
    onDone,
}: SuccessModalProps) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleDone = () => {
        onClose();
        onDone?.();
        if (path) navigate(path);
    };

    return (
        <div className="modal_overlay" onClick={handleDone}>
            <div className="success_modal" onClick={(e) => e.stopPropagation()}>
                <div className="success_img">
                    <img src={SuccessImg} alt="Success" />
                </div>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal_action">
                    <button className="btn_primary" onClick={handleDone}>
                        {label}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;