import { useAppDispatch, useAppSelector } from "../../../helpers/hooks";
import {
    addPayee,
    hidePayeeModals,
    deletePayee,
    updatePayee,
    removePayeeModalError,
} from "./payeeSlice";
import ReactDOM from "react-dom";
import { Fragment, useState } from "react";
import FlashMessage from "../../FlashMessage";
import LabelInput from "../../LabelInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { requiredRule } from "../../../helpers/formValidation";
import { useEffect } from "react";
import Button from "../../Button";

interface Inputs {
    name: string;
}

export default function PayeeModal() {
    var dispatch = useAppDispatch();
    var payee = useAppSelector((s) => s.payee.modal.data);
    var [confirmDelete, setConfirmDelete] = useState(false);
    var loading = useAppSelector((s) => s.payee.modal.loading);
    var error = useAppSelector((s) => s.payee.modal.error);
    var {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();

    useEffect(() => {
        if (isEditing()) {
            setValue("name", payee.name);
        }
    }, []);

    function hasErrorMessage() {
        return error && !error.errors && error.message !== "";
    }

    function closeModal() {
        dispatch(hidePayeeModals());
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

    const submitForm: SubmitHandler<Inputs> = (data) => {

        //add payee
        if(isAdding()) {
            dispatch(addPayee(data.name)).then((action: any) => {
                if (!action.error) closeModal();
            });
        }else {
            //delete payee
            if(confirmDelete) {
                dispatch(deletePayee(payee.id)).then((action: any) => {
                    if (!action.error) {
                        closeModal();
                    }
                });
            }else{ //edit payee
                dispatch(updatePayee({name: data.name, id: payee.id})).then((action: any) => {
                    if (!action.error)
                        closeModal();
                });
            }

        }

    };


    function modalTitle() {
        if (confirmDelete) return "Delete";
        return payee ? "Edit" : "Add";
    }

    return (
        <Fragment>
            {ReactDOM.createPortal(
                <div className="modal is-active">
                    <div onClick={closeModal} className="modal-background" />
                    <form onSubmit={handleSubmit(submitForm)}>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">
                                    {modalTitle()} Payee
                                </p>
                                <button
                                    onClick={closeModal}
                                    className="delete"
                                    aria-label="close"
                                />
                            </header>
                            <section className="modal-card-body">
                                {hasErrorMessage() && (
                                    <FlashMessage
                                        variant="danger"
                                        message={error.message}
                                    />
                                )}
                                {confirmDelete && !hasErrorMessage() && (
                                    <FlashMessage
                                        variant="warning"
                                        message="Are you sure you want to delete payee?"
                                    />
                                )}
                                {!confirmDelete && (
                                    <LabelInput
                                        defaultValue={getValues().name}
                                        register={{
                                            ...register(
                                                "name",
                                                requiredRule("name")
                                            ),
                                        }}
                                        label="Name"
                                        error={error}
                                        clienterrors={clientErrors}
                                        name="name"
                                        type="text"
                                        placeholder="Enter payee name"
                                    />
                                )}
                            </section>
                            <footer className="modal-card-foot">
                                <p className="buttons">
                                    {!confirmDelete && (
                                        <Button
                                            type="submit"
                                            loading={isLoading().toString()}
                                        >
                                            Save {payee && "Changes"}
                                        </Button>
                                    )}
                                    {isEditing() && !confirmDelete && (
                                        <Fragment>
                                            <Button
                                                variant="danger"
                                                outlined
                                                onClick={() =>
                                                    setConfirmDelete(true)
                                                }
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                onClick={closeModal}
                                                variant="light"
                                            >
                                                Cancel
                                            </Button>
                                        </Fragment>
                                    )}
                                    {isEditing() && confirmDelete && (
                                        <Fragment>
                                            <Button
                                                type="submit"
                                                loading={isLoading().toString()}
                                                variant="danger"
                                            >
                                                Confirm Delete
                                            </Button>
                                            <Button
                                                variant="light"
                                                onClick={() => {
                                                    setConfirmDelete(false)
                                                    dispatch(removePayeeModalError());
                                                }}>
                                                Dismiss
                                            </Button>
                                        </Fragment>
                                    )}
                                </p>
                            </footer>
                        </div>
                    </form>
                </div>,
                document.getElementById("modal")
            )}
        </Fragment>
    );
}
