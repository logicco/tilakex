import IconButton from "../IconButton";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import AuthLayout from "../AuthLayout";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../helpers/hooks";
import LoadingSpinner from "../LoadingSpinner";
import List from "../List";
import AccountItem from "../features/accounts/AccountItem";
import {getAccounts, showAccountModal} from "../features/accounts/accountsSlice";
import {EnumModalType} from "../../helpers/enums";

export default function AccountsPage() {
    var dispatch = useAppDispatch();
    var accounts = useAppSelector(s => s.account.entities);
    var loading = useAppSelector(s => s.account.loading);


    useEffect(() => {
        if(accounts.length === 0) {
            dispatch(getAccounts());
        }
    },[]);

    function _showAccountModal() {
        dispatch(showAccountModal({type: EnumModalType.add}));
    }

    return (
        <AuthLayout>
            <section className="columns">
                <article className="column">
                    <h1 className="title">Accounts</h1>
                </article>
                <article className="column has-text-right">
                    <IconButton onClick={_showAccountModal} classes="is-primary is-outlined" icon={faPlus} text="Account"/>
                </article>
            </section>
            {loading === "pending" && <LoadingSpinner />}
            {loading === "succeeded" && <List label="account" items={accounts} Item={AccountItem}/>}
        </AuthLayout>
    )
}
