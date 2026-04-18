import '../Styles/Cards.css'
import { FaNairaSign } from 'react-icons/fa6';
import moneyIcon from '../assets/images/moneyIcon.svg'

type RevenueCardProps = {
    TotalRevenue: number;
    label: string;
}

const RevenueCard = ({
    TotalRevenue,
    label
}: RevenueCardProps) => {
    return (
        <>
        <div className="revenue_card">
            <div className="revenue_card_details">
                <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)', letterSpacing:'3px'}}>{label}</p>
                <div className="revenue_details" style={{color: 'var(--text-h)'}}>
                    <span><FaNairaSign /></span>
                    <h3>{TotalRevenue}</h3>
                </div>
            </div>
            <img src={moneyIcon} alt="" />
        </div>
        </>
    );
}

export default RevenueCard;