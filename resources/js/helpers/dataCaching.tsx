import { TransactionFilterSort } from "./interfaces";

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
export const transactionTypeDefault: ReactSelect = {
    value: transactionTypes[0].id.toString(),
    label: transactionTypes[0].name
}

export const transactionTypesFilter: TransactionType[] = [
    { id: 0, name: "All" },
    { id: 1, name: "Withdraw" },
    { id: 2, name: "Deposit" },
];
export const transactionTypeFilterDefault: ReactSelect = {
    label: transactionTypesFilter[0].name,
    value: transactionTypesFilter[0].id.toString(),
};

export const transactionFilterDates: ReactSelect[] = [
    {value: "all", label: "All"},
    {value: "current_month", label: "Only - Current Month"},
    {value: "last_month", label: "Only - Last Month"},
    {value: "last_3_months", label: "All - last 3 Months"},
];

export const transactionDateFilterDefault: ReactSelect = transactionFilterDates[0]

export function buildCurrencyLabel(currency: Currency) {
    return `${currency.code}`;
}

export interface ReactSelect {
    value: string;
    label: string;
}
