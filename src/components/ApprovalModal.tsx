import "../styles/Cards.css"
import ButtonAlt from "./ButtonAlt";
import Button from "./Button";

type ApprovalModalProps = {
    title: string;
    approvalMessage: string;
    isOpen: boolean;   
    label: string;  
    labelAlt: string;
    onClose: () => void;
    onConfirm: () => void;
};

const ApprovalModal = ({
    title,
    approvalMessage,
    isOpen,
    label,
    labelAlt,
    onClose,
    onConfirm
}: ApprovalModalProps) => {
    if (!isOpen) return null; 
    return (
        <>
        <div className="modal_overlay" onClick={onClose}>
            <div className="approval_modal" onClick={(e) => e.stopPropagation()}>
               <div className="approval_modal_content">
                <div className="approval_header"><h3>{title}</h3></div>
            
                    <div className="approval_body">
                        {approvalMessage}
                    </div>

                    <div className="modal_actions">
                        <ButtonAlt 
                        label={labelAlt}
                        onClick={onClose}
                        />

                        <Button 
                        label={label}
                        onClick={onConfirm}
                        />
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ApprovalModal;