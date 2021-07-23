import {Links, Transaction} from "./transactionSlice";
import {Account} from "../accounts/accountsSlice";
import TransactionListItem from "./TransactionListItem";
import FlashMessage from "../../FlashMessage";

interface Props {
    transactions: Transaction[],
    account: Account,
    links: Links,
    selectTransaction: (transaction: Transaction) => void,
}

export default function TransactionsList({transactions, account, selectTransaction}: Props) {

    if(!account || transactions.length === 0) {
        return <FlashMessage variant={"warning"} message={"No Transactions Found"}/>
    }

    return (
        <table className="table is-fullwidth">
            <thead>
            <tr>
                <th>Account</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Payee</th>
                <th>Type</th>
                <th>Notes</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map(t => <TransactionListItem selectTransaction={selectTransaction} key={t.id} account={account} transaction={t}/>)}
            </tbody>
        </table>
    )
}
