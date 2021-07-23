import { Redirect, useHistory } from "react-router-dom";
import { useAppSelector } from "../helpers/hooks"

interface Props {
    Render: any,
    isAuth: boolean
}

//redirec to login if not not authenticated
export default function RedirectIfNotAuth({Render, isAuth}: Props) {

    if(!isAuth) {
        return <Redirect to="/auth/login"/>
    }

    return <Render />
}
