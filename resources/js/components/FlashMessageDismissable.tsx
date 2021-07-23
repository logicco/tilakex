import { useAppDispatch } from "../helpers/hooks";
import { dissmissFlashMessage } from "./features/ui/uiSlice";

interface Props {
    message: string;
    variant: string;
}

export default function FlashMessageDismissable(props: Props) {
    var dispatch = useAppDispatch();

    return (
        <div className="mt-5">
            <article className={`message is-${props.variant}`}>
                <div className="message-header">
                    {props.variant === "danger" && "Error"}
                    <button onClick={() => dispatch(dissmissFlashMessage())} className="delete" aria-label="delete"></button>
                </div>
                <div className="message-body">
                    {props.message}
                </div>
            </article>
        </div>
    );
}
