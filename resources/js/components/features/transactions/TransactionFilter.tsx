import {
    ReactSelect,
    transactionFilterDates,
    transactionTypesFilter,
} from "../../../helpers/dataCaching";
import { useAppDispatch, useAppSelector } from "../../../helpers/hooks";
import { capitalizeFirstLetter } from "../../../helpers/util";
import Button from "../../Button";
import CategorySelectControl from "../../CategorySelectControl";
import PayeeSelectControl from "../../PayeeSelectControl";
import SelectControl from "../../SelectControl";
import TransactionsSortSelectControl from "../../TransactionsSortSelectControl";
import TransactionTypeSelectControl from "../../TransactionTypeSelectControl";
import { setFilter } from "./transactionSlice";

interface Props {
    filterCategories: ReactSelect[],
    filterPayees: ReactSelect[],
    setFilterCategories: Function,
    setFilterPayees: Function,
    filterTransactions: any
}

export default function TransactionFilter(props: Props) {
    var filter = useAppSelector((s) => s.transaction.filter);
    var dispatch = useAppDispatch();

    function transformTransactionTypes(): ReactSelect[] {
        return transactionTypesFilter.map((tt) => {
            return {
                label: tt.name,
                value: tt.id.toString(),
            };
        });
    }

    return (
        <section className="box mb-4">
            <section className="columns">
                <article className="column">
                    <div className="field">
                        <label className="label">Sort</label>
                        <TransactionsSortSelectControl
                            defaultValue={{
                                value: filter.sort,
                                label: capitalizeFirstLetter(filter.sort),
                            }}
                            onChange={(option) => dispatch(setFilter({
                                ...filter,
                                sort: option.value
                            }))}
                        />
                    </div>
                </article>
                <article className="column">
                    <div className="field">
                        <label className="label">Transaction Type</label>
                        <TransactionTypeSelectControl
                            defaultValue={filter.transaction_type}
                            options={transformTransactionTypes()}
                            onChange={(option) => dispatch(setFilter({
                                ...filter,
                                transaction_type: option
                            }))}
                        />
                    </div>
                </article>
                <article className="column">
                    <div className="field">
                        <label className="label">Date</label>
                        <SelectControl
                            list={transactionFilterDates}
                            transformer={(x) => {
                                return { label: capitalizeFirstLetter(x), value: x };
                            }}
                            defaultValue={{
                                label: capitalizeFirstLetter(filter.date),
                                value: filter.date,
                            }}
                            onChange={(option) => dispatch(setFilter({
                                ...filter,
                                date: option.value
                            }))}
                        />
                    </div>
                </article>
            </section>
            <section className="columns">
                <article className="column">
                    <div className="field">
                        <label className="label">Categories</label>
                        <CategorySelectControl
                            defaultValue={props.filterCategories}
                            isMulti
                            onChange={(options) => props.setFilterCategories(options) }
                        />
                    </div>
                </article>
                <article className="column">
                    <div className="field">
                        <label className="label">Payees</label>
                        <PayeeSelectControl
                            defaultValue={props.filterPayees}
                            isMulti
                            onChange={(options) => props.setFilterPayees(options) }
                        />
                    </div>
                </article>
            </section>
            <Button onClick={props.filterTransactions} classes="is-fullwidth">Filter Results</Button>
        </section>
    );
}
