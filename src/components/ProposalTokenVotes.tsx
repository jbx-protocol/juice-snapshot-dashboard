import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: any;
  payload?: any;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].payload.title}`}</p>
        <p className="label">{`${payload[0].payload.totalVotes} votes`}</p>
      </div>
    );
  }

  return null;
};

export default function ProposalTokenVotes({
  chartData,
}: {
  chartData: any[];
}) {
  return (
    // <ResponsiveContainer width="90%" height="70%">
      <BarChart
        layout="vertical"
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 50,
          left: 50,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis
          dataKey="titleShort"
        />
        <XAxis label={{ value: "JBX", angle: -90 }}  />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" />
        <Bar stackId="a" dataKey="yesVotesTokens" fill="#18b4c7" />
        <Bar stackId="a" dataKey="noVotesTokens" fill="#FF6347" />
        <Bar stackId="a" dataKey="abstainVotesTokens" fill="#f5a312" />
      </BarChart>
    // </ResponsiveContainer>
  );
}
