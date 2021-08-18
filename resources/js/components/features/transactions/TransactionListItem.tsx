import { Transaction, showDeleteModal } from "./transactionSlice";
import { Account } from "../accounts/accountsSlice";
import IconButton from "../../IconButton";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../../helpers/hooks";
import { appDateFormat } from "../../../helpers/date";
import { trimmed } from "../../../helpers/util";

interface Props {
    account: Account;
    transaction: Transaction;
    selectTransaction: (transaction: Transaction) => void;
}

export default function TransactionListItem({
    transaction,
    account,
    selectTransaction,
}: Props) {
    var t = transaction;
    var dispatch = useAppDispatch();
    return (
        <tr>
            <td>{appDateFormat(t.date)}</td>
            <td>
                {account.currency.symbol}
                {t.amount}
            </td>
            <td>
                {t.category.parent
                    ? trimmed(
                          `${t.category.parent.name}:${t.category.name}`,
                          16
                      )
                    : trimmed(t.category.name)}
            </td>
            <td>{trimmed(t.payee.name)}</td>
            <td>{trimmed(t.transaction_type.name)}</td>
            <td>{trimmed(t.notes) ?? "None"}</td>
            <td>
                <IconButton
                    onClick={() => selectTransaction(transaction)}
                    icon={faEdit}
                    classes={"is-primary is-outlined"}
                />
                &nbsp;
                <IconButton
                    onClick={() =>
                        dispatch(
                            showDeleteModal({
                                account_id: account.id.toString(),
                                transaction_id: t.id.toString(),
                            })
                        )
                    }
                    icon={faTrash}
                    classes={"is-danger is-outlined"}
                />
            </td>
        </tr>
    );
}
