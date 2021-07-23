import AuthNavbar from "./AuthNavbar";
import FlashMessageDismissable from "./FlashMessageDismissable";
import { useAppSelector } from "../helpers/hooks";
import Modals from "./Modals";
import AuthTab from "./AuthTab";

export default function AuthLayout(props) {
    var flash = useAppSelector((state) => state.ui.flash);
    return (
        <main>
            <AuthNavbar />
            <Modals />
            <div className="mb-5">
                <div className="columns">
                    <div className="column">
                        <AuthTab />
                    </div>
                </div>
                <div className="columns">
                    <div className="container column">
                        {flash.visible && (
                            <FlashMessageDismissable
                                message={flash.message}
                                variant={flash.variant}
                            />
                        )}
                        <div className="mt-5">{props.children}</div>
                    </div>
                </div>
            </div>
            {/* <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                        <strong>Bulma</strong> by{" "}
                        <a href="https://jgthms.com">Jeremy Thomas</a>. The
                        source code is licensed
                        <a href="http://opensource.org/licenses/mit-license.php">
                            MIT
                        </a>
                        . The website content is licensed{" "}
                        <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                            CC BY NC SA 4.0
                        </a>
                        .
                    </p>
                </div>
            </footer> */}
        </main>
    );
}
