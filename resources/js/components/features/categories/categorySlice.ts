import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Loading} from "../../../helpers/interfaces";
import {buildAppError, buildStateError, StateError, ThunkError} from "../../../helpers/errorHandling";
import axios from "axios";

const categoryDefaultModalState: ModalState = {
    visible: false,
    data: null
}

export interface RawEntityCategory {
    id: number, name: string, children?: BaseCategory[], created_at: string
}

export interface RawCategory {
    id: number,
    name: string,
    totalChildren?: number,
    parent: null | BaseCategory,
    created_at: string
}

export interface BaseCategory {
    id: number;
    name: string;
    created_at: string;
}

export interface EntityCategory {
    id: number;
    name: string;
    children: BaseCategory[];
    created_at: string;
}

interface ModalState {
    visible: boolean,
    data?: RawCategory
}

interface CategoryState {
    entities: EntityCategory[];
    loading: Loading;
    error: StateError;
    modal: ModalState;
}

const initialState: CategoryState = {
    entities: [], loading: "idle", error: null, modal: categoryDefaultModalState
}

export function transformIntoRawCategories(categories: EntityCategory[]): RawCategory[] {
    var transformed: RawCategory[] = [];
    categories.forEach(c => {
        let category: RawCategory = {
            id: c.id,
            name: c.name,
            parent: null,
            created_at: c.created_at
        }
        transformed.push(category);
        if (c.children && c.children.length > 0) {
            c.children.forEach(cc => {
                let child: RawCategory = {
                    id: cc.id,
                    name: cc.name,
                    parent: category,
                    created_at: cc.created_at
                }
                transformed.push(child);
            })
        }
    })
    return transformed;
}

export const getCategories = createAsyncThunk(
    "category/all",
    async (_, {rejectWithValue, dispatch}) => {
        try {
            var res = await axios.get("/categories");
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
);

export const addCategory = createAsyncThunk(
    "category/add",
    async (name: string, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.post("/categories", {name});
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)

export const updateCategory = createAsyncThunk(
    "category/update",
    async (data: {id: number, name}, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.put(`/categories/${data.id}`, {name: data.name});
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)


export const addSubCategory = createAsyncThunk(
    "category/add-subcategory",
    async (data: {id: number, name}, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.post(`/categories/${data.id}/add`, {name: data.name});
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)


export const deleteCategory = createAsyncThunk(
    "category/delete",
    async (id: number, { rejectWithValue, dispatch }) => {
        try {
            var res = await axios.delete(`/categories/${id}`);
            return await res.data;
        } catch (err) {
            return rejectWithValue(buildAppError(err, dispatch));
        }
    }
)

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        resetCategoryState(state){
            return initialState;
        },
        selectCategory(state, action: PayloadAction<RawCategory>) {
          state.modal.data = action.payload;
        },
        showCategoryModal(state, action: PayloadAction<RawCategory>) {
            state.modal.visible = true;
            state.modal.data = action.payload;
        },
        hideCategoryModals(state) {
            state.modal = categoryDefaultModalState;
        },
        resetErrors(state){
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(deleteCategory.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            state.entities = action.payload
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(deleteCategory.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
        builder.addCase(addSubCategory.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(addSubCategory.fulfilled, (state, action) => {
            var parent_id = action.payload.parent_id;
            var insertedCategory = action.payload.inserted;
            var categories = state.entities;
            for (let category of categories) {
                if (category.id === parent_id) {
                    category.children.push(insertedCategory);
                    break;
                }
            }
            state.entities = categories;
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(addSubCategory.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
        builder.addCase(updateCategory.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(updateCategory.fulfilled, (state, action) => {
            var updatedCategory = action.payload;
            var categories = state.entities;

            //category is parent ->
            if (updatedCategory.children) {
                var parentIndex = categories.findIndex(
                    (c) => c.id === updatedCategory.id
                );
                if (parentIndex !== -1) {
                    categories[parentIndex] = updatedCategory;
                }
            } else { //category is child ->
                for (let category of categories) {
                    if(category.children.length > 0) {
                        for (let child of category.children) {
                            if(child.id === updatedCategory.id) {
                                child.name = updatedCategory.name;
                                break;
                            }
                        }
                    }
                }
            }

            state.entities = categories;
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(updateCategory.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
        builder.addCase(addCategory.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(addCategory.fulfilled, (state, action) => {
            state.entities.push(action.payload)
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(addCategory.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
        builder.addCase(getCategories.pending, (state) => {
            state.loading = "pending";
        })
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.entities = action.payload
            state.error = null
            state.loading = "succeeded";
        })
        builder.addCase(getCategories.rejected, (state, action) => {
            state.error = buildStateError(action.payload as ThunkError);
            state.loading = "failed";
        })
    }
})

export const {showCategoryModal, hideCategoryModals, selectCategory, resetErrors, resetCategoryState} = categorySlice.actions;
export default categorySlice
