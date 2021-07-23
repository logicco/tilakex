import LabelInput from "../../LabelInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../../helpers/hooks";
import { useState } from "react";
import { confirmPasswordRules, passwordRules } from "../../../helpers/formValidation";
import FlashMessage from "../../FlashMessage";
import { StateError } from "../../../helpers/errorHandling"
import axios from "axios";
import { flashMessage } from "../ui/uiSlice";

interface Inputs {
    old_password: string,
    new_password: string,
    new_password_confirmation: string,
}

export default function PasswordForm() {
    var dispatch = useAppDispatch();
    var [error, setError] = useState<StateError>(null);
    var [loading, setLoading] = useState(false);
    var [successMessage, setSuccessMessage] = useState("");
    var [errorMessage,  setErrorMessage] = useState("");
    const {
        register,
        handleSubmit,
        setError: setClientError,
        reset,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();

    const submitSuccess: SubmitHandler<Inputs> = async (data) => {
        if (data.new_password !== data.new_password_confirmation) {
            setClientError("new_password_confirmation", {
                type: "validate",
                message: "Confirm password does not match password",
            });
            return;
        }
        setLoading(true);
        try {
            var res = await axios.put("/user/change-password", data);
            if (res.status === 200) {
                setSuccessMessage("Password has been successfully updated");
                setErrorMessage("");
                reset();
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            if (err.response) {
                let status = err.response.status;
                if(status === 422) {
                    setError(err.response.data);
                    if(!err.response.data.errors) {
                        setSuccessMessage("");
                        setErrorMessage("Invalid credentials");
                    }
                }
                if (status === 500) {
                    dispatch(
                        flashMessage({
                            message: err.response.data.message,
                            variant: "danger",
                        })
                    );
                }
            }
        }
    };


    return (
        <form className="p-3" onSubmit={handleSubmit(submitSuccess)}>
            {errorMessage !== "" && (
                <FlashMessage
                    classes="mb-3"
                    message={errorMessage}
                    variant={"danger"}
                />
            )}
            {successMessage !== "" && (
                <FlashMessage
                    classes="mb-3"
                    message={successMessage}
                    variant={"success"}
                />
            )}
            <h1 className="is-size-3 mb-3">Change Password</h1>
            <LabelInput
                register={{...register("old_password", passwordRules)}}
                label="Current Password"
                error={error}
                clienterrors={clientErrors}
                name="old_password"
                type="password"
                placeholder="Enter current password"
                icon={faLock}
            />
            <LabelInput
                register={{...register("new_password", passwordRules)}}
                label="New Password"
                error={error}
                clienterrors={clientErrors}
                name="new_password"
                type="password"
                placeholder="Enter new password"
                icon={faLock}
            />
            <LabelInput
                register={{...register("new_password_confirmation", confirmPasswordRules)}}
                label="Confirm New Password"
                error={error}
                clienterrors={clientErrors}
                name="new_password_confirmation"
                type="password"
                placeholder="Confirm new password"
                icon={faLock}
            />
            <button
                type="submit"
                className={`mt-2 button is-primary ${
                    loading ? "is-loading" : ""
                }`}
            >Change Password</button>
        </form>
    );
}
