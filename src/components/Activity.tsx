import '../Styles/Cards.css'
import { FaNairaSign } from 'react-icons/fa6';

type ActivityProps = {
    title: string;
    time: string;
    description: string;
    amount?: number;
}

const Activity = ({
    title,
    time,
    description,
    amount
}: ActivityProps) => {
    return (
        <>
        <div className='activity'>
            <div className="activity_header">
                <h4 style={{fontSize: '16px', color: 'var(--text-h)', marginBottom: '4px'}}>{title}</h4>
                <span style={{fontSize: '14px'}}>{time}</span>
            </div>
            <div className="activity_description">
                <p style={{fontSize: '14px'}}>{description}</p>
                <div className="amount_value">
                    <FaNairaSign size={14}/><span style={{fontSize: '14px'}}>{amount}</span>
                </div>
            </div>
        </div>
        </>
    );
}

export default Activity;