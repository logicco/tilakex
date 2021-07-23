import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./components/features/auth/authSlice";
import uiSlice from "./components/features/ui/uiSlice";
import payeeSlice from "./components/features/payee/payeeSlice";
import {Loading} from "./helpers/interfaces";
import {StateError} from "./helpers/errorHandling";
import accountsSlice from "./components/features/accounts/accountsSlice";
import categorySlice from "./components/features/categories/categorySlice";
import transactionSlice from "./components/features/transactions/transactionSlice";
import userSlice from "./components/features/user/userSlice";

export interface BaseModalState<T> {
    visible: boolean,
    loading: Loading,
    data: T | null,
    error: StateError,
    options?: any
}

export interface BaseState<T> {
    entities: T[];
    loading: Loading;
    error: StateError;
    modal: BaseModalState<T>
}

export const getDefaultModalState = {
    visible: false,
    error: null,
    data: null,
    loading: "idle",
}

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        ui: uiSlice.reducer,
        payee: payeeSlice.reducer,
        account: accountsSlice.reducer,
        category: categorySlice.reducer,
        transaction: transactionSlice.reducer,
        profile: userSlice.reducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
