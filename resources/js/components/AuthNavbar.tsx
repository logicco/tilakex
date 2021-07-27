import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import { logoutUser } from "./features/auth/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiggyBank, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { resetPayeeState } from "./features/payee/payeeSlice";
import { resetTransactionState } from "./features/transactions/transactionSlice";
import { resetAccountState } from "./features/accounts/accountsSlice";
import { resetUserState } from "./features/user/userSlice";
import { resetCategoryState } from "./features/categories/categorySlice";

export default function AuthNavbar(props) {
    var dispatch = useAppDispatch();
    var loading = useAppSelector((state) => state.auth.loading);
    var isAuth = useAppSelector((s) => s.auth.auth);
    var [active, setActive] = useState(false);

    function submitLogout(e) {
        e.preventDefault();
        dispatch(logoutUser()).then((action: any) => {
            //clear all states
            dispatch(resetPayeeState());
            dispatch(resetCategoryState());
            dispatch(resetTransactionState());
            dispatch(resetAccountState());
            dispatch(resetUserState());
        });
    }

    return (
        <nav
            className="navbar is-primary"
            role="navigation"
            aria-label="main navigation"
        >
            <div className="navbar-brand title">
                <Link className="navbar-item" to={isAuth ? "/accounts" : "/"}>
                    <FontAwesomeIcon icon={faPiggyBank} />
                    &nbsp;&nbsp;Tilkex
                </Link>

                <a
                    role="button"
                    className={`navbar-burger ${active && "is-active "}`}
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarBasicExample"
                    onClick={() => setActive(!active)}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div
                id="navbarBasicExample"
                className={`navbar-menu ${active && "is-active "}`}
            >
                <div className="navbar-start">

                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            {!isAuth && (
                                <div className="buttons">
                                    <Link
                                        to="/auth/sign-up"
                                        className="button is-primary"
                                    >
                                        <strong>Sign up</strong>
                                    </Link>
                                    <Link
                                        className="button is-light"
                                        to="/auth/login"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            )}
                            {isAuth && (
                                <form onSubmit={submitLogout}>
                                    <button
                                        type="submit"
                                        className={`button ${
                                            loading === "pending"
                                                ? "is-loading"
                                                : ""
                                        }`}
                                    >
                                        <strong>
                                            <FontAwesomeIcon
                                                icon={faPowerOff}
                                            />{" "}
                                            Logout
                                        </strong>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
