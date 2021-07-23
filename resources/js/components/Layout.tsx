import FlashMessageDismissable from "./FlashMessageDismissable";
import { useAppSelector } from "../helpers/hooks";
import AuthNavbar from "./AuthNavbar";
import { Fragment } from "react";

export default function Layout(props) {
    var flash = useAppSelector((state) => state.ui.flash);

    return (
        <Fragment>
            <main>
                <AuthNavbar />
                <div className="container">
                    {flash.visible && (
                        <FlashMessageDismissable
                            variant={flash.variant}
                            message={flash.message}
                        />
                    )}
                    <div className="mt-5 p-4">{props.children}</div>
                </div>
            </main>
        </Fragment>
    );
}
