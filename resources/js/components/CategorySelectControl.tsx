import {useAppSelector, useAppDispatch} from "../helpers/hooks";
import LoadingSpinner from "./LoadingSpinner";
import {ReactSelect} from "../helpers/dataCaching";
import {Fragment, useEffect} from "react";
import Select from "react-select";
import {getCategories, transformIntoRawCategories} from "./features/categories/categorySlice";

export default function CategorySelectControl(props) {
    var categories = useAppSelector((state) => state.category.entities);
    var loading = useAppSelector((state) => state.category.loading);
    var dispatch = useAppDispatch();

    useEffect(() => {
        if(categories.length === 0) dispatch(getCategories());
    },[])

    function data(): ReactSelect[] {
        return transformIntoRawCategories(categories).map(c => {
            var label = "";
            if(c.parent) {
                label = `${c.parent.name}:${c.name}`
            }else {
                label = c.name;
            }
            return {
                value: c.id.toString(),
                label: label,
            }
        });
    }

    if (loading === "pending") {
        return <LoadingSpinner />
    }

    return (
        <Fragment>
            {loading === "succeeded" && <Select {...props} options={data()}/>}
        </Fragment>
    )
}
