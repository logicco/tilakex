import { Controller } from "react-hook-form";
import PayeeSelectControl from "./PayeeSelectControl";

interface Props {
    control: any;
    defaultValue: any;
    name: string;
}

export default function PayeeController(props: Props) {
    var { control, defaultValue, name } = props;
    return (
        <Controller
            control={control}
            rules={{
                required: "Payee is required",
            }}
            defaultValue={defaultValue}
            render={(props) => (
                <PayeeSelectControl
                    styles={{ borderColor: "red" }}
                    defaultValue={defaultValue}
                    onChange={(option) => {
                        props.field.onChange(option);
                    }}
                    {...props}
                />
            )}
            name={name}
        />
    );
}
