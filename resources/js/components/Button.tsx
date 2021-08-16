import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "success" | "danger" | "warning" | "light" | "none";
    outlined?: boolean;
    loading?: boolean | string;
    classes?: string;
    disable?: string
}

const Button: React.FC<Props> = (props) => {
    const { variant, outlined, loading, classes, disable } = props;
    var buttonLoading = loading === 'true';

    return (
        <button
            {...props}
            type={props.type ?? "button"}
            className={`button is-${variant ?? "primary"} ${
                outlined ? "is-outlined" : ""
            } ${buttonLoading ? "is-loading" : ""} ${classes && classes}`}
            disabled={buttonLoading ? buttonLoading : disable === "true"}
        >
            {props.children}
        </button>
    );
};

export default Button;
