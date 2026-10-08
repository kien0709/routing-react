import { Chart, useChart } from "@chakra-ui/charts";
import { Box } from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AnalyticsChart() {
  const chart = useChart({
    data: [
      { listingRemoved: 42, noticesSent: 86, noticesRejected: 18, month: "Jan" },
      { listingRemoved: 55, noticesSent: 92, noticesRejected: 24, month: "Feb" },
      { listingRemoved: 48, noticesSent: 88, noticesRejected: 20, month: "Mar" },
      { listingRemoved: 61, noticesSent: 104, noticesRejected: 28, month: "Apr" },
      { listingRemoved: 70, noticesSent: 118, noticesRejected: 32, month: "May" },
      { listingRemoved: 66, noticesSent: 110, noticesRejected: 30, month: "Jun" },
      { listingRemoved: 75, noticesSent: 126, noticesRejected: 36, month: "Jul" },
      { listingRemoved: 82, noticesSent: 132, noticesRejected: 40, month: "Aug" },
      { listingRemoved: 78, noticesSent: 124, noticesRejected: 34, month: "Sep" },
      { listingRemoved: 90, noticesSent: 148, noticesRejected: 45, month: "Oct" },
      { listingRemoved: 84, noticesSent: 138, noticesRejected: 39, month: "Nov" },
      { listingRemoved: 96, noticesSent: 156, noticesRejected: 48, month: "Dec" },
    ],
    series: [
      { name: "listingRemoved", color: "var(--color-chart-removed)" },
      { name: "noticesSent", color: "var(--color-chart-sent)" },
      { name: "noticesRejected", color: "var(--color-chart-rejected)" },
    ],
  });

  return (
    <Box overflowX="auto" overflowY="hidden" pb={2}>
      <Box minW={{ base: "620px", md: "100%" }}>
        <Chart.Root h={{ base: "280px", md: "230px" }} chart={chart}>
          <BarChart data={chart.data} responsive>
            <CartesianGrid stroke={chart.color("border.muted")}
             vertical={false}
             strokeOpacity={0.1}
              />
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey={chart.key("month")}
            />
            <YAxis axisLine={false} tickLine={false} domain={[0, 180]} />
            <Tooltip
              cursor={false}
              animationDuration={100}
              content={<Chart.Tooltip />}
            />
            {chart.series.map((item) => (
              <Bar
                key={item.name}
                isAnimationActive={false}
                dataKey={chart.key(item.name)}
                fill={item.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </Chart.Root>
      </Box>
    </Box>
  );
}
