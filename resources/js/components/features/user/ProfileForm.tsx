import LabelInput from "../../LabelInput";
import {
    faEnvelope,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../../helpers/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { emailRules, nameRules } from "../../../helpers/formValidation";
import { useEffect } from "react";
import {
    resentVerificationEmail,
    updateProfile,
} from "./userSlice";
import FlashMessage from "../../FlashMessage";
import { useState } from "react";

interface Inputs {
    name: string;
    email: string;
}

export default function ProfileForm() {
    var dispatch = useAppDispatch();
    var user = useAppSelector((s) => s.profile.user);
    var error = useAppSelector((s) => s.profile.error);
    var loading = useAppSelector((s) => s.profile.loadingMutation);
    var [successMessage, setSuccessMessage] = useState("");
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors: clientErrors },
    } = useForm<Inputs>();

    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("email", user.email);
        }
    }, []);

    function isLoading() {
        return loading === "pending";
    }
    function hasSuccessMessage() {
        return successMessage !== "";
    }

    const submitSuccess: SubmitHandler<Inputs> = async (data) => {
        dispatch(updateProfile(data)).then((action: any) => {
            if (!action.error) {
                setSuccessMessage("Your user has been updated");
            }
        });
    };

    function resendEmail() {
        dispatch(resentVerificationEmail()).then((action: any) => {
            if (!action.error) {
                setSuccessMessage("Verification email has been sent");
            }
        });
    }

    return (
        <form className="p-3" onSubmit={handleSubmit(submitSuccess)}>
            {hasSuccessMessage() && (
                <FlashMessage
                    classes="mb-3"
                    message={successMessage}
                    variant={"success"}
                />
            )}
            <h1 className="is-size-3 mb-3">Update Profile</h1>
            <LabelInput
                register={{ ...register("name", nameRules) }}
                label="Name"
                error={error}
                clienterrors={clientErrors}
                name="name"
                type="text"
                placeholder="Enter Name"
                icon={faUser}
            />
            <section className="columns">
                <article
                    className={`column ${!user.isEmailVerified && "is-8"}`}
                >
                    <LabelInput
                        label="Email"
                        register={{ ...register("email", emailRules) }}
                        classes={!user.isEmailVerified ? "is-danger" : ""}
                        error={error}
                        clienterrors={clientErrors}
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        icon={faEnvelope}
                    />
                </article>
                {!user.isEmailVerified && (
                    <article className="column">
                        {!isLoading() && (
                            <label className="label help mb-2 is-danger">
                                Email not verified
                            </label>
                        )}
                        {!isLoading() && (
                            <button
                                onClick={resendEmail}
                                type="button"
                                className={`button is-primary is-light`}
                            >
                                Resent verification email
                            </button>
                        )}
                    </article>
                )}
            </section>

            <button
                disabled={isLoading()}
                type="submit"
                className={`mt-2 button is-primary ${
                    isLoading() ? "is-loading" : ""
                }`}
            >
                Save Changes
            </button>
        </form>
    );
}
