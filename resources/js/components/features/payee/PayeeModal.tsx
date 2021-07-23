import {useAppDispatch, useAppSelector} from "../../../helpers/hooks";
import {addPayee, hidePayeeModals, deletePayee, updatePayee} from "./payeeSlice";
import ReactDOM from "react-dom";
import {Fragment, useState} from "react";
import FlashMessage from "../../FlashMessage";


export default function PayeeModal() {
    var dispatch = useAppDispatch();
    var payee = useAppSelector(s => s.payee.modal.data);
    var [name, setName] = useState((payee ? payee.name : ""));
    var [confirmDelete, setConfirmDelete] = useState(false);
    var loading = useAppSelector(s => s.payee.modal.loading);
    var error = useAppSelector(s => s.payee.modal.error);

    function hasErrorMessage(){
        return error && !error.errors && error.message !== "";
    }

    function closeModal() {
        dispatch(hidePayeeModals());
    }

    function hasNameError() {
        return error && error.errors && error.errors.name
    }

    function getNameError() {
        return error.errors.name[0];
    }

    function isLoading() {
        return loading === "pending";
    }

    function isAdding() {
        return payee ? false : true;
    }

    function isEditing() {
        return !isAdding();
    }

    function submitAddPayee() {
        dispatch(addPayee(name)).then((action: any) => {
            if (!action.error) closeModal();
        });
    }

    function submitEditPayee() {
        dispatch(updatePayee({name: name, id: payee.id})).then((action: any) => {
            if (!action.error) closeModal();
        });
    }

    function modalTitle(): string {
        if (confirmDelete) return "Delete";
        return (payee ? "Edit" : "Add")
    }

    function submitDeletePayee() {
        dispatch(deletePayee(payee.id)).then((action: any) => {
            if (!action.error) {
                closeModal();
            }
        });
    }

    function disableButton() {
        if (!isAdding()) {
            return name === payee.name;
        }
        return false;
    }

    return (
        <Fragment>
            {ReactDOM.createPortal(
                <div className="modal is-active">
                    <div onClick={closeModal} className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">{modalTitle()} Payee</p>
                            <button onClick={closeModal} className="delete" aria-label="close"/>
                        </header>
                        <section className="modal-card-body">
                            {hasErrorMessage() && <FlashMessage variant="danger" message={error.message}/>}
                            {confirmDelete && !hasErrorMessage() &&
                            <FlashMessage variant="warning" message="Are you sure you want to delete payee?"/>}
                            {!confirmDelete && <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`input ${hasNameError() ? "is-danger" : ""}`}
                                        type="text" placeholder="Enter Payee Name"
                                    />
                                </div>
                                {hasNameError() && (
                                    <p className="help is-danger">
                                        {getNameError()}
                                    </p>
                                )}
                            </div>}
                        </section>
                        <footer className="modal-card-foot">
                            <p className="buttons">
                                {!confirmDelete && <button onClick={() => {
                                    if (isAdding()) {
                                        submitAddPayee();
                                    } else {
                                        submitEditPayee();
                                    }
                                }
                                } disabled={disableButton()}
                                                           className={`button is-success ${isLoading() ? "is-loading" : ""}`}>
                                    {isLoading() ? "Saving.." : "Save"} {payee && "Changes"}
                                </button>}
                                {isEditing() && !confirmDelete && (
                                    <Fragment>
                                        <button onClick={() => setConfirmDelete(true)}
                                                className="button is-danger is-outlined">Delete
                                        </button>
                                        <button onClick={closeModal} className="button">Cancel</button>
                                    </Fragment>
                                )
                                }
                                {isEditing() && confirmDelete && (
                                    <Fragment>
                                        <button onClick={submitDeletePayee}
                                                className={`button is-danger is-outlined ${isLoading() ? "is-loading" : ""}`}>Confirm
                                            Delete
                                        </button>
                                        <button onClick={() => setConfirmDelete(false)} className="button">Dismiss
                                        </button>
                                    </Fragment>
                                )
                                }
                            </p>
                        </footer>
                    </div>
                </div>,
                document.getElementById("modal"))}
        </Fragment>
    )
}
