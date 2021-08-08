import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "success" | "danger" | "warning" | "light";
    outlined?: boolean;
    loading?: boolean | string;
    classes?: string;
}

const Button: React.FC<Props> = (props) => {
    const { variant, outlined, loading, classes } = props;
    var buttonLoading = loading === 'true';
    return (
        <button
            {...props}
            type={props.type ?? "button"}
            className={`button is-${variant ?? "success"} ${
                outlined ? "is-outlined" : ""
            } ${buttonLoading ? "is-loading" : ""} ${classes && classes}`}
            disabled={buttonLoading}
        >
            {props.children}
        </button>
    );
};

export default Button;
