import useProposals from "../hooks/Proposals";
import useScores from "../hooks/Scores";
import { useMemo } from "react";
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
  space,
  tokenContractAddress,
  tokenSymbol,
  voteThreshold,
}: {
  space: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  voteThreshold?: number;
}) {
  const proposals = useProposals(space);
  const { data: scores } = useScores({
    tokenContractAddress,
    tokenSymbol,
    proposals: proposals ?? [],
  });

  const chartData = useMemo(() => {
    if (!proposals || !scores || Object.keys(scores || {}).length === 0) {
      return;
    }
    return proposals.map((p: any, i: any) => {
      const yesVotes = p.votes.filter((p: any) => p.choice === 1);
      const noVotes = p.votes.filter((p: any) => p.choice === 2);
      const abstainVotes = p.votes.filter((p: any) => p.choice === 3);
      const yesVotesTokens = yesVotes.reduce((sum: number, vote: any) => {
        return sum + scores[p.id][vote.voter];
      }, 0);
      const noVotesTokens = noVotes.reduce((sum: number, vote: any) => {
        return sum + scores[p.id][vote.voter];
      }, 0);
      const abstainVotesTokens = abstainVotes.reduce(
        (sum: number, vote: any) => {
          return sum + scores[p.id][vote.voter];
        },
        0
      );

      return {
        idx: i,
        titleShort: p.title.split(" - ")[0],
        title: p.title,
        id: p.id,
        totalVotes: p.votes.length,
        yesVotes,
        noVotes,
        abstainVotes,
        yesVotesTokens,
        noVotesTokens,
        abstainVotesTokens,
      };
    });
  }, [proposals, scores]);

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
          dataKey="yesVotesTokens"
          name={`Yes (${tokenSymbol})`}
          fill="#18b4c7"
          barSize={20}
        />
        <Bar
          yAxisId="left"
          stackId="a"
          dataKey="noVotesTokens"
          name={`No (${tokenSymbol})`}
          fill="#FF6347"
          barSize={20}
        />
        <Bar
          yAxisId="left"
          stackId="a"
          name={`Abstain (${tokenSymbol})`}
          dataKey="abstainVotesTokens"
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
