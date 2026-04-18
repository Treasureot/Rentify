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
            <button className="btn_primary" onClick={onclick} type={type}>
                {label}
            </button>
        </>
    );
}

export default Button;