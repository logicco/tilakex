import { useAppDispatch, useAppSelector } from "../../../helpers/hooks";
import ReactDOM from "react-dom";
import { Fragment, useEffect, useState } from "react";
import FlashMessage from "../../FlashMessage";
import {
    addAccount,
    hideAccountModals,
    updateAccount,
    deleteAccount,
} from "./accountsSlice";
import { useForm, SubmitHandler } from "react-hook-form";
import { buildCurrencyLabel } from "../../../helpers/dataCaching";
import LabelInput, { LabelController } from "../../LabelInput";
import { requiredRule } from "../../../helpers/formValidation";
import Button from "../../Button";
import CurrencyController from "../../CurrencyController";

interface Inputs {
    name: string;
    currency: string;
}

export default function AccountModal() {
    var dispatch = useAppDispatch();
    var account = useAppSelector((s) => s.account.modal.data);
    var [confirmDelete, setConfirmDelete] = useState(false);
    var loading = useAppSelector((s) => s.account.modal.loading);
    var error = useAppSelector((s) => s.account.modal.error);
    var options = useAppSelector((s) => s.account.modal.options);
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        control,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();

    useEffect(() => {
        setValue("name", nameDefaultValue());
    }, []);

    function shouldDelete(): boolean {
        return options && options.shouldDelete;
    }

    function hasErrorMessage() {
        return error && !error.errors && error.message !== "";
    }

    function closeModal() {
        dispatch(hideAccountModals());
    }

    function currencyDefaultValue() {
        return isEditing()
            ? {
                  value: account.currency.id,
                  label: buildCurrencyLabel(account.currency),
              }
            : null;
    }

    function nameDefaultValue(): any {
        return isEditing() ? account.name : "";
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
        var formData: any = { name: data.name, currency_id: data.currency };

        if (isAdding()) {
            //add new account
            dispatch(addAccount(formData)).then((action: any) => {
                if (!action.error) closeModal();
            });
        } else {
            if (confirmDelete) {
                //delete account
                dispatch(deleteAccount(account.id.toString())).then(
                    (action: any) => {
                        if (!action.error) {
                            closeModal();
                        }
                    }
                );
            } else {
                //update account
                formData = { account_id: account.id, ...formData };
                dispatch(updateAccount(formData)).then((action: any) => {
                    if (!action.error) closeModal();
                });
            }
        }
    };

    function modalTitle(): string {
        if (confirmDelete) return "Delete";
        return account ? "Edit" : "Add";
    }

    return (
        <Fragment>
            {ReactDOM.createPortal(
                <form onSubmit={handleSubmit(onSubmitSuccess)}>
                    <div className="modal is-active">
                        <div
                            onClick={closeModal}
                            className="modal-background"
                        />
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">
                                    {modalTitle()} Account
                                </p>
                                <button
                                    onClick={closeModal}
                                    className="delete"
                                    aria-label="close"
                                />
                            </header>
                            <section className="modal-card-body py-6">
                                {hasErrorMessage() && (
                                    <FlashMessage
                                        variant="danger"
                                        message={error.message}
                                    />
                                )}
                                {confirmDelete && !hasErrorMessage() && (
                                    <FlashMessage
                                        variant="warning"
                                        message="By deleting account all of its related transactions will also be deleted. Are you sure you want to delete account?"
                                    />
                                )}
                                {!confirmDelete && (
                                    <Fragment>
                                        <LabelInput
                                            defaultValue={getValues().name}
                                            register={{
                                                ...register(
                                                    "name",
                                                    requiredRule("name")
                                                ),
                                            }}
                                            type="text"
                                            placeholder="Enter account name"
                                            error={error}
                                            name="name"
                                            label="Name"
                                            clienterrors={clientErrors}
                                        />

                                        <LabelController
                                            label="Currency"
                                            name="currency"
                                            error={error}
                                            clienterrors={clientErrors}
                                            controller={
                                                <CurrencyController
                                                    control={control}
                                                    defaultValue={currencyDefaultValue()}
                                                    name="currency"
                                                />
                                            }
                                        />
                                    </Fragment>
                                )}
                            </section>
                            <footer className="modal-card-foot">
                                <p className="buttons">
                                    {!confirmDelete && (
                                        <Button
                                            type="submit"
                                            loading={isLoading().toString()}
                                        >
                                            Save {isEditing() && "Changes"}
                                        </Button>
                                    )}
                                    {isEditing() &&
                                        shouldDelete() &&
                                        !confirmDelete && (
                                            <Fragment>
                                                <Button
                                                    onClick={() =>
                                                        setConfirmDelete(true)
                                                    }
                                                    variant="danger"
                                                    outlined
                                                >
                                                    Delete
                                                </Button>
                                            </Fragment>
                                        )}
                                    {isEditing() && confirmDelete && (
                                        <Fragment>
                                            <Button
                                                type="submit"
                                                variant="danger"
                                                loading={isLoading().toString()}
                                            >
                                                Confirm Delete
                                            </Button>
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    setConfirmDelete(false)
                                                }
                                            >
                                                Dismiss
                                            </Button>
                                        </Fragment>
                                    )}
                                </p>
                            </footer>
                        </div>
                    </div>
                </form>,
                document.getElementById("modal")
            )}
        </Fragment>
    );
}
