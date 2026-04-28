import "../Styles/Cards.css";
import SuccessImg from "../assets/images/firework.png";
import React from "react";

type SuccessModalProps = {
    title: string;
    message: string;
    path: string;
    label: string;
    isOpen: boolean;     
    onClose: () => void;
};

const SuccessModal = ({ 
    title, 
    message, 
    path, 
    label,
    isOpen,
    onClose 
}: SuccessModalProps) => {
     if (!isOpen) return null; 
    return (
        <div className="modal_overlay" onClick={onClose}>
            <div className="success_modal" onClick={(e) => e.stopPropagation()}>
                <div className="success_img">
                    <img src={SuccessImg} alt="Success" />
                </div>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal_action">
                    <a href={path}>  
                        <button className="btn_primary">
                            {label}
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;