import { Controller } from "react-hook-form";
import AccountSelectControl from "./AccountSelectControl";

interface Props {
    control: any;
    defaultValue: any;
    name: string;
}

export default function AccountController(props: Props) {
    var { control, defaultValue, name } = props;
    return (
        <Controller
            control={control}
            rules={{
                required: "Account is required",
            }}
            defaultValue={defaultValue}
            render={(props) => (
                <AccountSelectControl
                    onChange={(option) => props.field.onChange(option)}
                    {...props}
                    defaultValue={defaultValue}
                />
            )}
            name={name}
        />
    );
}
