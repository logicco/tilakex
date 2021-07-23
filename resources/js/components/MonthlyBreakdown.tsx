import { useState } from "react";
import { Fragment } from "react";
import { useStore } from "react-redux";
import { getRandomColor } from "../helpers/colors";
import { MonthlyBreakdownType } from "../helpers/enums";
import AppPieChart, { ChartData } from "./AppPieChart";
import ReportTable from "./ReportTable";

type toggle = "expense" | "income";

export const MONTHLY_BREAKDOWN_DEFAULT: IMonthlyBreakdown = {
    expense: {
        items: [],
        total: 0,
        chart: [],
    },
    income: {
        items: [],
        total: 0,
        chart: [],
    },
    type: MonthlyBreakdownType.payee,
};

export interface IMonthlyBreakdown {
    expense: {
        items: MonthlyBreakdownData[];
        total: number;
        chart: ChartData[];
    };
    income: {
        items: MonthlyBreakdownData[];
        total: number;
        chart: ChartData[];
    };
    type: MonthlyBreakdownType;
}

export interface MonthlyBreakdownData {
    id: number;
    name: string;
    total_expenses: number;
}

interface Props {
    data: IMonthlyBreakdown;
    date: string;
}

//Takes API /response/monthly-breakdown response payload
//and converts it into IMonthlyBreakdown[]
export function transformMonthlyBreakdown(payload: any): IMonthlyBreakdown {
    //Initialize with default values
    var result: IMonthlyBreakdown = MONTHLY_BREAKDOWN_DEFAULT;
    result.type = payload.fetched;

    function transformChartData(payload: MonthlyBreakdownData[]): ChartData[] {
        var results: ChartData[] = [];

        results = payload.map((p) => {
            return {
                title: p.name,
                value: parseFloat(p.total_expenses.toString()),
                color: getRandomColor(),
            };
        });
        return results;
    }

    function transformCategory(payload: []): MonthlyBreakdownData[] {
        let results: MonthlyBreakdownData[] = [];

        payload.forEach((p: any) => {
            let category: MonthlyBreakdownData = {
                id: p.id,
                name: p.name,
                total_expenses: p.total_expenses,
            };
            results.push(category);

            if (p.children && p.children.length > 0) {
                p.children.forEach((child: any) => {
                    let childCategory: MonthlyBreakdownData = {
                        id: child.id,
                        name: `${category.name}:${child.name}`,
                        total_expenses: child.total_expenses,
                    };
                    results.push(childCategory);
                });
            }
        });
        return results;
    }

    function transformPayee(payload: []): MonthlyBreakdownData[] {
        let result: MonthlyBreakdownData[] = [];
        payload.forEach((e: any) => {
            result.push({
                ...e,
            });
        });
        return result;
    }

    var expenseData = payload.expense.data as [];
    var incomeData = payload.income.data as [];

    //Payee is fetched -->
    if (payload.fetched === MonthlyBreakdownType.payee) {
        if (expenseData && expenseData.length > 0) {
            const transformed = transformPayee(expenseData);
            result.expense.items = transformed;
            result.expense.chart = transformChartData(transformed);
            result.expense.total = payload.expense.total;
        }
        if (incomeData && incomeData.length > 0) {
            const transformed = transformPayee(incomeData);
            result.income.items = transformed;
            result.income.chart = transformChartData(transformed);
            result.income.total = payload.income.total;
        }
    }

    //Category is fetched -->
    if (payload.fetched === MonthlyBreakdownType.category) {
        if (expenseData && expenseData.length > 0) {
            const transformed = transformCategory(expenseData);
            result.expense.items = transformed;
            result.expense.chart = transformChartData(transformed);
            result.expense.total = payload.expense.total;
        }
        if (incomeData && incomeData.length > 0) {
            const transformed = transformCategory(incomeData);
            result.income.items = transformed;
            result.income.chart = transformChartData(transformed);
            result.income.total = payload.income.total;
        }
    }

    return result;
}

export default function ({ data, date }: Props) {
    var [toggle, setToggle] = useState<toggle>("expense");

        return (
            <Fragment>
                <section className="columns mt-5">
                    <article className="column">
                        <div className="tabs is-centered is-toggle is-toggle-rounded">
                            <ul>
                                <li
                                    style={{zIndex: 0}}
                                    onClick={() => setToggle("expense")}
                                    className={`${toggle === "expense" && "is-active"}`}
                                >
                                    <a>
                                        <span>Expenses</span>
                                    </a>
                                </li>
                                <li
                                    style={{zIndex: 0}}
                                    onClick={() => setToggle("income")}
                                    className={`${
                                        toggle === "income" && "is-active"
                                    }`}
                                >
                                    <a>
                                        <span>Income</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </article>
                </section>
                <section className="columns mt-5">
                    <article className="column is-5">
                        <AppPieChart
                            data={
                                toggle === "expense"
                                    ? data.expense.chart
                                    : data.income.chart
                            }
                        />
                    </article>
                    <article className="column">
                        <h3 className="is-size-4">
                            {data.type === MonthlyBreakdownType.category
                                ? "Categories"
                                : "Payees"}
                        </h3>
                        <small>Showing results for {date}</small>
                        <ReportTable
                            data={
                                toggle === "expense"
                                    ? data.expense.items
                                    : data.income.items
                            }
                        />
                    </article>
                </section>
            </Fragment>
        );

}
