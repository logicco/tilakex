import { Link } from "react-router-dom";

export default function WebNavbar() {
    
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to="/">
                    Tilkex App
                </Link>

                <a
                    role="button"
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarBasicExample"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-start"></div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <Link to="/auth/sign-up" className="button is-primary">
                                <strong>Sign up</strong>
                            </Link>
                            <Link className="button is-light" to="/auth/login">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
