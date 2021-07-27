import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {Loading} from "../../../helpers/interfaces";
import axios from "axios";
import {buildAppError, StateError, buildStateError, ThunkError} from "../../../helpers/errorHandling";


interface User {
    id: number,
    email: string,
    name: string,
    isEmailVerified: boolean
    created_at: string
}

interface ProfileState {
    user: User,
    loading: Loading,
    error: StateError,
    loadingMutation: Loading,
}

const initialState: ProfileState = {
    user: null,
    loading: "idle",
    error: null,
    loadingMutation: "idle",
}

export const getUser = createAsyncThunk(
    "user/getUser",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.get(`/user`);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)

export const updateProfile = createAsyncThunk(
    "user/update",
    async (data: {name: string, email: string}, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.put(`/user/profile`, data);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)

export const resentVerificationEmail = createAsyncThunk(
    "user/resentVerificationEmail",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.post(`/email/verification-notification`);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)

function transform(payload: any) : User {
    return {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        isEmailVerified: payload.is_email_verified,
        created_at: payload.created_at
    }
}

const userSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        resetUserState(state) {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder.addCase(resentVerificationEmail.pending, (state) => {
            state.loadingMutation = "pending";
        })
        builder.addCase(resentVerificationEmail.fulfilled, (state, action) => {
            state.error = null
            state.loadingMutation = "succeeded";
        })
        builder.addCase(resentVerificationEmail.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loadingMutation = "failed";
        })
        builder.addCase(updateProfile.pending, (state) => {
            state.loadingMutation = "pending";
        })
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.user = transform(action.payload);
            state.error = null
            state.loadingMutation = "succeeded";
        })
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loadingMutation = "failed";
        })
        builder.addCase(getUser.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.user = transform(action.payload);
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(getUser.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
    }
})

export const { resetUserState } = userSlice.actions
export default userSlice;
