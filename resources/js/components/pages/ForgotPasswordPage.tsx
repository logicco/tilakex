import { useState } from "react";
import { buildAppError, buildStateError, StateError } from "../../helpers/errorHandling";
import Layout from "../Layout";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import LabelInput from "../LabelInput";
import { emailRules } from "../../helpers/formValidation";
import axios from "axios";
import FlashMessage from "../FlashMessage";

interface Inputs {
    email: string;
}

export default function ForgotPasswordPage() {
    var [error, setError] = useState<StateError>(null);
    var [loading, setLoading] = useState(false);
    var [successMessage, setSuccessMessage] = useState("");
    const {
        register,
        handleSubmit, getValues, setValue,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();

    const submitSuccess: SubmitHandler<Inputs> = async (data) => {
        setLoading(true);

        try {
            var res = await axios.post('/auth/forgot-password', data);
            if(res.status === 200) {
                setSuccessMessage("Password reset link has been sent");
                setValue('email', "");
            }
        } catch (err) {
            setError(buildStateError(err));
            setLoading(false);
        }
        setLoading(false);
    }

    return (
        <Layout>
            <section className="columns">
                <article className="column is-half is-offset-one-quarter">
                    <form onSubmit={handleSubmit(submitSuccess)} className="mt-5 box">
                        <h1 className="is-size-3 mb-3">Forgot Password</h1>
                        {successMessage !== "" && <FlashMessage classes="mb-2" message={successMessage} variant="success"/>}
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
                        <button type={"submit"} className={`button is-primary ${loading && "is-loading"}`}>Send Reset Link</button>
                    </form>
                </article>
            </section>
        </Layout>
    );
}
