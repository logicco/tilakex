import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faReceipt, faCashRegister,  faStream, faWallet, faHome, faCogs } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="menu p-2 box" style={{ maxHeight: "100%" }}>
            <p className="menu-label">General</p>
            <ul className="menu-list">
                <li>
                    <a><FontAwesomeIcon icon={faHome} /> Dashboard</a>
                </li>
                <li>
                    <a><FontAwesomeIcon icon={faCogs} /> Settings</a>
                </li>
            </ul>
            <p className="menu-label">Manage</p>
            <ul className="menu-list">
                 <li>
                    <a><FontAwesomeIcon icon={faReceipt} /> Transactions</a>
                </li>
                <li>
                    <Link to="/payees"><FontAwesomeIcon icon={faCashRegister} /> Payee</Link>
                </li>
                <li>
                    <a><FontAwesomeIcon icon={faStream} /> Categories</a>
                </li>
                <li>
                    <a><FontAwesomeIcon icon={faWallet} /> Accounts</a>
                </li>
            </ul>
            <p className="menu-label">Reports</p>
            <ul className="menu-list">
                <li>
                    <a><FontAwesomeIcon icon={faChartPie} /> Monthly</a>
                </li>
            </ul>
        </aside>
    );
}
