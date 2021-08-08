import { Controller } from "react-hook-form";
import CategorySelectControl from "./CategorySelectControl";

interface Props {
    control: any;
    defaultValue: any;
    name: string;
}

export default function CategoryController(props: Props) {
    var { control, defaultValue, name } = props;
    return (
        <Controller
            control={control}
            rules={{
                required: "Category is required",
            }}
            defaultValue={defaultValue}
            render={(props) => (
                <CategorySelectControl
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
