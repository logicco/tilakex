import { useRef, useState } from "react";
import Layout from "../Layout";
import { Link, useHistory } from "react-router-dom";
import { useAppDispatch } from "../../helpers/hooks";
import { RegisterRequestForm } from "../features/auth/authSlice";
import FlashMessage from "../FlashMessage";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SubmitHandler, useForm } from "react-hook-form";
import FormError from "../FormError";
import axios from "axios";
import { StateError } from "../../helpers/errorHandling";
import { flashMessage } from "../features/ui/uiSlice";

interface Inputs {
    name: string;
    email: string;
    password: string;
}

export default function RegisterPage() {
    var [error, setError] = useState<StateError>(null);
    var [successMessage, setSuccessMessage] = useState("");
    var [loading, setLoading] = useState(false);
    var dispatch = useAppDispatch();
    var emailInputRef = useRef<HTMLInputElement>();
    var passwordInputRef = useRef<HTMLInputElement>();
    var history = useHistory();
    var captchaRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();

    function hasDbError(key: string) {
        return error && error.errors && error.errors[key];
    }

    function getDbError(key: string) {
        return error.errors[key][0];
    }

    function hasErrorMessage() {
        return error && !error.errors && error.message !== "";
    }

    const submitSuccess: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);
        var formData: RegisterRequestForm = {
            name: data.name,
            email: data.email,
            password: data.password,
        };
        try {
            var res = await axios.post("/auth/register", formData);
            if (res.status === 201) {
                setLoading(false);
                var message = await res.data.message;
                setSuccessMessage(message);
                dispatch(
                    flashMessage({ message: message, variant: "success" })
                );
                history.replace("/auth/login");
            }
        } catch (err) {
            setError(err.response.data);
            setLoading(false);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <section className="columns">
                <div className="column is-half is-offset-one-quarter">
                    {successMessage !== "" && (
                        <FlashMessage
                            variant="success"
                            message={successMessage}
                        />
                    )}
                    {hasErrorMessage() && (
                        <FlashMessage
                            variant="danger"
                            message={error.message}
                        />
                    )}
                    <form
                        onSubmit={handleSubmit(submitSuccess)}
                        className="mt-5 box"
                    >
                        <h1 className="is-size-3 mb-3">
                            Create a account to get started
                        </h1>
                        <small className="mb-3">
                            <span className="tag is-success">Good news!</span>
                            &nbsp;We never share your data with anyone
                        </small>
                        <div
                            className="field mt-3
                        "
                        >
                            <label className="label">Name</label>
                            <div className="control is-medium has-icons-left">
                                <input
                                    {...register("name", {
                                        required: "Name is required",
                                    })}
                                    className={`input ${
                                        hasDbError("name") || clientErrors.name
                                            ? "is-danger"
                                            : ""
                                    }`}
                                    type="name"
                                    placeholder="Enter your name"
                                />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faUser} />
                                </span>
                            </div>
                            {hasDbError("name") && (
                                <FormError message={getDbError("name")} />
                            )}
                            {clientErrors.name && (
                                <FormError
                                    message={clientErrors.name.message}
                                />
                            )}
                        </div>

                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control has-icons-left">
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                            message: "Email is invalid",
                                        },
                                    })}
                                    ref={emailInputRef}
                                    className={`input ${
                                        hasDbError("email") ||
                                        clientErrors.email
                                            ? "is-danger"
                                            : ""
                                    }`}
                                    type="email"
                                    placeholder="Enter email"
                                />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                            </div>
                            {hasDbError("email") && (
                                <FormError message={getDbError("email")} />
                            )}
                            {clientErrors.email && (
                                <FormError
                                    message={clientErrors.email.message}
                                />
                            )}
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control has-icons-left">
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message:
                                                "password must be atleast 8 characters",
                                        },
                                    })}
                                    className={`input ${
                                        hasDbError("password") ||
                                        clientErrors.password
                                            ? "is-danger"
                                            : ""
                                    }`}
                                    type="password"
                                    placeholder="Enter password"
                                />
                                <span className="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                            </div>
                            {hasDbError("password") && (
                                <FormError message={getDbError("password")} />
                            )}
                            {clientErrors.password && (
                                <FormError
                                    message={clientErrors.password.message}
                                />
                            )}
                        </div>
                        <section className="columns mt-3">
                            <article className="column">
                                <button
                                    className={`button is-primary is-rounded ${
                                        loading ? "is-loading" : ""
                                    }`}
                                >
                                    Sign Up
                                </button>
                            </article>
                            <article className="column has-text-right">
                                <Link to="/auth/login">Already a member?</Link>
                            </article>
                        </section>
                    </form>
                </div>
            </section>
        </Layout>
    );
}
