const Button = ({
    type = "button",
    onClick,
    label,
    disabled = false,
    href
}: {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    label?: string;
    disabled?: boolean;
    href?: string;
}) => {
    if (href) {
        return (
            <a href={href} style={{ display: 'block', width: '100%' }}>
                <button
                    className="btn_primary"
                    type={type}
                    disabled={disabled}
                    style={{ opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                    {label}
                </button>
            </a>
        );
    }
    
    return (
        <button className="btn_primary" 
        onClick={onClick} 
        type={type}
        disabled={disabled}
        style={{ opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            {label}
        </button>
    );
}

export default Button;