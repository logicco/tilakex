import TransactionTypeSelectControl from "../../TransactionTypeSelectControl";
import PayeeSelectControl from "../../PayeeSelectControl";
import AccountSelectControl from "../../AccountSelectControl";
import CategorySelectControl from "../../CategorySelectControl";
import { EnumModalType, Mode } from "../../../helpers/enums";
import { useAppDispatch, useAppSelector } from "../../../helpers/hooks";
import {
    addTransaction,
    Transaction,
    updateTransaction,
} from "./transactionSlice";
import { Account } from "../accounts/accountsSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import IconButton from "../../IconButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { showPayeeModal } from "../payee/payeeSlice";
import { showCategoryModal } from "../categories/categorySlice";

interface Props {
    mode: Mode;
    transaction?: Transaction;
    account: Account;
    transactionSaved: () => void;
}

type Inputs = {
    amount: string;
    category_id: string;
    type_id: string;
    payee_id: string;
    account_id: string;
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

    function hasDbError(key: string) {
        return error && error.errors && error.errors[key];
    }

    function getDbError(key: string) {
        return error.errors[key][0];
    }

    function isLoading() {
        return loading === "pending";
    }

    function isEditMode() {
        return mode === Mode.edit;
    }

    function isAddMode() {
        return mode === Mode.add;
    }

    function amountDefaultValue() {
        return isEditMode() ? t.amount.toString() : "";
    }

    function dateDefaultValue() {
        return isEditMode() ? t.date : "";
    }

    function payeeDefaultValue(): any {
        return isEditMode() ? { value: t.payee.id, label: t.payee.name } : "";
    }

    const categoryDefaultValue = (): any => {
        if (isEditMode()) {
            var category = transaction.category;
            return {
                value: category.id.toString(),
                label: category.parent
                    ? `${category.parent.name}:${category.name}`
                    : category.name,
            };
        }
        return "";
    };

    function typeDefaultValue(): any {
        return isEditMode()
            ? { value: t.transaction_type.id, label: t.transaction_type.name }
            : "";
    }

    const submitSuccess: SubmitHandler<Inputs> = (data) => {
        if (isAddMode()) {
            console.log("Should add");
            dispatch(
                addTransaction({
                    account_id: account.id.toString(),
                    form: {
                        amount: data.amount,
                        date: data.date,
                        notes: data.notes,
                        payee_id: data.payee_id,
                        category_id: data.category_id,
                        transaction_type_id: data.type_id,
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
                        payee_id: data.payee_id,
                        category_id: data.category_id,
                        transaction_type_id: data.type_id,
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
                    <div className="field">
                        <label className="label">Account</label>
                        <Controller
                            defaultValue={account.id.toString()}
                            control={control}
                            render={(props) => (
                                <AccountSelectControl
                                    onChange={(option) =>
                                        props.field.onChange(option.value)
                                    }
                                    {...props}
                                    defaultValue={{
                                        value: account.id.toString(),
                                        label: account.name,
                                    }}
                                />
                            )}
                            name={"account_id"}
                            rules={{ required: "Account is required" }}
                        />
                        {clientErrors.account_id && (
                            <span className="text-danger">
                                {clientErrors.account_id.message}
                            </span>
                        )}
                    </div>
                </article>
                <article className="column">
                    <div className="field">
                        <label className="label">Amount</label>
                        <div className="control">
                            <input
                                defaultValue={getValues().amount}
                                onChange={(e) =>
                                    setValue("amount", e.target.value)
                                }
                                {...register("amount", {
                                    required: "Amount is required",
                                    pattern: {
                                        value: /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/,
                                        message:
                                            "Amount must be a positive number, greater than 0 and only containing 2 decimal places",
                                    },
                                })}
                                className={`input ${
                                    hasDbError("amount") || clientErrors.amount
                                        ? "is-danger"
                                        : ""
                                }`}
                                type="text"
                                placeholder="Enter amount"
                            />
                            {hasDbError("amount") && (
                                <p className="help is-danger">
                                    {getDbError("amount")}
                                </p>
                            )}
                            {clientErrors.amount && (
                                <p className="help is-danger">
                                    {clientErrors.amount.message}
                                </p>
                            )}
                        </div>
                    </div>
                </article>
                <article className="column">
                    <div className="field">
                        <label className="label">Date</label>
                        <div className="control">
                            <input
                                defaultValue={getValues().date}
                                onChange={(e) =>
                                    setValue("date", e.target.value)
                                }
                                {...register("date", {
                                    required: "Date is required",
                                    pattern: {
                                        value: /^20[0-2][0-9]-((0[1-9])|(1[0-2]))-([0-2][1-9]|3[0-1])$/,
                                        message: "Date is invalid",
                                    },
                                })}
                                className={`input ${
                                    hasDbError("date") || clientErrors.date
                                        ? "is-danger"
                                        : ""
                                }`}
                                type="date"
                            />
                            {hasDbError("date") && (
                                <p className="help is-danger">
                                    {getDbError("date")}
                                </p>
                            )}
                            {clientErrors.date && (
                                <p className="help is-danger">
                                    {clientErrors.date.message}
                                </p>
                            )}
                        </div>
                    </div>
                </article>
            </section>
            <section className="columns">
                <article className="column">
                    <div className="field">
                        <label className="label">Transaction Type</label>
                        <Controller
                            control={control}
                            defaultValue={typeDefaultValue().value}
                            rules={{ required: "Transaction type is required" }}
                            render={(props) => (
                                <TransactionTypeSelectControl
                                    defaultValue={typeDefaultValue()}
                                    onChange={(option) => {
                                        props.field.onChange(option.value);
                                    }}
                                    {...props}
                                />
                            )}
                            name="type_id"
                        />
                        {hasDbError("transaction_type_id") && (
                            <p className="help is-danger">
                                {getDbError("transaction_type_id")}
                            </p>
                        )}
                        {clientErrors.type_id && (
                            <p className="help is-danger">
                                {clientErrors.type_id.message}
                            </p>
                        )}
                    </div>
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
                            <div className="field">
                                <label className="label">Payee</label>
                                <Controller
                                    control={control}
                                    defaultValue={payeeDefaultValue().value}
                                    rules={{ required: "Payee is required" }}
                                    render={(props) => (
                                        <PayeeSelectControl
                                            styles={{ borderColor: "red" }}
                                            defaultValue={payeeDefaultValue()}
                                            onChange={(option) => {
                                                props.field.onChange(
                                                    option.value
                                                );
                                            }}
                                            {...props}
                                        />
                                    )}
                                    name="payee_id"
                                />
                            </div>
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
                            <div className="field">
                                <label className="label">Category</label>
                                <Controller
                                    control={control}
                                    defaultValue={categoryDefaultValue().value}
                                    rules={{ required: "Category is required" }}
                                    render={(props) => (
                                        <CategorySelectControl
                                            defaultValue={categoryDefaultValue()}
                                            onChange={(option) => {
                                                props.field.onChange(
                                                    option.value
                                                );
                                            }}
                                            {...props}
                                        />
                                    )}
                                    name="category_id"
                                />
                                {hasDbError("category_id") && (
                                    <p className="help is-danger">
                                        {getDbError("category_id")}
                                    </p>
                                )}
                                {clientErrors.category_id && (
                                    <p className="help is-danger">
                                        {clientErrors.category_id.message}
                                    </p>
                                )}
                            </div>
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
                <button
                    type="submit"
                    className={`button is-primary is-fullwidth ${
                        isLoading() ? "is-loading" : ""
                    }`}
                >
                    {isLoading() ? "Saving..." : "Save"}
                </button>
            </section>
        </form>
    );
}
