import {useAppSelector, useAppDispatch} from "../helpers/hooks";
import LoadingSpinner from "./LoadingSpinner";
import {ReactSelect} from "../helpers/dataCaching";
import {Fragment, useEffect} from "react";
import Select from "react-select";
import {getAccounts} from "./features/accounts/accountsSlice";

export default function AccountSelectControl(props) {
    var accounts = useAppSelector((state) => state.account.entities);
    var loading = useAppSelector((state) => state.account.loading);
    var dispatch = useAppDispatch();

    useEffect(() => {
        if(accounts.length === 0) dispatch(getAccounts());
    },[])

    function data(): ReactSelect[] {
        return accounts.map(p => {
            return {
                value: p.id.toString(),
                label: p.name,
            }
        });
    }

    if (loading === "pending") {
        return <LoadingSpinner />
    }

    return (
        <Fragment>
            {loading === "succeeded" && <Select {...props} options={data()}/>}
        </Fragment>
    )
}
