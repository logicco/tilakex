import Select from "react-select";
import {transactionTypes, ReactSelect} from "../helpers/dataCaching";

export default function TransactionTypeSelectControl(props) {

    const defaultValue: ReactSelect = {
        label: transactionTypes[0].name,
        value: transactionTypes[0].id.toString()
    }

    function transform(): ReactSelect[] {
        return transactionTypes.map(tt => {
            return {
                value: tt.id.toString(),
                label: tt.name
            }
        })
    }

    return (
        <Select defaultValue={defaultValue} options={transform()} {...props}/>
    )
}
