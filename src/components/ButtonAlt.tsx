const Button = ({
    type = "button",
    onclick,
    label,
}: {
    type?: "button" | "submit" | "reset";
    onclick?: () => void;
    label?: string;
}) => {
    return (
        <>
            <button 
            className="btn_secondary" 
            onClick={onclick} type={type}>
                {label}
            </button>
        </>
    );
}

export default Button;