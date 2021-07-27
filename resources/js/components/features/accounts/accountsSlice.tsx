import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BaseModalState, BaseState} from "../../../store";
import {ShowModal} from "../../../helpers/interfaces";
import {EnumModalType} from "../../../helpers/enums";
import axios from "axios";
import {buildAppError, buildStateError, ThunkError} from "../../../helpers/errorHandling";
import {Currency} from "../../../helpers/dataCaching";
import { clearTransactions, updateAccount as updateTransactionAccount } from "../transactions/transactionSlice";

const accountDefaultModalState: BaseModalState<Account> = {
    visible: false,
    error: null,
    data: null,
    loading: "idle",
    options: { shouldDelete: false }
}

export interface Account {
    id: number;
    is_default: boolean;
    name: string;
    created_at: string;
    currency: Currency;
}

const initialState: BaseState<Account> = {
    entities: [],
    loading: "idle",
    error: null,
    modal: accountDefaultModalState
}

export const getAccounts = createAsyncThunk(
    "accounts/all",
    async (_, {rejectWithValue, dispatch}) => {
        try {
            var res = await axios.get("/accounts");
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
);

export const addAccount = createAsyncThunk(
    "accounts/add",
    async (data: { name: string, currency_id: string }, {rejectWithValue, dispatch}) => {
        try {
            var res = await axios.post("/accounts", data);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
);

export const updateAccount = createAsyncThunk(
    "accounts/update",
    async (data: { name: string, currency_id: string, account_id: string }, {rejectWithValue, dispatch}) => {
        try {
            var res = await axios.put(`/accounts/${data.account_id}`, {name: data.name, currency_id: data.currency_id});
            var account = await res.data;
            dispatch(updateTransactionAccount(account));
            return account;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
);

export const deleteAccount = createAsyncThunk(
    "accounts/delete",
    async (account_id: string, {rejectWithValue, dispatch}) => {
        try {
            var res = await axios.delete(`/accounts/${account_id}`);
            var account = await res.data;
            dispatch(clearTransactions(account))
            return account;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
);

const accountsSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        resetAccountState(state){
            return initialState
        },
        showAccountModal(state, action: PayloadAction<ShowModal<Account>>) {
            switch (action.payload.type) {
                case EnumModalType.add:
                    state.modal.visible = true;
                    state.modal.options = action.payload.options;
                    break;
                case EnumModalType.edit:
                    state.modal.visible = true;
                    state.modal.data = action.payload.data;
                    state.modal.options = action.payload.options;
                    break;
                default:
                    return;
            }
        },
        hideAccountModals(state) {
            state.modal = accountDefaultModalState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(deleteAccount.pending, (state) => {
            state.modal.loading = "pending";
        })
        builder.addCase(deleteAccount.fulfilled, (state, action) => {
            state.entities = state.entities.filter(a => a.id !== action.payload.id);
            state.modal.error = null
            state.modal.loading = "succeeded";
        })
        builder.addCase(deleteAccount.rejected, (state, action) => {
            state.modal.error = buildStateError(action.payload as ThunkError);
            state.modal.loading = "failed";
        })
        builder.addCase(updateAccount.pending, (state) => {
            state.modal.loading = "pending";
        })
        builder.addCase(updateAccount.fulfilled, (state, action) => {
            var index  = state.entities.findIndex(p => p.id === action.payload.id);
            if(index !== -1) {
                state.entities[index] = action.payload;
            }
            state.modal.error = null
            state.modal.loading = "succeeded";
        })
        builder.addCase(updateAccount.rejected, (state, action) => {
            state.modal.error = buildStateError(action.payload as ThunkError);
            state.modal.loading = "failed";
        })
        builder.addCase(addAccount.pending, (state) => {
            state.modal.loading = "pending";
        })
        builder.addCase(addAccount.fulfilled, (state, action) => {
            state.entities.push(action.payload);
            state.modal.error = null
            state.modal.loading = "succeeded";
        })
        builder.addCase(addAccount.rejected, (state, action) => {
            state.modal.error = buildStateError(action.payload as ThunkError);
            state.modal.loading = "failed";
        })
        builder.addCase(getAccounts.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(getAccounts.fulfilled, (state, action) => {
            state.entities = action.payload
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(getAccounts.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
    }
})
export const {showAccountModal, hideAccountModals, resetAccountState} = accountsSlice.actions;
export default accountsSlice;
