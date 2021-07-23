import FlashMessage from "./FlashMessage";
import { MonthlyBreakdownData } from "./MonthlyBreakdown";

interface Props {
    data: MonthlyBreakdownData[];
}

export default function ({ data }: Props) {
    if(data.length === 0) {
        return (
            <FlashMessage message="No data" variant="warning" />
        )
    }

    return (
        <table className="table is-fullwidth mt-2">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {data.map((d) => {
                    return (
                        <tr key={d.id}>
                            <td>{d.name}</td>
                            <td>${d.total_expenses}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
