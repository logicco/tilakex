import {EnumModalType} from "./enums";

export interface ShowModal<T> {
    type: EnumModalType,
    data?: T,
    options?: any
}

export type Mode = "add" | "edit" | "none";
export type Loading = "idle" | "pending" | "succeeded" | "failed";
//export type TransactionFilterDate = "all" | "current_month" | "last_month" | "last_3_months"
export type TransactionFilterSort = "date"
