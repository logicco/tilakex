import Select from "react-select";
import {ReactSelect} from "../helpers/dataCaching";

export const MONTHS = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
]

export default function MonthSelectControl(props) {

    function transform(): ReactSelect[] {
        let count = 1;
        let result : ReactSelect[] = [];
        for(let month of MONTHS) {
            result.push({ value: count.toString(), label: month });
            count++;
        }
        return result;
    }

    return (
        <Select {...props} options={transform()}/>
    )
}
