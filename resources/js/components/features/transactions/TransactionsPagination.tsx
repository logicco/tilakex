import Button from "../../Button";

interface Props {
    next: string;
    prev: string;
    fetch: (string) => void;
}

export default function TransactionsPagination(props: Props) {
    return (
        <nav className="pagination" role="navigation" aria-label="pagination">
            <Button
                onClick={() => props.fetch(props.prev.slice(-1))}
                variant="none"
                disable={props.prev === null ? "true" : "false"}
            >
                Previous
            </Button>
            <Button
                onClick={() => props.fetch(props.next.slice(-1))}
                variant="none"
                disable={props.next === null ? "true" : "false"}
            >
                Next page
            </Button>
        </nav>
    );
}
