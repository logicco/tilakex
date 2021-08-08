import { Controller } from "react-hook-form";
import TransactionTypeSelectControl from "./TransactionTypeSelectControl";

interface Props {
    control: any;
    defaultValue: any;
    name: string;
}

export default function TransactionTypeController(props: Props) {
    var { control, defaultValue, name } = props;
    return (
        <Controller
            control={control}
            rules={{
                required: "Transaction type is required",
            }}
            defaultValue={defaultValue}
            render={(props) => (
                <TransactionTypeSelectControl
                    defaultValue={defaultValue}
                    onChange={(option) => {
                        props.field.onChange(option.value);
                    }}
                    {...props}
                />
            )}
            name={name}
        />
    );
}
