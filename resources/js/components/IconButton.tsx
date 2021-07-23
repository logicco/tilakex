import {IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Props {
    classes?: string,
    icon: IconDefinition,
    text?: string,
    onClick?: any,
    disabled?: boolean,
    type?: "button"|"submit",
    style?: any,
}

export default function IconButton(props: Props) {
    var {classes = "", icon, text = ""} = props;
    return (
        <button style={props.style} type={props.type || "button" } disabled={props.disabled} onClick={props.onClick} className={`button ${classes}`}>
                        <span className="icon">
                            <FontAwesomeIcon icon={icon}/>
                        </span>
            {text && <span>{text}</span>}
        </button>
    )
}
