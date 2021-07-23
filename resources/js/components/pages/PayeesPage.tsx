import AuthLayout from "../AuthLayout";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../helpers/hooks";
import { useEffect } from "react";
import { getPayees, showPayeeModal } from "../features/payee/payeeSlice";
import IconButton from "../IconButton";
import { EnumModalType } from "../../helpers/enums";
import LoadingSpinner from "../LoadingSpinner";
import List from "../List";
import PayeeItem from "../features/payee/PayeeItem";
import FlashMessage from "../FlashMessage";

export default function PayeesPage() {
    var dispatch = useAppDispatch();
    var payees = useAppSelector((s) => s.payee.entities);
    var loading = useAppSelector((s) => s.payee.loading);

    useEffect(() => {
        if (payees.length === 0) {
            dispatch(getPayees());
        }
    }, []);

    function _showPayModal() {
        dispatch(showPayeeModal({ type: EnumModalType.add }));
    }

    return (
        <AuthLayout>
            <section className="columns">
                <article className="column">
                    <h1 className="title">Payees</h1>
                </article>
                <article className="column has-text-right">
                    <IconButton
                        onClick={_showPayModal}
                        classes="is-primary is-outlined"
                        icon={faPlus}
                        text="Payee"
                    />
                </article>
            </section>
            {loading === "pending" && <LoadingSpinner />}
            {loading === "succeeded" && payees.length === 0 && (
                <FlashMessage message="No Payees Found" variant="warning" />
            )}
            {loading === "succeeded" && payees.length > 0 && (
                <section className="columns is-multiline">
                    {loading === "succeeded" && (
                        <List label="payee" items={payees} Item={PayeeItem} />
                    )}
                </section>
            )}
        </AuthLayout>
    );
}
