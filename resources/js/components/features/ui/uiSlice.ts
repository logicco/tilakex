import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const DEFAULT_ERR_MESSAGE = "Something Went Wrong";

interface UIState {
    flash: { visible: boolean; message: string, variant: string };
}

const initialState: UIState = {
    flash: { visible: false, message: DEFAULT_ERR_MESSAGE, variant: "danger" },
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        flashMessage(state, action: PayloadAction<{message: string, variant?: string}>) {
            state.flash.visible = true;
            state.flash.message = action.payload.message;
            state.flash.variant = action.payload.variant ?? "danger";
        },
        dissmissFlashMessage(state) {
            state.flash = initialState.flash;
        },
    },
});

export const { flashMessage, dissmissFlashMessage } = uiSlice.actions
export default uiSlice;
