import { Chart, useChart } from "@chakra-ui/charts";
import { Area, AreaChart } from "recharts";

export default function DashboardChart() {
  const chart = useChart({
    data: [
      { value: 10 },
      { value: 14 },
      { value: 11 },
      { value: 15 },
      { value: 12 },
      { value: 37 },
      { value: 46 },
      { value: 66 },
    ],
    series: [{ name: "value", color: "#84db21" }],
  });

  return (
    <Chart.Root width="36" height="16" chart={chart}>
      <AreaChart accessibilityLayer data={chart.data} responsive>
        {chart.series.map((item) => (
          <defs key={item.name}>
            <Chart.Gradient
              id={`${item.name}-gradient`}
              stops={[
                { offset: "0%", color: item.color, opacity: 1 },
                { offset: "100%", color: item.color, opacity: 0.01 },
              ]}
            />
          </defs>
        ))}

        {chart.series.map((item) => (
          <Area
            type="natural"
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={`url(#${item.name}-gradient)`}
            stroke={chart.color(item.color)}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </Chart.Root>
  );
}
