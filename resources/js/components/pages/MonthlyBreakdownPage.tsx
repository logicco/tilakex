import { useState } from "react";
import { ReactSelect } from "../../helpers/dataCaching";
import AuthLayout from "../AuthLayout";
import Select from "react-select";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import AccountSelectControl from "../AccountSelectControl";
import YearSelectControl, { years } from "../YearSelectControl";
import MonthSelectControl, { MONTHS } from "../MonthSelectControl";
import IconButton from "../IconButton";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { Account, getAccounts } from "../features/accounts/accountsSlice";
import { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../helpers/hooks";
import MonthlyBreakdown, {
    IMonthlyBreakdown,
    transformMonthlyBreakdown,
} from "../MonthlyBreakdown";
import { MonthlyBreakdownType } from "../../helpers/enums";
import LoadingSpinner from "../LoadingSpinner";
import FlashMessage from "../FlashMessage";

const TYPES = ["category", "payee"];
const reactSelectTypes: ReactSelect[] = TYPES.map((t) => {
    return { label: t, value: t };
});
interface Inputs {
    account_id: number;
}

const init = true;

export default function MontlyBreakdownPage() {
    var [type, setType] = useState(MonthlyBreakdownType.category);
    var accounts = useAppSelector((s) => s.account.entities);
    var [accountSelectDefault, setAccountSelectDefault] =
        useState<ReactSelect>(null);
    var [accountId, setAccountId] = useState(0);
    var [initialLoading, setInitialLoading] = useState(true);
    var [monthlyBreakdown, setMonthlyBreakdown] = useState<IMonthlyBreakdown>();
    var [year, setYear] = useState<string>(new Date().getFullYear().toString());
    var dispatch = useAppDispatch();
    var [month, setMonth] = useState<string>(
        (new Date().getMonth() + 1).toString()
    );
    var [errorMessage, setErrorMessage] = useState("");
    var [monthlyBreakdownLoading, setMonthlyBreakdownLoading] = useState(true);
    var {
        register,
        handleSubmit,
        getValues,
        setValue,
        control,
        formState: { errors: ClientErrors },
    } = useForm<Inputs>();

    const onSubmitSuccess: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    function accountReactSelect() {
        if (accountId !== 0) {
            return {
                value: accountId,
                label: getAccount(accountId).name,
            };
        }

        return {
            value: 0,
            label: "Something went wrong",
        };
    }

    function hasErrorMessage() {
        return errorMessage !== "";
    }

    function reloadReport() {
        setInitialLoading(false);
        setMonthlyBreakdownLoading(true);

        fetchMonthlyReport(accountId);
    }

    useEffect(() => {
        //If no account is availabe in redux state then get accounts
        if (accounts.length === 0) {
            dispatch(getAccounts()).then((action: any) => {
                if (!action.error) {
                    if (action.payload.length > 0) {
                        setAccountId(action.payload[0].id);
                        setAccountSelectDefault({
                            label: action.payload[0].name,
                            value: action.payload[0].id.toString(),
                        });

                        setInitialLoading(false);
                        fetchMonthlyReport(action.payload[0].id);
                    } else {
                        //no accounts exist in db
                        setInitialLoading(false);
                        setMonthlyBreakdownLoading(false);
                        setErrorMessage("No accounts found");
                    }
                }
            });
        } else {
            //accounts exist in redux then use first account
            setAccountSelectDefault({
                label: accounts[0].name,
                value: accounts[0].id.toString(),
            });
            setAccountId(accounts[0].id);
            fetchMonthlyReport(accounts[0].id);
            setInitialLoading(false);
        }
    }, []);

    function getAccount(id: number): Account {
        return accounts.find((a) => a.id == id);
    }

    async function fetchMonthlyReport(account_id: number) {
        try {
            console.log("fetching...");
            const url = `/reporting/monthly-breakdown?date=${month},${year}&by=${type}&account=${account_id}`;
            console.log(url);
            var res = await axios.get(url);
            var data = await res.data;

            //When payload is array it means we did not get any results
            if (!Array.isArray(data)) {
                //transform res data into MonthlyBreakdown
                const transformed = transformMonthlyBreakdown(data);
                setErrorMessage("");
                setMonthlyBreakdown(transformed);
            } else {
                setMonthlyBreakdown(null);
                setErrorMessage("No results found");
            }
            setInitialLoading(false);
            setMonthlyBreakdownLoading(false);
        } catch (err) {
            setInitialLoading(false);
            setMonthlyBreakdownLoading(false);
            setErrorMessage("Something went wrong");
        }
    }

    return (
        <AuthLayout>
            <section className="columns">
                <article className="column">
                    <h1 className="title">Montly Breakdown</h1>
                </article>
                <article className="column has-text-right"></article>
            </section>
            {!initialLoading && accounts.length > 0 && (
                <form onSubmit={handleSubmit(onSubmitSuccess)}>
                    <section className="columns box mt-2">
                        <article className="column">
                            <div className="field">
                                <label className="label">Type</label>
                                <Select
                                    onChange={(option) => setType(option.value)}
                                    defaultValue={{ value: type, label: type }}
                                    options={reactSelectTypes}
                                />
                            </div>
                        </article>
                        <article className="column">
                            <div className="field">
                                <label className="label">Account</label>
                                <AccountSelectControl
                                    onChange={(option) =>
                                        setAccountId(option.value)
                                    }
                                    defaultValue={accountReactSelect()}
                                />
                            </div>
                        </article>
                        <article className="column">
                            <section className="columns">
                                <article className="column">
                                    <div className="field">
                                        <label className="label">Year</label>
                                        <YearSelectControl
                                            onChange={(option) =>
                                                setYear(option.value)
                                            }
                                            defaultValue={{
                                                value: year,
                                                label: year,
                                            }}
                                        />
                                    </div>
                                </article>
                                <article className="column">
                                    <div className="field">
                                        <label className="label">Month</label>
                                        <MonthSelectControl
                                            onChange={(option) =>
                                                setMonth(option.value)
                                            }
                                            defaultValue={{
                                                value: month,
                                                label: MONTHS[
                                                    parseInt(month) - 1
                                                ],
                                            }}
                                        />
                                    </div>
                                </article>
                            </section>
                        </article>
                        <article className="column is-2">
                            <div className="field">
                                <label className="label">
                                    <span className="is-invisible">
                                        {"Hello World!"}
                                    </span>
                                </label>
                                <IconButton
                                    onClick={reloadReport}
                                    text="Reload"
                                    classes="is-primary mt-0"
                                    icon={faSyncAlt}
                                />
                            </div>
                        </article>
                    </section>
                </form>
            )}

            {/* show loading spinner when loading  */}
            {initialLoading ? (
                <section className="mt-5">
                    <LoadingSpinner />
                </section>
            ) : null}

            {!initialLoading && monthlyBreakdownLoading ? (
                <section className="mt-5">
                    <LoadingSpinner />
                </section>
            ) : null}

            {/* show error message when network error occurs */}
            {hasErrorMessage() && (
                <section className="mt-5">
                    <FlashMessage
                        classes="mt-5"
                        message={errorMessage}
                        variant="warning"
                    />
                </section>
            )}

            {/* show MonthlyBreakdown when there is no error, no loading and monthlyBreakdown is set */}
            {!hasErrorMessage() &&
                !monthlyBreakdownLoading &&
                monthlyBreakdown && (
                    <section className="columns mt-3">
                        <article className="column is-12">
                            <MonthlyBreakdown
                                data={monthlyBreakdown}
                                date={`${MONTHS[parseInt(month) - 1]} ${year}`}
                            />
                        </article>
                    </section>
                )}
        </AuthLayout>
    );
}
