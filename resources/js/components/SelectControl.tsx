import Select from "react-select";
import { ReactSelect } from "../helpers/dataCaching";

export default function SelectControl(props) {

    function transform(): ReactSelect[] {
        return props.list.map(props.transformer)
    }

    return (
        <Select options={transform()} {...props} />
    )
}
