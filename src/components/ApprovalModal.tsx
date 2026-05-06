import "../styles/Cards.css"
import ButtonAlt from "./ButtonAlt";
import Button from "./Button";

type ApprovalModalProps = {
    title: string;
    approvalMessage: string;
    isOpen: boolean;     
    onClose: () => void;
    onConfirm: () => void;
};

const ApprovalModal = ({
    title,
    approvalMessage,
    isOpen,
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
                        label="cancel"
                        onClick={onClose}
                        />

                        <Button 
                        label="Approve Request"
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