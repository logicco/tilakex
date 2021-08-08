
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    StateError,
    hasDbError,
    getDbError,
} from "../helpers/errorHandling";
import FormError from "./FormError";

interface Props {
    defaultValue?: string,
    register?: any;
    classes?: string;
    type: string;
    icon?: any;
    error: StateError;
    label: string;
    name: string;
    placeholder: string;
    clienterrors: any;
    onChange?: any,
}

export default function LabelInput(props: Props) {
    return (
        <div className="field">
            <label className="label">{props.label}</label>
            <div className={`control ${props.icon && 'has-icons-left'}`}>
                <input
                    {...props.register}
                    {...props}
                    className={`input ${props.classes} ${
                        hasDbError(props.name, props.error) ||
                        props.clienterrors[props.name]
                            ? "is-danger"
                            : ""
                    }`}
                />
                {props.icon && (
                    <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={props.icon} />
                    </span>
                )}
            </div>
            {hasDbError(props.name, props.error) && (
                <FormError message={getDbError(props.name, props.error)} />
            )}
            {props.clienterrors[props.name] && (
                <FormError message={props.clienterrors[props.name].message} />
            )}
        </div>
    );
}

interface LabelControllerProps {
    label: string,
    controller: any,
    name: string,
    error: StateError,
    clienterrors: any
}

export function LabelController(props: LabelControllerProps) {
    return (
        <div className="field">
            <label className="label">{props.label}</label>
            {props.controller}
            {hasDbError(props.name, props.error) && (
                <FormError message={getDbError(props.name, props.error)} />
            )}
            {props.clienterrors[props.name] && (
                <FormError message={props.clienterrors[props.name].message} />
            )}
        </div>
    )
}
