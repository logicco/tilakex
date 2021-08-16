import Select from "react-select";
import { ReactSelect, sortList } from "../helpers/dataCaching";
import { capitalizeFirstLetter } from "../helpers/util";

export default function TransactionsSortSelectControl(props) {

    const defaultValue: ReactSelect = {
        value: sortList[0], label: sortList[0]
    }
    function transform(): ReactSelect[] {
        return sortList.map(s => {
            return {
                label: capitalizeFirstLetter(s),
                value: s
            }
        })
    }

    return <Select defaultValue={defaultValue} options={transform()} {...props}/>
}
