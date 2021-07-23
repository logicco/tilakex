import Select from "react-select";
import {transactionTypes, ReactSelect} from "../helpers/dataCaching";

export default function TransactionTypeSelectControl(props) {

    function transform(): ReactSelect[] {
        return transactionTypes.map(tt => {
            return {
                value: tt.id.toString(),
                label: tt.name
            }
        })
    }

    return (
        <Select {...props} options={transform()}/>
    )
}
