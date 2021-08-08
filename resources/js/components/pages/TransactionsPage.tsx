import IconButton from "../IconButton";
import { faArrowUp, faPlus } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "../LoadingSpinner";
import AuthLayout from "../AuthLayout";
import { useAppDispatch, useAppSelector } from "../../helpers/hooks";
import TransactionsList from "../features/transactions/TransactionsList";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getTransactions,
    Transaction,
} from "../features/transactions/transactionSlice";
import { showAccountModal } from "../features/accounts/accountsSlice";
import { EnumModalType } from "../../helpers/enums";
import { Mode } from "../../helpers/interfaces";
import { PageNotFound } from "../PageNotFound";
import TransactionForm from "../features/transactions/TransactionForm";

export default function TransactionsPage() {
    var params: { id?: string } = useParams();
    var dispatch = useAppDispatch();
    var loading = useAppSelector((s) => s.transaction.loading);
    var account = useAppSelector((s) => s.transaction.account);
    var transactions = useAppSelector((s) => s.transaction.entities.data);
    var error = useAppSelector((s) => s.transaction.error);
    var links = useAppSelector((s) => s.transaction.entities.links);
    var [transaction, setTransaction] = useState<Transaction | null>(null);
    var [mode, setMode] = useState<Mode>("none");

    function isLoading() {
        return loading === "pending";
    }

    useEffect(() => {
        if (params.id) {
            dispatch(getTransactions(params.id));
        }
    }, []);

    function transactionSaved() {
        reset();
    }

    function reset() {
        setMode("none");
        setTransaction(null);
    }

    function selectTransaction(t: Transaction) {
        setMode("edit");
        setTransaction(t);
    }

    if (isLoading()) {
        return (
            <AuthLayout>
                <LoadingSpinner />
            </AuthLayout>
        );
    }

    if (loading === "failed" && error && error.status === 404) {
        return (
            <AuthLayout>
                <PageNotFound />
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <section className="column">
                <nav className="breadcrumb" aria-label="breadcrumbs">
                    <ul>
                        <li>
                            <Link to={"/accounts"}>Accounts</Link>
                        </li>
                        <li>
                            <a
                                onClick={() =>
                                    dispatch(
                                        showAccountModal({
                                            type: EnumModalType.edit,
                                            data: account,
                                        })
                                    )
                                }
                            >
                                {account.name}
                            </a>
                        </li>
                        {mode !== "none" && (
                            <li>
                                <a onClick={() => reset()}>Transactions</a>
                            </li>
                        )}
                        {mode !== "none" && (
                            <li className="is-active">
                                <a href="#" aria-current="page">
                                    {mode === "add" ? "Add" : "Edit"}
                                </a>
                            </li>
                        )}
                    </ul>
                </nav>
            </section>
            <section className="columns my-4">
                <article className="column">
                    <h1 className="title">Transactions</h1>
                </article>
                <article className="column has-text-right">
                    {mode === "none" && (
                        <IconButton
                            onClick={() => setMode("add")}
                            classes="is-primary is-outlined"
                            icon={faPlus}
                            text="Transaction"
                        />
                    )}
                    {mode !== "none" && (
                        <IconButton
                            onClick={() => setMode("none")}
                            classes={"is-danger is-outlined"}
                            icon={faArrowUp}
                            text="Dismiss"
                        />
                    )}
                </article>
            </section>
            {mode !== "none" && (
                <TransactionForm
                    transactionSaved={transactionSaved}
                    transaction={transaction}
                    mode={mode}
                    account={account}
                />
            )}
            {mode === "none" && loading === "succeeded" && (
                <TransactionsList
                    selectTransaction={selectTransaction}
                    account={account}
                    links={links}
                    transactions={transactions}
                />
            )}
        </AuthLayout>
    );
}
