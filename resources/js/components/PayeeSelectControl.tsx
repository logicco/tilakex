import {useAppSelector, useAppDispatch} from "../helpers/hooks";
import LoadingSpinner from "./LoadingSpinner";
import {ReactSelect} from "../helpers/dataCaching";
import {Fragment, useEffect} from "react";
import Select from "react-select";
import {getPayees} from "./features/payee/payeeSlice";

export default function PayeeSelectControl(props) {
    var payees = useAppSelector((state) => state.payee.entities);
    var loading = useAppSelector((state) => state.payee.loading);
    var dispatch = useAppDispatch();

    useEffect(() => {
        if(payees.length === 0) dispatch(getPayees());
    },[])

    function data(): ReactSelect[] {
        return payees.map(p => {
            return {
                value: p.id.toString(),
                label: p.name,
            }
        });
    }

    if (loading === "pending") {
        return <LoadingSpinner/>
    }

    return (
        <Fragment>
            {loading === "succeeded" && <Select {...props} options={data()}/>}
        </Fragment>
    )
}
