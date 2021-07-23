import { createAsyncThunk, createSlice, ThunkAction } from "@reduxjs/toolkit";
import {Loading} from "../../../helpers/interfaces";
import { isAuth, resetAuth, setAuth } from "../../../helpers/auth";
import axios from "axios";
import { buildAppError, buildStateError, StateError, ThunkError} from "../../../helpers/errorHandling";

interface AuthState {
    auth: boolean,
    loading: Loading,
    error: StateError
}

export interface LoginRequestForm {
    email: string, password: string
}

export interface RegisterRequestForm {
    email: string, password: string, name: string
}

const initialState: AuthState = {
    auth: isAuth(),
    loading: "idle",
    error: null,
}

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            var res = await axios.post("/auth/logout");
            return await res.data;
        } catch (err) {
            if(!err.response) { throw err }
            return rejectWithValue(err.response.data);
        }

    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data: LoginRequestForm, {rejectWithValue, dispatch}) => {
        try {
            await axios.get("/sanctum/csrf-cookie");
            var res = await axios.post("/auth/login", data);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch))
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state) {
            setAuth();
            state.auth = true;
        },
        logout(state) {
            resetAuth();
            state.auth = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = "pending";
        }),
        builder.addCase(loginUser.fulfilled, (state, action) => {
            setAuth();
            state.auth = true;
            state.error = null;
            state.loading = "succeeded";
        }),
        builder.addCase(loginUser.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError)
            state.loading = "failed"
        })
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = "pending";
        }),
        builder.addCase(logoutUser.fulfilled, (state, action) => {
            resetAuth();
            state.error = null,
            state.auth = false,
            state.loading = "succeeded";
        }),
        builder.addCase(logoutUser.rejected, (state, action) => {
            console.log(action);
            state.loading = "failed"
        })
    }
})

export const { logout } = authSlice.actions;

export default authSlice;
