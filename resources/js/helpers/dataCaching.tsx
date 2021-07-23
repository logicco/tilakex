import {Account} from "../components/features/accounts/accountsSlice";

export interface Currency {
    id: number,
    name: string,
    code: string,
    symbol: string,
}

export interface TransactionType {
    id: number, name: string
}

export const currencies: Currency[] = [
    { id: 1, name: "Canada", code: "CAD", symbol: "$" },
    { id: 2, name: "USA", code: "USD", symbol: "$" }
]

export const transactionTypes: TransactionType[] = [
    {id: 1, name: "Withdraw"},
    {id: 2, name: "Deposit"}
]

export function buildCurrencyLabel(currency: Currency) {
    return `${currency.code}`
}

export interface ReactSelect { value: string, label: string }
