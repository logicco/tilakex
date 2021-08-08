import { EnumModalType } from "../../../helpers/enums";
import { Mode } from "../../../helpers/interfaces";
import { useAppDispatch, useAppSelector } from "../../../helpers/hooks";
import {
    addTransaction,
    Transaction,
    updateTransaction,
} from "./transactionSlice";
import { Account } from "../accounts/accountsSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import IconButton from "../../IconButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { showPayeeModal } from "../payee/payeeSlice";
import { showCategoryModal } from "../categories/categorySlice";
import LabelInput, { LabelController } from "../../LabelInput";
import AccountController from "../../AccountController";
import TransactionTypeController from "../../TransactionTypeController";
import PayeeController from "../../PayeeController";
import CategoryController from "../../CategoryController";
import Button from "../../Button";
import { ReactSelect } from "../../../helpers/dataCaching";

const amountRules = {
    required: "Amount is required",
    pattern: {
        value: /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/,
        message:
            "Amount must be a positive number, greater than 0 and only containing 2 decimal places",
    },
};

const dateRules = {
    required: "Date is required",
    pattern: {
        value: /^20[0-2][0-9]-((0[1-9])|(1[0-2]))-([0-2][1-9]|3[0-1])$/,
        message: "Date is invalid",
    },
};

interface Props {
    mode: Mode;
    transaction?: Transaction;
    account: Account;
    transactionSaved: () => void;
}

type Inputs = {
    amount: string;
    category: ReactSelect;
    type: ReactSelect;
    payee: ReactSelect;
    account: ReactSelect;
    date: string;
    notes: string;
};

export default function TransactionForm({
    mode,
    transaction,
    account,
    transactionSaved,
}: Props) {
    var t = transaction;
    var dispatch = useAppDispatch();
    var error = useAppSelector((s) => s.transaction.error);
    var loading = useAppSelector((s) => s.transaction.loading);
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        control,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();

    useEffect(() => {
        setValue("amount", amountDefaultValue());
        setValue("date", dateDefaultValue());
    }, []);

    function isLoading() {
        return loading === "pending";
    }

    function isEditMode() {
        return mode === "edit";
    }

    function isAddMode() {
        return mode === "add";
    }

    function amountDefaultValue() {
        return isEditMode() ? t.amount.toString() : "";
    }

    function dateDefaultValue() {
        return isEditMode() ? t.date : "";
    }

    function payeeDefaultValue() {
        return isEditMode() ? { value: t.payee.id, label: t.payee.name } : null;
    }

    const categoryDefaultValue = () => {
        if (isEditMode()) {
            var category = transaction.category;
            return {
                value: category.id.toString(),
                label: category.parent
                    ? `${category.parent.name}:${category.name}`
                    : category.name,
            };
        }
        return null;
    };

    function typeDefaultValue() {
        return isEditMode()
            ? { value: t.transaction_type.id, label: t.transaction_type.name }
            : null;
    }

    const submitSuccess: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        if (isAddMode()) {
            console.log("Should add");
            dispatch(
                addTransaction({
                    account_id: account.id.toString(),
                    form: {
                        amount: data.amount,
                        date: data.date,
                        notes: data.notes,
                        payee_id: data.payee.value,
                        category_id: data.category.value,
                        transaction_type_id: data.type.value,
                    },
                })
            ).then((action: any) => {
                if (!action.error) {
                    transactionSaved();
                }
            });
        }

        if (isEditMode()) {
            dispatch(
                updateTransaction({
                    account_id: account.id.toString(),
                    transaction_id: t.id.toString(),
                    form: {
                        amount: data.amount,
                        date: data.date,
                        notes: data.notes,
                        payee_id: data.payee.value,
                        category_id: data.category.value,
                        transaction_type_id: data.type.value,
                    },
                })
            ).then((action: any) => {
                if (!action.error) {
                    transactionSaved();
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(submitSuccess)}>
            <section className="columns">
                <article className="column">
                    <LabelController
                        label="Account"
                        name="account"
                        error={error}
                        clienterrors={clientErrors}
                        controller={
                            <AccountController
                                control={control}
                                defaultValue={{
                                    value: account.id.toString(),
                                    label: account.name,
                                }}
                                name="account"
                            />
                        }
                    />
                </article>
                <article className="column">
                    <LabelInput
                        label="Amount"
                        placeholder="Enter amount"
                        name="amount"
                        type="text"
                        error={error}
                        clienterrors={clientErrors}
                        register={{ ...register("amount", amountRules) }}
                        defaultValue={getValues().amount}
                    />
                </article>
                <article className="column">
                    <LabelInput
                        label="Date"
                        placeholder="Enter date"
                        name="date"
                        type="date"
                        error={error}
                        clienterrors={clientErrors}
                        register={{ ...register("date", dateRules) }}
                        defaultValue={getValues().date}
                    />
                </article>
            </section>
            <section className="columns">
                <article className="column">
                    <LabelController
                        label="Transaction Type"
                        name="type"
                        error={error}
                        clienterrors={clientErrors}
                        controller={
                            <TransactionTypeController
                                control={control}
                                defaultValue={typeDefaultValue()}
                                name="type"
                            />
                        }
                    />
                </article>

                <article className="column">
                    <section className="columns">
                        <article className="column is-2 mt-auto">
                            <IconButton
                                onClick={() =>
                                    dispatch(
                                        showPayeeModal({
                                            type: EnumModalType.add,
                                        })
                                    )
                                }
                                icon={faPlus}
                                classes="is-primary is-outlined"
                            />
                        </article>
                        <article className="column">
                            <LabelController
                                label="Payee"
                                name="payee"
                                error={error}
                                clienterrors={clientErrors}
                                controller={
                                    <PayeeController
                                        control={control}
                                        defaultValue={payeeDefaultValue()}
                                        name="payee"
                                    />
                                }
                            />
                        </article>
                    </section>
                </article>

                <article className="column">
                    <section className="columns">
                        <article className="column is-2 mt-auto">
                            <IconButton
                                onClick={() => dispatch(showCategoryModal())}
                                icon={faPlus}
                                classes="is-primary is-outlined"
                            />
                        </article>
                        <article className="column">
                            <LabelController
                                label="Category"
                                name="category"
                                error={error}
                                clienterrors={clientErrors}
                                controller={
                                    <CategoryController
                                        control={control}
                                        defaultValue={categoryDefaultValue()}
                                        name="category"
                                    />
                                }
                            />
                        </article>
                    </section>
                </article>
            </section>
            <section className="columns">
                <article className="column">
                    <div className="field">
                        <label className="label">Notes (Optional)</label>
                        <textarea
                            {...register("notes")}
                            className="textarea"
                            placeholder="e.g. Hello world"
                        ></textarea>
                    </div>
                </article>
            </section>
            <section className="columns">
                <Button
                    type="submit"
                    classes="is-fullwidth"
                    loading={isLoading().toString()}
                >
                    Save
                </Button>
            </section>
        </form>
    );
}
