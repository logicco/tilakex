import { Redirect, useHistory } from "react-router-dom";
import { useAppSelector } from "../helpers/hooks";

interface Props {
    Render: any,
    isAuth: boolean
}

//redirect to /accounts if authenticated
export default function RedirectIfAuth({ Render, isAuth }: Props) {
    var history = useHistory();

    if(isAuth) {
        return <Redirect to="/accounts"/>
    }

    return <Render />;
}
