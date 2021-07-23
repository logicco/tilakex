import {Payee, showPayeeModal} from "./payeeSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {useAppDispatch} from "../../../helpers/hooks";
import {EnumModalType} from "../../../helpers/enums";

interface Props {
    item: Payee
}

export default function PayeeItem({ item }: Props) {
    var payee = item;
    var dispatch = useAppDispatch();

    function showPayeeEditModal() {
        dispatch(showPayeeModal({type: EnumModalType.edit, data: payee}))
    }
    return (
        <article className="column is-4-desktop">
            <div className="box">
                <div className="columns">
                    <div className="column">
                        <h1 className="subtitle">{payee.name}</h1>
                    </div>
                    <div className="column has-text-right">
                        <button onClick={showPayeeEditModal} className="button is-primary is-outlined">
                            <FontAwesomeIcon icon={faEdit}/>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}
