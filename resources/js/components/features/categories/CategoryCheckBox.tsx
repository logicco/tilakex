import {RawCategory, selectCategory} from "./categorySlice";
import {useAppDispatch, useAppSelector} from "../../../helpers/hooks";

interface Props {
    category: RawCategory
}

export default function CategoryCheckBox({category}: Props) {
    var dispatch = useAppDispatch();
    var selectedCategory = useAppSelector(s => s.category.modal.data);

    function clickHandler(event) {
        if(selectedCategory && selectedCategory.id === category.id) {
            dispatch(selectCategory(null));
            event.target.checked = false;
        }else{
            dispatch(selectCategory(category));
        }
    }

    return (
        <div className="control">
            <label className="radio">
                <input
                       onClick={clickHandler}
                       value={category.id}
                       type="radio"
                       name="categories"/>
                &nbsp;&nbsp;{category.name}
            </label>
        </div>
    )
}
