import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {Loading, ShowModal} from "../../../helpers/interfaces";
import axios from "axios";
import {ThunkError, buildAppError, buildStateError} from "../../../helpers/errorHandling";
import {EnumModalType} from "../../../helpers/enums";
import {BaseModalState, BaseState} from "../../../store";

const payeeDefaultModalState: BaseModalState<Payee> = {
    visible: false,
    error: null,
    data: null,
    loading: "idle",
}
export interface Payee {
    id: number,
    name: string,
    created_at: string
}

const initialState: BaseState<Payee> = {
    entities: [],
    loading: "idle",
    error: null,
    modal: payeeDefaultModalState
}

export const getPayees = createAsyncThunk(
    "payees/all",
    async (_, {rejectWithValue, dispatch}) => {
        try {
            var res = await axios.get("/payees");
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
);

export const addPayee = createAsyncThunk(
    "payees/add",
    async (name: string, {rejectWithValue}) => {
        try {
            var res = await axios.post("/payees", {name});
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err));
        }
    }
);

export const updatePayee = createAsyncThunk(
    "payees/update",
    async (data: {name: string, id: number}, {rejectWithValue}) => {
        try {
            var res = await axios.put(`/payees/${data.id}`, {name: data.name});
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err));
        }
    }
);

export const deletePayee = createAsyncThunk(
    "payees/delete",
    async (id: number, {rejectWithValue}) => {
        try {
            var res = await axios.delete(`/payees/${id}`);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err));
        }
    }
);


const payeeSlice = createSlice({
    name: "payee",
    initialState,
    reducers: {
        showPayeeModal(state, action: PayloadAction<ShowModal<Payee>>) {
            switch (action.payload.type) {
                case EnumModalType.add:
                    state.modal.visible = true;
                    break;
                case EnumModalType.edit:
                    state.modal.visible = true;
                    state.modal.data = action.payload.data;
                    break;
                default:
                    return;
            }
        },
        hidePayeeModals(state) {
          state.modal = payeeDefaultModalState
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updatePayee.pending, (state) => {
            state.modal.loading = "pending";
        })
        builder.addCase(updatePayee.fulfilled, (state, action) => {
            var index  = state.entities.findIndex(p => p.id === action.payload.id);
            if(index !== -1) {
                state.entities[index] = action.payload;
            }
            state.modal.error = null
            state.modal.loading = "succeeded";
        })
        builder.addCase(updatePayee.rejected, (state, action) => {
            state.modal.error = buildStateError(action.payload as ThunkError);
            state.modal.loading = "failed";
        })
        builder.addCase(deletePayee.pending, (state) => {
            state.modal.loading = "pending";
        })
        builder.addCase(deletePayee.fulfilled, (state, action) => {
            state.entities = state.entities.filter(p => p.id !== action.payload.id);
            state.modal.error = null
            state.modal.loading = "succeeded";
        })
        builder.addCase(deletePayee.rejected, (state, action) => {
            state.modal.error = buildStateError(action.payload as ThunkError);
            state.modal.loading = "failed";
        })
        builder.addCase(addPayee.pending, (state) => {
            state.modal.loading = "pending";
        })
        builder.addCase(addPayee.fulfilled, (state, action) => {
            state.entities.push(action.payload);
            state.modal.error = null
            state.modal.loading = "succeeded";
        })
        builder.addCase(addPayee.rejected, (state, action) => {
            var err = action.payload as ThunkError;
            state.modal.error = buildStateError(err);
            state.modal.loading = "failed";
        })
        builder.addCase(getPayees.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(getPayees.fulfilled, (state, action) => {
            state.entities = action.payload
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(getPayees.rejected, (state, action) => {
            var err = action.payload as ThunkError;
            state.error = buildStateError(err);
            state.loading = "failed";
        })
    }
})

export const { showPayeeModal, hidePayeeModals } = payeeSlice.actions
export default payeeSlice;
