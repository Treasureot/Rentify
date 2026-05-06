const Button = ({
    type = "button",
    onClick,
    label,
    href,
    className,
}: {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    label?: string;
    href?: string;
    className?: string;
}) => {
    if (href) {
        return (
            <a href={href} style={{ display: "block", width: "100%" }}>
                <button 
                className={`btn_secondary ${className || ""}`} 
                type={type}>
                    {label}
                </button>
            </a>
        );
    }

    return (
        <button
            className={`btn_secondary ${className || ""}`}
            onClick={onClick}
            type={type}
        >
            {label}
        </button>
    );
};

export default Button;