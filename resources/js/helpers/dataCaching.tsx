import { TransactionFilterDate, TransactionFilterSort } from "./interfaces";

export interface Currency {
    id: number;
    name: string;
    code: string;
    symbol: string;
}

export interface TransactionType {
    id: number;
    name: string;
}

export const sortList: TransactionFilterSort[] = ["date"];

export const currencies: Currency[] = [
    { id: 1, name: "Canada", code: "CAD", symbol: "$" },
    { id: 2, name: "USA", code: "USD", symbol: "$" },
    { id: 3, name: "India", code: "INR", symbol: "₹" },
];

export const transactionTypes: TransactionType[] = [
    { id: 1, name: "Withdraw" },
    { id: 2, name: "Deposit" },
];

export const transactionTypesFilter: TransactionType[] = [
    { id: 0, name: "All" },
    { id: 1, name: "Withdraw" },
    { id: 2, name: "Deposit" },
];
export const transactionTypeFilterDefault: ReactSelect = {
    label: transactionTypesFilter[0].name,
    value: transactionTypesFilter[0].id.toString(),
};

export const transactionFilterDates: TransactionFilterDate[] = [
    "all",
    "current_month",
    "last_month",
    "last_3_months",
];

export function buildCurrencyLabel(currency: Currency) {
    return `${currency.code}`;
}

export interface ReactSelect {
    value: string;
    label: string;
}
