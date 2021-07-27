import Layout from "../Layout";
const a = require("../../assets/a.png");
const t = require("../../assets/t.png");
const r = require("../../assets/r.png");
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../helpers/hooks";
var Carousel = require("react-responsive-carousel").Carousel;

export default function HomePage(props) {
    var isAuth = useAppSelector(s => s.auth.auth);
    return (
        <Fragment>
            <Layout>
                {isAuth && (
                    <div className="box">
                    <div className="columns">
                        <div className="column">
                            <h1 className="subtitle">You are logged in</h1>
                        </div>
                        <div className="column has-text-right">
                            <Link className={"button is-primary"}
                                  to={`/accounts`}>
                                      View Accounts
                            </Link>
                        </div>
                    </div>
                </div>
                )}
                <section className="columns mt-4">
                    <article className="column box">
                        <h1 className="is-size-2">
                            Modern Financial Manager &#129409;
                        </h1>
                        <p className="is-size-5 mt-3">
                            Tilakex is simple yet powerful modern financial
                            manager &#128176; built for the internet. It is
                            free, open source and built with privacy first
                            design. Tilakex is easy to use and helps users
                            organize and track their finances. Tilakex was
                            inspired by MoneyManagerEx
                        </p>
                        <hr />
                        <div className="content">
                            <dl>
                                <dt className="is-size-4 mb-4">Features</dt>
                                <dd>
                                    &#9989; Very easy to get started, just
                                    create a account and you are good to begin
                                </dd>
                                <br />
                                <dd>
                                    &#9989; Create accounts, payees and
                                    categories
                                </dd>
                                <br />
                                <dd>
                                    &#9989; Transactions are grouped by accounts
                                </dd>
                                <br />
                                <dd>
                                    &#9989; Organize categories by sub
                                    categories
                                </dd>
                                <br />
                                <dd>
                                    &#9989; View detailed monthly reports
                                    tracking
                                </dd>
                                <br />
                            </dl>
                        </div>
                        <hr />
                        <Link to="auth/sign-up" className="button is-medium is-primary is-rounded">
                            Get Started
                        </Link>
                        &nbsp;
                        <a href="http://github.com/logicco/tilakex" className="button is-medium is-primary is-rounded">
                            Github
                        </a>
                    </article>
                    <article className="column">
                        <h2 className="is-size-3">Screenshots &#128247;</h2>
                        <hr />
                        <Carousel showThumbs={false}>
                            <img src={r.default} />
                            <img src={a.default} />
                            <img src={t.default} />
                        </Carousel>
                    </article>
                </section>
            </Layout>
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                        <strong>Tilakex</strong> by is developed by{" "}
                        <a href="https://logicco.io">Logicco Software Foundation</a>
                    </p>
                    <p>
                        <small>© 2021</small> <Link to="/privacy-policy">Privacy Policy</Link>{" "}
                    </p>
                </div>
            </footer>
        </Fragment>
    );
}
