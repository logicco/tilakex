import Select from "react-select";
import {ReactSelect} from "../helpers/dataCaching";

export const years = ["2021", "2020", "2019", "2018", "2017"];

export default function YearSelectControl(props) {

    function transform(): ReactSelect[] {
        return years.map(y => {
            return {
                value: y,
                label: y,
            }
        })
    }

    return (
        <Select {...props} options={transform()}/>
    )
}
