import { useEffect } from "react";
import AuthLayout from "../AuthLayout";

import { useAppDispatch, useAppSelector } from "../../helpers/hooks";
import { getUser } from "../features/user/userSlice";
import LoadingSpinner from "../LoadingSpinner";
import { Link } from "react-router-dom";

export default function SettingsPage(props) {
    var dispatch = useAppDispatch();
    var user = useAppSelector((s) => s.profile.user);
    var error = useAppSelector((s) => s.profile.error);
    var loading = useAppSelector((s) => s.profile.loading);

    useEffect(() => {
        if(!user) {
            dispatch(getUser());
        }
    },[])

    if(loading === "pending") {
        return (
            <AuthLayout>
                <LoadingSpinner />
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <section className="columns">
                <article className="column">
                    <h1 className="title">Settings</h1>
                </article>
            </section>
            <section className="columns">
                <article className="column is-4">
                <aside className="menu">
                    <p className="menu-label">Account</p>
                    <ul className="menu-list">
                        <li>
                            <Link to={"/settings/profile"}>Profile</Link>
                        </li>
                        <li>
                            <Link to="/settings/change-password">Change Password</Link>
                        </li>
                    </ul>
                </aside>
                </article>
                <article className="column box">
                    {loading === "succeeded" && props.children}
                </article>
            </section>
        </AuthLayout>
    );
}
