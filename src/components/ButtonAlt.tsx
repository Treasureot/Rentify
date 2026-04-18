const Button = ({
    type = "button",
    onClick,
    label,
}: {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    label?: string;
}) => {
    return (
        <>
            <button 
            className="btn_secondary" 
            onClick={onClick} type={type}>
                {label}
            </button>
        </>
    );
}

export default Button;