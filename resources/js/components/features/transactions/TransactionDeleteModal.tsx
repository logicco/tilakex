import {useAppDispatch, useAppSelector} from "../../../helpers/hooks";
import ReactDOM from "react-dom";
import {Fragment} from "react";
import FlashMessage from "../../FlashMessage";
import {hideDeleteModal, deleteTransaction, getTransactions} from "./transactionSlice";
import { transform } from "typescript";
import { buildQueries } from "@testing-library/react";

export default function TransactionDeleteModal() {
    var dispatch = useAppDispatch();
    var transactions = useAppSelector(s => s.transaction.entities.data);
    var meta = useAppSelector(s => s.transaction.entities.meta);
    var link = useAppSelector(s => s.transaction.entities.links);
    var loading = useAppSelector(s => s.transaction.loading);
    var account_id = useAppSelector(s => s.transaction.modal.account_id);
    var transaction_id = useAppSelector(s => s.transaction.modal.transaction_id);
    var error = useAppSelector(s => s.transaction.error);

    function hasErrorMessage(){
        return error && !error.errors && error.message !== "";
    }

    function closeModal() {
        dispatch(hideDeleteModal());
    }


    function isLoading() {
        return loading === "pending";
    }

    function submit(e) {
        e.preventDefault();
        dispatch(deleteTransaction({account_id, transaction_id })).then((action: any) => {
            if(!action.error) {
                //redux transactions state has not yet updated at this stage
                //so we will assume transaction is deleted...
                let prevTransactionsLength = transactions.length
                if(prevTransactionsLength === 1 && link.prev !== null) {
                    console.log("should move back");
                    dispatch(getTransactions({
                        accountId: account_id,
                        query: `page=${link.prev[link.prev.length - 1]}`
                    }))
                }else if(prevTransactionsLength === 1 && link.next !== null) {
                    console.log("should move forward");
                    dispatch(getTransactions({
                        accountId: account_id,
                        query: `page=${meta.current_page}`
                    }))
                }
                closeModal();
            }
        })
    }

    return (
        <Fragment>
            {ReactDOM.createPortal(
                <form onSubmit={submit}>
                    <div className="modal is-active">
                        <div onClick={closeModal} className="modal-background"/>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">Delete Transaction</p>
                                <button onClick={closeModal} className="delete" aria-label="close"/>
                            </header>
                            <section className="modal-card-body">
                                {hasErrorMessage() && <FlashMessage variant="danger" message={error.message}/>}
                                {!hasErrorMessage() &&
                                <FlashMessage variant="warning" message="Are you sure you want to delete Transaction?"/>}
                            </section>
                            <footer className="modal-card-foot">
                                <button disabled={isLoading()} type="submit" className={`button is-danger ${isLoading() ? "is-loading": ""}`}>Delete</button>
                            </footer>
                        </div>
                    </div>
                </form>
               ,
                document.getElementById("modal"))}
        </Fragment>
    )
}
