import numeral from "numeral";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";

const formatJBX = (tickItem: string) => {
  return numeral(tickItem).format("0,0a");
};

export default function ProposalsChart({
  chartData,
  tokenSymbol,
  voteThreshold,
  tokenVoteThresholdPercent,
}: {
  chartData: any;
  tokenSymbol: string;
  voteThreshold?: number;
  tokenVoteThresholdPercent?: number;
}) {
  if (!chartData) {
    return <div>Loading (may take up to 30 seconds)...</div>;
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: any;
    payload?: any;
  }) => {
    if (active && payload && payload.length) {
      const proposal = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${proposal.title}`}</p>
          <p className="label">{`${proposal.totalVotes} votes (${proposal.yesVotes.length} yes, ${proposal.noVotes.length} no, ${proposal.abstainVotes.length} abstain)`}</p>
          {voteThreshold && proposal.totalVotes < voteThreshold && (
            <p style={{ color: "#FF6347" }}>
              Proposal needs at least {voteThreshold} votes.
            </p>
          )}

          {tokenVoteThresholdPercent &&
            proposal.yesTokenVotes / proposal.totalTokenVotes <
              tokenVoteThresholdPercent && (
              <p style={{ color: "#FF6347" }}>
                Proposal needs more than {tokenVoteThresholdPercent * 100}%
                "Yes" votes (currently has{" "}
                {Math.round(
                  (proposal.yesTokenVotes / proposal.totalTokenVotes) * 100
                )}
                %).
              </p>
            )}
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 10,
          right: 50,
          left: 50,
          bottom: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="titleShort" angle={-45} textAnchor="end" interval={0} />
        <YAxis yAxisId="left" orientation="left" tickFormatter={formatJBX}>
          <Label angle={270} position="left" style={{ textAnchor: "middle" }}>
            {tokenSymbol}
          </Label>
        </YAxis>

        <YAxis yAxisId="right" orientation="right" interval={0}>
          <Label angle={90} position="right" style={{ textAnchor: "middle" }}>
            Votes
          </Label>
        </YAxis>

        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" />
        <Bar
          yAxisId="left"
          stackId="a"
          dataKey="yesTokenVotes"
          name={`Yes (${tokenSymbol})`}
          fill="#18b4c7"
          barSize={20}
        />
        <Bar
          yAxisId="left"
          stackId="a"
          dataKey="noTokenVotes"
          name={`No (${tokenSymbol})`}
          fill="#FF6347"
          barSize={20}
        />
        <Bar
          yAxisId="left"
          stackId="a"
          name={`Abstain (${tokenSymbol})`}
          dataKey="abstainTokenVotes"
          fill="#f5a312"
          barSize={20}
        />

        <Bar
          yAxisId="right"
          stackId="b"
          dataKey="totalVotes"
          name="Total votes"
          fill="#574c67"
          barSize={5}
        />
        {voteThreshold && (
          <ReferenceLine yAxisId="right" y={voteThreshold} stroke="#574c67" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
