import IconButton from "../IconButton";
import { faArrowUp, faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
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
import TransactionFilter from "../features/transactions/TransactionFilter";
import TransactionsPagination from "../features/transactions/TransactionsPagination";
import { ReactSelect } from "../../helpers/dataCaching";

export default function TransactionsPage() {
    var params: { id?: string } = useParams();
    var dispatch = useAppDispatch();
    var loading = useAppSelector((s) => s.transaction.loading);
    var account = useAppSelector((s) => s.transaction.account);
    var transactions = useAppSelector((s) => s.transaction.entities.data);
    var filter = useAppSelector((s) => s.transaction.filter);
    var meta = useAppSelector((s) => s.transaction.entities.meta);
    var links = useAppSelector((s) => s.transaction.entities.links);
    var error = useAppSelector((s) => s.transaction.error);
    var links = useAppSelector((s) => s.transaction.entities.links);
    var [transaction, setTransaction] = useState<Transaction | null>(null);
    var [mode, setMode] = useState<Mode>("none");
    var [showFilter, setShowFilter] = useState(false);
    var [filterCategories, setFilterCategories] = useState<ReactSelect[]>([]);
    var [filterPayees, setFilterPayees] = useState<ReactSelect[]>([]);

    function isLoading() {
        return loading === "pending";
    }

    useEffect(() => {
        if (params.id) {
            dispatch(
                getTransactions({
                    accountId: params.id,
                    query: buildQuery(1),
                })
            );
        }
    }, []);

    function buildQuery(page: string | number) {
        function build(key, value) {
            return `${key}=${value}`;
        }

        function commaSeperated(toFilter: ReactSelect[]) {
            var arr: string[] = [];
            var str = "";
            if (toFilter.length > 0) {
                toFilter.forEach((c) => {
                    arr.push(c.value);
                });
            }
            if (arr.length > 0) {
                str = arr.join(",");
            }
            return str;
        }

        const date = build("date", filter.date);
        const sort = build("sort", filter.sort);
        const type = build("type", filter.transaction_type.value);
        const pageQ = build("page", page);

        const commaSeperatedCategories = commaSeperated(filterCategories);
        const commaSeperatedPayees = commaSeperated(filterPayees);
        const categoriesQ =
            commaSeperatedCategories !== ""
                ? build("categories", commaSeperatedCategories) + "&"
                : "";
        const payeesQ =
            commaSeperatedPayees !== ""
                ? build("payees", commaSeperatedPayees) + "&"
                : "";

        return `${payeesQ}${categoriesQ}${date}&${sort}&${type}&${pageQ}`;
    }

    function fetchTransactions(page: string) {
        dispatch(
            getTransactions({
                accountId: params.id,
                query: `page=${page}`,
            })
        );
    }

    function filterTransactions() {
        dispatch(
            getTransactions({
                accountId: params.id,
                query: buildQuery(meta.current_page),
            })
        );
    }

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
                    &nbsp;
                    {mode === "none" &&
                        transactions.length !== 0 &&
                        !showFilter && (
                            <IconButton
                                onClick={() => setShowFilter(true)}
                                classes="is-primary is-outlined"
                                icon={faFilter}
                                text="Filter"
                            />
                        )}
                    {mode === "none" &&
                        showFilter &&
                        transactions.length > 0 && (
                            <IconButton
                                onClick={() => setShowFilter(false)}
                                classes={"is-danger"}
                                icon={faArrowUp}
                                text="Dismiss"
                            />
                        )}
                </article>
            </section>
            {mode === "none" && showFilter && (
                <TransactionFilter
                    filterPayees={filterPayees}
                    filterCategories={filterCategories}
                    setFilterCategories={setFilterCategories}
                    setFilterPayees={setFilterPayees}
                    filterTransactions={filterTransactions}
                />
            )}
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
            {mode === "none" &&
                loading === "succeeded" &&
                transactions.length > 0 && (
                    <section className="columns mt-4">
                        <article className="column">
                            <TransactionsPagination
                                prev={links.prev}
                                next={links.next}
                                fetch={fetchTransactions}
                            />
                        </article>
                    </section>
                )}
        </AuthLayout>
    );
}
