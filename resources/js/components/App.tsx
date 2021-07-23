import HomePage from "./pages/HomePage";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { PageNotFound } from "./PageNotFound";
import { useAppSelector } from "../helpers/hooks";
import PayeesPage from "./pages/PayeesPage";
import AccountsPage from "./pages/AccountsPage";
import TransactionsPage from "./pages/TransactionsPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdateProfileForm from "./features/user/UpdateProfileForm";
import ChangePasswordPage from "./features/user/ChangePasswordForm";
import MontlyBreakdownPage from "./pages/MonthlyBreakdownPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFoundPage from "./pages/NotFoundPage";
import RedirectIfAuth from "./RedirectIfAuth";
import RedirectIfNotAuth from "./RedirectIfNotAuth";

export default function App() {
    var isAuth = useAppSelector((state) => state.auth.auth);

    return (
        <Switch>
            <Route exact path="/privacy-policy">
                <PrivacyPolicyPage />
            </Route>
            <Route exact path="/reports/monthly-breakdown">
                <RedirectIfNotAuth
                    isAuth={isAuth}
                    Render={MontlyBreakdownPage}
                />
            </Route>
            <Route exact path="/auth/reset-password">
                <RedirectIfAuth isAuth={isAuth} Render={ResetPasswordPage} />
            </Route>
            <Route exact path="/auth/forgot-password">
                <RedirectIfAuth isAuth={isAuth} Render={ForgotPasswordPage} />
            </Route>
            <Route exact path="/auth/sign-up">
                <RedirectIfAuth isAuth={isAuth} Render={RegisterPage} />
            </Route>
            <Route exact path="/auth/login">
                <RedirectIfAuth isAuth={isAuth} Render={LoginPage} />
            </Route>
            <Route exact path="/settings/profile">
                <RedirectIfNotAuth isAuth={isAuth} Render={UpdateProfileForm} />
            </Route>
            <Route exact path="/settings/change-password">
                <RedirectIfNotAuth
                    isAuth={isAuth}
                    Render={ChangePasswordPage}
                />
            </Route>
            <Route exact path={"/accounts/:id/transactions"}>
                {" "}
                <RedirectIfNotAuth
                    isAuth={isAuth}
                    Render={TransactionsPage}
                />{" "}
            </Route>
            <Route exact path="/accounts">
                <RedirectIfNotAuth isAuth={isAuth} Render={AccountsPage} />
            </Route>
            <Route exact path="/payees">
                <RedirectIfNotAuth isAuth={isAuth} Render={PayeesPage} />
            </Route>
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route path="*" render={NotFoundPage} />
        </Switch>
    );
}
