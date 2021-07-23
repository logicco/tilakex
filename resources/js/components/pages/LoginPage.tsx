import Layout from "../Layout";
import { Link, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../helpers/hooks";
import { LoginRequestForm, loginUser } from "../features/auth/authSlice";
import FlashMessage from "../FlashMessage";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { emailRules, passwordRules } from "../../helpers/formValidation";
import LabelInput from "../LabelInput";

interface Inputs {
    email: string;
    password: string;
}

export default function LoginPage() {
    var error = useAppSelector(s => s.auth.error);
    var loading = useAppSelector(s => s.auth.loading);
    var dispatch = useAppDispatch();
    var history = useHistory();
    const {
        register,
        handleSubmit,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();


    function hasErrorMessage() {
        return error && !error.errors && error.message !== "";
    }

    const submitSuccess: SubmitHandler<Inputs> = async (data) => {
        var formData: LoginRequestForm = {
            email: data.email,
            password: data.password,
        };

        dispatch(loginUser(formData)).then((action: any) =>  {
            if(!action.error) {
                history.replace("/accounts");
            }
        })
    };

    return (
        <Layout>
            <section className="columns">
                <div className="column is-half is-offset-one-quarter">
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
                        <h1 className="is-size-3 mb-3">Login</h1>
                        <LabelInput
                            register={{...register("email", emailRules)}}
                            label="Email"
                            error={error}
                            clienterrors={clientErrors}
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            icon={faEnvelope}
                        />
                        <LabelInput
                            register={{...register("password", passwordRules)}}
                            label="Password"
                            error={error}
                            clienterrors={clientErrors}
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            icon={faLock}
                        />
                        <section className="columns mt-3">
                            <article className="column">
                                <button
                                    className={`button is-primary is-rounded ${
                                        loading === "pending" ? "is-loading" : ""
                                    }`}
                                >
                                    Log in
                                </button>
                            </article>
                            <article className="column has-text-right">
                                <Link to="/auth/forgot-password">
                                    Forgot password?
                                </Link>
                            </article>
                        </section>
                    </form>
                </div>
            </section>
        </Layout>
    );
}
