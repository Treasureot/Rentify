import '../Styles/Cards.css'

type DefaultCardProps = {
    TotalValue: number;
    label: string;
    bgColor?: string;
    colorText?: string;
}

const DefaultCard = ({
    TotalValue,
    label,
    bgColor,
    colorText
}: DefaultCardProps) => {
    return (
        <>
        <div className="default_card" style={{backgroundColor: bgColor,}}>
            <div className="revenue_card_details">
                <p style={{ fontSize: '12px', fontWeight: '600', color: colorText, letterSpacing:'3px'}}>{label}</p>
                <div className="revenue_details">
                    <h3 style={{color: colorText, fontSize: '30px'}}>{TotalValue}</h3>
                </div>
            </div>
        </div>
        </>
    );
}

export default DefaultCard;