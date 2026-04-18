import '../Styles/Cards.css'
import { HiOutlineDocumentText, HiChevronRight } from 'react-icons/hi';
import { MdOutlineReceiptLong } from 'react-icons/md';

type ManagementCardProps = {
    label: string;
    bgColor?: string;
    colorText?: string;
    leaseNumber: number;
}

const ManagementCard = ({
    label,
    bgColor,
    colorText,
    leaseNumber
}: ManagementCardProps) => {
    return (
        <>
        <div className="management_card" style={{backgroundColor: bgColor,}}>
            <div className="management_card_details">
                <p style={{ fontSize: '12px', fontWeight: '600', color: colorText, letterSpacing:'3px'}}>{label}</p>
                <div className="management_details">
                    <div className="management_label">
                        <div className="management_group">
                            <HiOutlineDocumentText size={20}/>
                            <p>Lease Renewals</p>                            
                        </div>
                        <p style={{
                            color: 'var(--bg)', 
                            fontWeight: '600', 
                            backgroundColor: 'Red', 
                            padding: '8px', 
                            height: '10px',
                            borderRadius: '200px', 
                            display: 'inline-flex',
                            alignItems: 'center'}}>{leaseNumber}</p>
                    </div>
              
                    <div className="management_label">
                        <a href="">
                            <div className="management_group">
                                <MdOutlineReceiptLong size={20}/>
                                <p>Tax Documents</p>                            
                            </div>
                            <HiChevronRight size={24}/>
                        </a>
                    </div>                    
                </div>
            </div>
        </div>
        </>
    );
}

export default ManagementCard;