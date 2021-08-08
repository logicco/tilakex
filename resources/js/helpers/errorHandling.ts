import {logout} from "../components/features/auth/authSlice";
import { flashMessage } from "../components/features/ui/uiSlice";

export interface ThunkError {
    status: number;
    message: string;
    data?: object;
}

export interface StateError {
    status: number,
    message: string,
    errors: any
}

export function buildStateError(err: ThunkError): StateError {
    return { status: err.status, message: err.message, errors: err.data }
}

/*
 * Build app error for rejected asyncThunk
 */
export function buildAppError(err: any, dispatch?: any): ThunkError {
    if(!err.response) { throw err; }
    var thunkError: ThunkError = {
        status: err.response.status,
        message: err.response.data.message,
    };
    if(thunkError.status === 401) {
        dispatch(logout());
    }else if (thunkError.status === 422) {  //data key only required when dealing with form errors
        thunkError.message = "";
        thunkError.data = err.response.data.errors;
    }else if(thunkError.status === 404) {
        return thunkError;
    }else{
        if(dispatch) {
            dispatch(flashMessage({message: thunkError.message, variant:"danger"}))
        }
    }

    return thunkError;
}

export function hasDbError(key: string, error: StateError) {
    return error && error.errors && error.errors[key];
}

export function getDbError(key: string, error: StateError) {
    return error.errors[key][0];
}
