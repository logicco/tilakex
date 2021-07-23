import { useState } from "react";
import { buildStateError, StateError } from "../../helpers/errorHandling";
import Layout from "../Layout";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import LabelInput from "../LabelInput";
import {
    confirmPasswordRules,
    emailRules,
    passwordRules,
} from "../../helpers/formValidation";
import { useLocation, useHistory } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import FlashMessage from "../FlashMessage";
import { useAppDispatch } from "../../helpers/hooks";
import { flashMessage } from "../features/ui/uiSlice";

interface Inputs {
    email: string;
    password: string;
    password_confirmation: string;
}

export default function ResetPasswordPage() {
    var [error, setError] = useState<StateError>(null);
    var [loading, setLoading] = useState(false);
    var [successMessage, setSuccessMessage] = useState("");
    var location = useLocation();
    var [token, setToken] = useState("");
    var dispatch = useAppDispatch();
    var history = useHistory();
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        setError: setClientError,
        watch,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();

    useEffect(() => {
        let queryParams = new URLSearchParams(location.search);
        setToken(queryParams.get("token"));
    }, []);

    const submitSuccess: SubmitHandler<Inputs> = async (data) => {
        if (data.password !== data.password_confirmation) {
            setClientError("password_confirmation", {
                type: "validate",
                message: "Confirm password does not match password",
            });
            return;
        }
        setLoading(true);
        try {
            const formData = { ...data, token }
            var res = await axios.post("/auth/reset-password", formData);
            if (res.status === 200) {
                dispatch(flashMessage({message: "Password has been successfully reset", variant: "success"}));
                history.replace("/auth/login");

            }
        } catch (err) {
            setLoading(false);
            if (err.response) {
                let status = err.response.status;
                if(status === 422) { setError(err.response.data); }
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
        <Layout>
            <section className="columns">
                <article className="column is-half is-offset-one-quarter">
                    <form
                        onSubmit={handleSubmit(submitSuccess)}
                        className="mt-5 box"
                    >
                        <h1 className="is-size-3 mb-3">Reset Password</h1>
                        {successMessage !== "" && (
                            <FlashMessage
                                classes="mb-2"
                                message={successMessage}
                                variant="success"
                            />
                        )}
                        <LabelInput
                            label="Email"
                            register={{ ...register("email", emailRules) }}
                            error={error}
                            clienterrors={clientErrors}
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            icon={faEnvelope}
                        />
                        <LabelInput
                            label="New Password"
                            register={{
                                ...register("password", passwordRules),
                            }}
                            error={error}
                            clienterrors={clientErrors}
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            icon={faLock}
                        />
                        <LabelInput
                            label="Confirm Password"
                            register={{
                                ...register(
                                    "password_confirmation",
                                    confirmPasswordRules
                                ),
                            }}
                            error={error}
                            clienterrors={clientErrors}
                            name="password_confirmation"
                            type="password"
                            placeholder="Confirm Password"
                            icon={faLock}
                        />
                        <button className={`button is-primary mt-2 ${loading && "is-loading"}`}>
                            Reset Password
                        </button>
                    </form>
                </article>
            </section>
        </Layout>
    );
}
