import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faEdit} from "@fortawesome/free-solid-svg-icons";
import {useAppDispatch} from "../../../helpers/hooks";
import {EnumModalType} from "../../../helpers/enums";
import {Account, showAccountModal} from "./accountsSlice";
import IconButton from "../../IconButton";
import {Link} from "react-router-dom";

interface Props {
    item: Account
}

export default function AccountItem({item}: Props) {
    var account = item;
    var dispatch = useAppDispatch();

    function showAccountEditModal() {
        dispatch(showAccountModal({type: EnumModalType.edit, data: account, options: {shouldDelete: true}}))
    }

    return (
        <section className="columns is-12">
            <article className="column is-12">
                <div className="box">
                    <div className="columns">
                        <div className="column">
                            <h1 className="subtitle">{account.name}</h1>
                        </div>
                        <div className="column has-text-right">
                            <Link className={"button is-primary"}
                                  to={`accounts/${account.id}/transactions`}><FontAwesomeIcon
                                icon={faArrowRight}/>&nbsp; View
                                Transactions</Link>&nbsp;&nbsp;
                            <button onClick={showAccountEditModal} className="button is-primary is-outlined">
                                <FontAwesomeIcon icon={faEdit}/>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </section>

    )
}
