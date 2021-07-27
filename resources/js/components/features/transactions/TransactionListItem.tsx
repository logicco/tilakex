import {Transaction, showDeleteModal} from "./transactionSlice";
import {Account} from "../accounts/accountsSlice";
import IconButton from "../../IconButton";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useAppDispatch} from "../../../helpers/hooks";
import { appDateFormat } from "../../../helpers/date";

interface Props {
    account: Account
    transaction: Transaction,
    selectTransaction: (transaction: Transaction) => void,
}

export default function TransactionListItem({transaction, account, selectTransaction}: Props) {
    var t = transaction;
    var dispatch = useAppDispatch();
    return (
        <tr>
            <td>{account.name}</td>
            <td>{account.currency.symbol}{t.amount}</td>
            <td>{appDateFormat(t.date)}</td>
            <td>{t.category.parent ? `${t.category.parent.name}:${t.category.name}` : t.category.name}</td>
            <td>{t.payee.name}</td>
            <td>{t.transaction_type.name}</td>
            <td>{t.notes ?? "None"}</td>
            <td>
                <IconButton onClick={() => selectTransaction(transaction)} icon={faEdit} classes={"is-primary is-outlined"}/>
                &nbsp;
                <IconButton onClick={() => dispatch(showDeleteModal({
                    account_id: account.id.toString(),
                    transaction_id: t.id.toString()
                }))} icon={faTrash} classes={"is-danger is-outlined"}/>
            </td>
        </tr>
    )
}
