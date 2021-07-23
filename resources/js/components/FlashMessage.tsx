interface Props {
    message?: string;
    variant?: string;
    classes?: string;
}

export default function FlashMessage(props: Props) {
    const message = props.message ?? "Something went wrong";
    const variant = props.variant ?? "is-danger";

    return (
        <div className={`mt-5 ${props.classes}`}>
            <article className={`message is-${variant}`}>
                <div className="message-body">{message}</div>
            </article>
        </div>
    );
}
