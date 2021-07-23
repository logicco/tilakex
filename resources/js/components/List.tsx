import FlashMessage from "./FlashMessage";
import {Fragment} from "react";

interface Props<T> {
    items: T[],
    label: string,
    Item: any,
}

export default function List<T>({ items, label, Item}: Props<T>) {

    if(items.length === 0) {
        return <FlashMessage message={`No ${label} found`} variant="warning"/>
    }
    return (
        <Fragment>
            {items.map((i:any) => <Item key={i.id} item={i} />)}
        </Fragment>
    )
}
