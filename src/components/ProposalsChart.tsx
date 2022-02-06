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
import { SnapshotVote } from "../models/Snapshot";

const formatJBX = (tickItem: string) => {
  return numeral(tickItem).format("0,0a");
};

type ChartDataItem = {
  idx: number;
  titleShort: string;
  title: string;
  id: string;
  totalVoteCount: number;
  yesVotes: SnapshotVote[];
  noVotes: SnapshotVote[];
  abstainVotes: SnapshotVote[];
  yesVoteTokenVolume: number;
  noVoteTokenVolume: number;
  abstainVoteTokenVolume: number;
  totalVoteTokenVolume: number;
};

export type ChartData = ChartDataItem[];

export default function ProposalsChart({
  tokenSymbol,
  chartData,
  voteThreshold,
  tokenVoteThresholdPercent,
}: {
  tokenSymbol: string;
  chartData?: ChartData;
  voteThreshold?: number;
  tokenVoteThresholdPercent?: number;
}) {
  if (!chartData) {
    return <div>Loading (may take up to 30 seconds)...</div>;
  }
  const voteAxisUpperLimit = Math.max(
    ...chartData.map((d) => d.totalVoteCount),
    20
  );

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: ChartDataItem }[];
  }) => {
    if (active && payload && payload.length) {
      const proposal = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${proposal.title}`}</p>
          <p className="label">{`${proposal.totalVoteCount} ${
            proposal.totalVoteCount === 1 ? "vote" : "votes"
          } (${proposal.yesVotes.length} yes, ${proposal.noVotes.length} no, ${
            proposal.abstainVotes.length
          } abstain)`}</p>
          {voteThreshold && proposal.totalVoteCount < voteThreshold && (
            <p style={{ color: "#FF6347" }}>
              Proposal needs at least {voteThreshold} votes.
            </p>
          )}

          {tokenVoteThresholdPercent &&
            proposal.yesVoteTokenVolume / proposal.totalVoteTokenVolume <
              tokenVoteThresholdPercent && (
              <p style={{ color: "#FF6347" }}>
                Proposal needs more than {tokenVoteThresholdPercent * 100}%
                "Yes" votes (currently has{" "}
                {Math.round(
                  (proposal.yesVoteTokenVolume /
                    proposal.totalVoteTokenVolume) *
                    100
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
          right: 20,
          left: 20,
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

        <YAxis
          yAxisId="right"
          orientation="right"
          interval={0}
          domain={[0, voteAxisUpperLimit]}
        >
          <Label angle={90} position="right" style={{ textAnchor: "middle" }}>
            Votes
          </Label>
        </YAxis>

        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" />
        <Bar
          yAxisId="left"
          stackId="a"
          dataKey="yesVoteTokenVolume"
          name={`Yes (${tokenSymbol})`}
          fill="#18b4c7"
          barSize={20}
        />
        <Bar
          yAxisId="left"
          stackId="a"
          dataKey="noVoteTokenVolume"
          name={`No (${tokenSymbol})`}
          fill="#FF6347"
          barSize={20}
        />
        <Bar
          yAxisId="left"
          stackId="a"
          name={`Abstain (${tokenSymbol})`}
          dataKey="abstainVoteTokenVolume"
          fill="#f5a312"
          barSize={20}
        />

        <Bar
          yAxisId="right"
          stackId="b"
          dataKey="totalVoteCount"
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
