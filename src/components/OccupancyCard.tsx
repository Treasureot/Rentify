import '../Styles/Cards.css'

type OccupancyCardProps = {
    label: string;
    bgColor?: string;
    colorText?: string;
    occupied: number;
    vacant: number;
}

const OccupancyCard = ({
    label,
    bgColor,
    colorText,
    occupied,
    vacant
}: OccupancyCardProps) => {
    return (
        <>
        <div className="occupancy_card" style={{backgroundColor: bgColor,}}>
            <div className="occupancy_card_details">
                <p style={{ fontSize: '12px', fontWeight: '600', color: colorText, letterSpacing:'3px'}}>{label}</p>
                <div className="occupancy_details">
                    <div className="occupancy_label">
                        <p>Occupied</p>
                        <p style={{color: 'var(--text-h)', fontWeight: '600'}}>{occupied}</p>
                    </div>

                    <div className="occupancy_label">
                        <p>Vacant</p>
                        <p style={{color: 'var(--text-h)', fontWeight: '600'}}>{vacant}</p>
                    </div>                    
                </div>
            </div>
        </div>
        </>
    );
}

export default OccupancyCard;