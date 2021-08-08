import { Controller } from "react-hook-form";
import CurrencySelectControl from "./CurrencySelectControl";

interface Props {
    control: any;
    defaultValue: any;
    name: string;
}

export default function CurrencyController(props: Props) {
    var { control, defaultValue, name } = props;
    return (
        <Controller
            control={control}
            rules={{
                required: "Currency is required",
            }}
            defaultValue={defaultValue}
            render={(props) => (
                <CurrencySelectControl
                    {...props}
                    onChange={(option) => props.field.onChange(option.value)}
                    defaultValue={defaultValue}
                />
            )}
            name={name}
        />
    );
}
