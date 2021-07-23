import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCashRegister,
    faChartPie,
    faCogs,
    faStream,
    faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../helpers/hooks";
import { showCategoryModal } from "./features/categories/categorySlice";

const links = [
    { icon: faWallet, label: "Accounts", to: "/accounts", link: true },
    { icon: faCashRegister, label: "Payees", to: "/payees", link: true },
    { icon: faStream, label: "Categories", to: "/", link: false },
    {
        icon: faChartPie,
        label: "Reports",
        to: "/reports/monthly-breakdown",
        link: true,
    },
    { icon: faCogs, label: "Settings", to: "/settings/profile", link: true },
];

export default function AuthTab() {
    var dispatch = useAppDispatch();
    var location = useLocation();
    var [active, setActive] = useState("");

    useEffect(() => {
        var pathname = location.pathname;
        var currPath = pathname.split("/");
        if (currPath.length >= 2) {
            switch (currPath[1]) {
                case links[0].label.toLowerCase():
                    setActive(links[0].label.toLowerCase());
                    break;
                case links[1].label.toLowerCase():
                    setActive(links[1].label.toLowerCase());
                    break;
                case links[2].label.toLowerCase():
                    setActive(links[2].label.toLowerCase());
                    break;
                case links[3].label.toLowerCase():
                    setActive(links[3].label.toLowerCase());
                    break;
                case links[4].label.toLowerCase():
                    setActive(links[4].label.toLowerCase());
                    break;
                default:
                    return;
            }
        }
    }, []);

    return (
        <div className="tabs is-medium is-centered">
            <ul>
                {links.map((l) => {
                    return (
                        <li
                            key={l.label}
                            className={
                                l.label.toLowerCase() === active
                                    ? "is-active"
                                    : ""
                            }
                        >
                            {l.link && (
                                <Link to={l.to}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={l.icon} />
                                    </span>
                                    {l.label}
                                </Link>
                            )}
                            {!l.link && (
                                <a
                                    onClick={() =>
                                        dispatch(showCategoryModal())
                                    }
                                    className="is-link"
                                >
                                    <span className="icon">
                                        <FontAwesomeIcon icon={l.icon} />
                                    </span>
                                    {l.label}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
