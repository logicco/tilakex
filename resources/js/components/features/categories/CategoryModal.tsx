import {useAppDispatch, useAppSelector} from "../../../helpers/hooks";
import ReactDOM from "react-dom";
import {Fragment, useEffect, useRef, useState} from "react";
import {
    addCategory, addSubCategory, deleteCategory,
    getCategories,
    hideCategoryModals,
    resetErrors,
    selectCategory, updateCategory
} from "./categorySlice";
import {CategoriesList} from "./CategoriesList";
import LoadingSpinner from "../../LoadingSpinner";
import {Mode} from "../../../helpers/enums";
import IconButton from "../../IconButton";
import {faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import FlashMessage from "../../FlashMessage";


export default function CategoryModal(props) {
    var dispatch = useAppDispatch();
    var categories = useAppSelector(s => s.category.entities);
    var error = useAppSelector(s => s.category.error);
    var loading = useAppSelector(s => s.category.loading);
    var selectedCategory = useAppSelector(s => s.category.modal.data);
    var [mode, setMode] = useState(Mode.none);
    var [name, setName] = useState("");

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(getCategories());
        }
        if (selectedCategory) {
            setMode(Mode.edit);
        }
    }, [])

    function hasErrorMessage() {
        return error && !error.errors && error.message !== "";
    }

    function resetCategory() {
        setName("");
        setMode(Mode.none);
        dispatch(selectCategory(null));
    }

    function submitAddCategory(e) {
        e.preventDefault();

        if(mode === Mode.add) {
            //add new category
            if (!selectedCategory) {
                dispatch(addCategory(name)).then((action: any) => {
                    if (!action.error) resetCategory();
                });
                return;
            }

            //add new sub category
            if (isParentCategorySelected()) {
                dispatch(addSubCategory({
                    id: selectedCategory.id,
                    name: name
                })).then((action: any) => {
                    if (!action.error) resetCategory();
                });
                return;
            }
        }

        if(mode === Mode.edit) {
            dispatch(updateCategory({
                id: selectedCategory.id,
                name: name
            })).then((action: any) => {
                if (!action.error) resetCategory();
            });
            return;
        }

    }

    function submitDeleteCategory(e) {
        e.preventDefault();
        dispatch(deleteCategory(selectedCategory.id)).then((action: any) => {
            if (!action.error) { resetCategory(); }
        });
    }

    function closeModal() {
        dispatch(hideCategoryModals());
    }

    function isSubCategorySelected(): boolean {
        return Boolean(selectedCategory && selectedCategory.parent);
    }

    function isParentCategorySelected() {
        return selectedCategory && !selectedCategory.parent
    }

    function categoryInputPlacerHolder() {
        if (!selectedCategory) return "Enter new category";
        return "Enter new sub category";
    }

    function isLoading() {
        return loading === "pending"
    }

    function shouldDisableDeleteButton() {
        if (!selectedCategory) return false;
        if (isParentCategorySelected()) {
            if (selectedCategory.totalChildren > 0) {
                return false;
            }
        }
        return true;
    }

    return (
        <Fragment>
            {ReactDOM.createPortal(
                <div className="modal is-active">
                    <div onClick={closeModal} className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Categories {mode === Mode.edit ? "Edit" : ""}</p>
                            <button onClick={closeModal} className="delete" aria-label="close"/>
                        </header>
                        <section className="modal-card-body">
                            {hasErrorMessage() && <FlashMessage variant={"danger"} message={error.message}/>}
                            <section className="columns mt-2">
                                {mode !== Mode.none && <article className="column is-8">
                                    <form onSubmit={submitAddCategory}>
                                        <div className="field has-addons">
                                            <div className="control">
                                                <input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className={`input ${error && error.errors && error.errors.name ? "is-danger" : ""}`}
                                                    type="text" placeholder={categoryInputPlacerHolder()}/>
                                            </div>
                                            <div className="control">
                                                <button type="submit"
                                                        className={`button is-primary ${isLoading() ? "is-loading" : ""}`}>
                                                    {mode === Mode.add ? "Add":"Update"}
                                                </button>
                                                &nbsp;
                                                <button disabled={isLoading()} onClick={(e) => {
                                                    e.preventDefault();
                                                    dispatch(resetErrors());
                                                    setMode(Mode.none);
                                                }}
                                                        className="button is-danger">
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                </article>}
                                <article className="column">
                                    <div className="is-pulled-right">
                                        {mode === Mode.none && <div className="field has-addons">
                                            <p className="control">
                                                <IconButton type="button" classes={"is-primary"}
                                                            onClick={() => setMode(Mode.add)}
                                                            disabled={isSubCategorySelected()} icon={faPlus}/>
                                            </p>
                                            <p className="control">
                                                <IconButton onClick={() => {
                                                    setMode(Mode.edit);
                                                    setName(selectedCategory.name);
                                                }} classes={"is-info"} disabled={!selectedCategory}
                                                            icon={faEdit}/>
                                            </p>
                                            <form onSubmit={submitDeleteCategory}>
                                                <p className="control">
                                                    <IconButton type={"submit"}
                                                                classes={`is-danger ${isLoading() ? "is-loading" : ""}`}
                                                                disabled={!shouldDisableDeleteButton()} icon={faTrash}/>
                                                </p>
                                            </form>

                                        </div>}
                                    </div>

                                </article>
                            </section>
                            <article className="mt-4">
                                {isLoading() && <LoadingSpinner/>}
                                {!isLoading() && <CategoriesList categories={categories}/>}
                            </article>
                        </section>
                    </div>
                </div>
                ,
                document.getElementById("modal"))}
        </Fragment>
    )
}
