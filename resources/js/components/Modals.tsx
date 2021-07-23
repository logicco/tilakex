import {useAppSelector} from "../helpers/hooks";
import {Fragment} from "react";
import PayeeModal from "./features/payee/PayeeModal";
import AccountModal from "./features/accounts/AccountModal";
import CategoryModal from "./features/categories/CategoryModal";
import TransactionDeleteModal from "./features/transactions/TransactionDeleteModal";

export default function Modals() {
    var isPayeeModalVisible = useAppSelector(s => s.payee.modal.visible);
    var isCategoryModalVisible = useAppSelector(s => s.category.modal.visible);
    var isAccountModalVisible = useAppSelector(s => s.account.modal.visible);
    var isTransactionModalVisible = useAppSelector(s => s.transaction.modal.visible);
    return (
        <Fragment>
            {isPayeeModalVisible && <PayeeModal />}
            {isAccountModalVisible && <AccountModal />}
            {isCategoryModalVisible && <CategoryModal />}
            {isTransactionModalVisible && <TransactionDeleteModal />}
        </Fragment>
    )
}
