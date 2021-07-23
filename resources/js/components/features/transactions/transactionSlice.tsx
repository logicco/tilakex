import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Payee} from "../payee/payeeSlice";
import { RawCategory} from "../categories/categorySlice";
import {Account} from "../accounts/accountsSlice";
import {Loading} from "../../../helpers/interfaces";
import {buildAppError, buildStateError, StateError, ThunkError} from "../../../helpers/errorHandling";
import axios from "axios";

export interface TransactionType { id: number; name: string }
var defaultModalState = {visible: false, account_id: "", transaction_id:  ""}

export interface Transaction {
    id: number;
    date: string;
    amount: number;
    notes: string | null;
    void: boolean;
    category: RawCategory;
    payee: Payee;
    transaction_type: TransactionType
    created_at: string;
}

export interface Links {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

interface TransactionsState {
    account: Account;
    entities: {
        data: Transaction[],
        links: Links
        meta: {
            current_page: number;
            last_page: number;
            from: number;
            per_page: number;
        };
    }
    loading: Loading,
    modal: {visible: boolean, account_id: string, transaction_id: string}
    error: StateError;
}

var initialState: TransactionsState = {
    account: {
        id: 0,
        name: "",
        created_at: "",
        is_default: false,
        currency: {id: 0, name: "", code: "", symbol: ""},
    },
    entities: {
        data: [],
        links: {
            first: "",
            last: "",
            next: null,
            prev: null,
        },
        meta: {current_page: 1, last_page: 1, from: 1, per_page: 2},
    },
    modal: defaultModalState,
    loading: "idle",
    error: null,
};



export interface AddTransactionFormRequest {
    account_id: string,
    form: TransactionFormRequest
}

export interface TransactionFormRequest {
    date: string,
    amount: string,
    notes?: string,
    category_id: string,
    payee_id: string,
    transaction_type_id: string,
}

export interface UpdateTransactionRequest {
    account_id: string
    transaction_id: string,
    form: TransactionFormRequest
}

function transform(data: any): TransactionsState {
    return {
        account: data.account,
        entities: {
            data: data.transactions.data,
            links: data.transactions.links,
            meta: {
                current_page: data.transactions.meta.current_page,
                from: data.transactions.meta.from,
                last_page: data.transactions.meta.last_page,
                per_page: data.transactions.meta.per_page,
            },
        },
        modal: defaultModalState,
        loading: "succeeded",
        error: null,
    };
}


export const getTransactions = createAsyncThunk(
    "transaction/get",
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.get(`/accounts/${id}/transactions`);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)

export const addTransaction = createAsyncThunk(
    "transaction/add",
    async (data: AddTransactionFormRequest, { rejectWithValue, dispatch }) => {
        try {
            var formData = {
                date: data.form.date,
                amount: data.form.amount,
                notes: data.form.notes,
                payee_id: data.form.payee_id,
                category_id: data.form.category_id,
                transaction_type_id: data.form.transaction_type_id
            };
            var res = await axios.post(`/accounts/${data.account_id}/transactions`, formData);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)

export const updateTransaction = createAsyncThunk(
    "transaction/update",
    async (data: UpdateTransactionRequest, { rejectWithValue, dispatch }) => {
        try {
            var formData = {
                date: data.form.date,
                amount: data.form.amount,
                notes: data.form.notes,
                payee_id: data.form.payee_id,
                category_id: data.form.category_id,
                transaction_type_id: data.form.transaction_type_id
            };
            var res = await axios.put(`/accounts/${data.account_id}/transactions/${data.transaction_id}`, formData);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)

export const deleteTransaction = createAsyncThunk(
    "transaction/delete",
    async (data: {account_id: string, transaction_id: string}, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.delete(`/accounts/${data.account_id}/transactions/${data.transaction_id}`);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)


const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        clearTransactions(state, action: PayloadAction<Account>) {
            if(state.account.id === action.payload.id) {
                state.account = initialState.account;
                state.entities = initialState.entities;
                state.error = null;
                state.loading = initialState.loading;
                state.modal = initialState.modal;
            }
        },
        updateAccount(state, action: PayloadAction<Account>){
            if(state.account.id === action.payload.id) {
                state.account = action.payload;
            }
        },
        showDeleteModal(state, action: PayloadAction<{account_id: string, transaction_id: string}>) {
            state.modal.visible = true;
            state.modal.account_id = action.payload.account_id;
            state.modal.transaction_id = action.payload.transaction_id;
        },
        hideDeleteModal(state) {
            state.modal = defaultModalState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(deleteTransaction.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(deleteTransaction.fulfilled, (state, action) => {
            state.entities.data = state.entities.data.filter(t => t.id !== action.payload.id);
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(deleteTransaction.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
        builder.addCase(updateTransaction.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(updateTransaction.fulfilled, (state, action) => {
            var index = state.entities.data.findIndex(t => t.id === action.payload.id);
            if(index !== -1) {
                state.entities.data[index] = action.payload;
            }
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(updateTransaction.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
        builder.addCase(addTransaction.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(addTransaction.fulfilled, (state, action) => {
            state.entities.data.push(action.payload)
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(addTransaction.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
        builder.addCase(getTransactions.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(getTransactions.fulfilled, (state, action) => {
            var transformer = transform(action.payload);
            state.entities = transformer.entities;
            state.account = transformer.account;
            state.entities.links = transformer.entities.links;
            state.entities.meta = transformer.entities.meta;
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(getTransactions.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
    }
})

export const { showDeleteModal, hideDeleteModal, clearTransactions, updateAccount } = transactionSlice.actions
export default transactionSlice;
