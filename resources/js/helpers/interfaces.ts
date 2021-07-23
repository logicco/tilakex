import {EnumModalType} from "./enums";

export interface ShowModal<T> {
    type: EnumModalType,
    data?: T,
    options?: any
}
export type Loading = "idle" | "pending" | "succeeded" | "failed";
