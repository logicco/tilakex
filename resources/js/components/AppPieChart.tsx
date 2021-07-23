import { PieChart } from "react-minimal-pie-chart";

export interface ChartData {
    title: string;
    value: number;
    color: string;
}

interface Props {
    data: ChartData[]
}

export default function AppPieChart(props: Props) {
  const defaultLabelStyle = {
    fontSize: "3px",
    fontFamily: "sans-serif",
  };
  const shiftSize = 7;

  return (
    <PieChart
      className=""
      radius={PieChart.defaultProps.radius - shiftSize}
      label={({ dataEntry }) =>
        `${dataEntry.title.toString()} ${Math.round(dataEntry.percentage)}%`
      }
      labelStyle={{
        ...defaultLabelStyle,
      }}
      data={props.data}
    />
  );
}
