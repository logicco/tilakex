import Select from "react-select";
import {buildCurrencyLabel, currencies, ReactSelect} from "../helpers/dataCaching";

export default function CurrencySelectControl(props) {

    function transform(): ReactSelect[] {
        return currencies.map(c => {
            return {
                value: c.id.toString(),
                label: buildCurrencyLabel(c)
            }
        })
    }

    return (
        <Select {...props} options={transform()}/>
    )
}
