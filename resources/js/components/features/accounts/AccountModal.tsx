import {useAppDispatch, useAppSelector} from "../../../helpers/hooks";
import ReactDOM from "react-dom";
import {Fragment, useEffect, useState} from "react";
import FlashMessage from "../../FlashMessage";
import {addAccount, hideAccountModals, updateAccount, deleteAccount} from "./accountsSlice";
import CurrencySelectControl from "../../CurrencySelectControl";
import {useForm, Controller, SubmitHandler} from "react-hook-form";
import {buildCurrencyLabel} from "../../../helpers/dataCaching";

interface Inputs {
    name: string,
    currency: string
}


export default function AccountModal(props) {
    var dispatch = useAppDispatch();
    var account = useAppSelector(s => s.account.modal.data);
    var [confirmDelete, setConfirmDelete] = useState(false);
    var loading = useAppSelector(s => s.account.modal.loading);
    var error = useAppSelector(s => s.account.modal.error);
    var options = useAppSelector(s => s.account.modal.options);
    const {register, setValue, getValues, handleSubmit, control, formState: {errors: clientErrors}} = useForm<Inputs>();

    useEffect(() => {
        setValue("name", nameDefaultValue());
    }, [])

    function shouldDelete(): boolean {
        return options && options.shouldDelete;
    }

    function hasErrorMessage() {
        return error && !error.errors && error.message !== "";
    }

    function closeModal() {
        dispatch(hideAccountModals());
    }

    function currencyDefaultValue(): any {
        return isEditing() ? {value: account.currency.id, label: buildCurrencyLabel(account.currency)} : ""
    }

    function nameDefaultValue(): any {
        return isEditing() ? account.name : "";
    }

    function hasDbError(key: string) {
        return error && error.errors && error.errors[key]
    }

    function getDbError(key: string) {
        return error.errors[key][0];
    }

    function isLoading() {
        return loading === "pending";
    }

    function isAdding() {
        return account ? false : true;
    }

    function isEditing() {
        return !isAdding();
    }

    const onSubmitSuccess: SubmitHandler<Inputs> = (data) => {
        if (confirmDelete) {
            dispatch(deleteAccount(account.id.toString())).then((action: any) => {
                if (!action.error) {
                    closeModal();
                }
            });
        }

        var formData: any = {name: data.name, currency_id: data.currency};
        if (isAdding()) {
            dispatch(addAccount(formData)).then((action: any) => {
                if (!action.error) closeModal();
            });
        } else if (isEditing()) {
            formData = {account_id: account.id, ...formData}
            dispatch(updateAccount(formData)).then((action: any) => {
                if (!action.error) closeModal();
            })
        }
    }

    function modalTitle(): string {
        if (confirmDelete) return "Delete";
        return (account ? "Edit" : "Add")
    }

    return (
        <Fragment>
            {ReactDOM.createPortal(
                <form onSubmit={handleSubmit(onSubmitSuccess)}>
                    <div className="modal is-active">
                        <div onClick={closeModal} className="modal-background"/>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">{modalTitle()} Account</p>
                                <button onClick={closeModal} className="delete" aria-label="close"/>
                            </header>
                            <section className="modal-card-body py-6">
                                {hasErrorMessage() && <FlashMessage variant="danger" message={error.message}/>}
                                {confirmDelete && !hasErrorMessage() &&
                                <FlashMessage variant="warning"
                                              message="By deleting account all of its related transactions will also be deleted. Are you sure you want to delete account?"/>}
                                {!confirmDelete &&
                                <Fragment>
                                    <div className="field">
                                        <label className="label">Name</label>
                                        <div className="control">
                                            <input
                                                defaultValue={getValues().name}
                                                onChange={(e) => setValue("name", e.target.value)}
                                                {...register("name", {required: "Name is required"})}
                                                className={`input ${hasDbError("name") || clientErrors.name ? "is-danger" : ""}`}
                                                type="text"
                                                placeholder="Enter account name"
                                            />
                                        </div>
                                        {hasDbError("name") && <p className="help is-danger">{getDbError("name")}</p>}
                                        {clientErrors.name &&
                                        <p className="help is-danger">{clientErrors.name.message}</p>}
                                    </div>
                                    <div className="field">
                                        <label className="label">Currency</label>
                                        <Controller
                                            control={control}
                                            rules={{required: "Currency is required"}}
                                            defaultValue={currencyDefaultValue().value}
                                            render={(props) => <CurrencySelectControl {...props}
                                                                                      onChange={(option) => props.field.onChange(option.value)}
                                                                                      defaultValue={currencyDefaultValue()}/>}
                                            name="currency"/>
                                        {hasDbError("currency_id") && (
                                            <p className="help is-danger">
                                                {getDbError("currency_id")}
                                            </p>
                                        )}
                                        {clientErrors.currency &&
                                        <p className="help is-danger">{clientErrors.currency.message}</p>}
                                    </div>
                                </Fragment>
                                }
                            </section>
                            <footer className="modal-card-foot">
                                <p className="buttons">
                                    {!confirmDelete && <button type="submit" disabled={isLoading()}
                                                               className={`button is-success ${isLoading() ? "is-loading" : ""}`}>
                                        {isLoading() ? "Saving.." : "Save"} {account && "Changes"}
                                    </button>}
                                    {isEditing() && shouldDelete() && !confirmDelete && (
                                        <Fragment>
                                            <button onClick={() => setConfirmDelete(true)}
                                                    className="button is-danger is-outlined">Delete
                                            </button>
                                        </Fragment>
                                    )
                                    }
                                    {isEditing() && confirmDelete && (
                                        <Fragment>
                                            <button type="submit"
                                                    className={`button is-danger ${isLoading() ? "is-loading" : ""}`}>Confirm
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
                    </div>
                </form>,
                document.getElementById("modal"))}
        </Fragment>
    )
}
