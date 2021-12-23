import useProposals from "../hooks/Proposals";
import useScores from "../hooks/Scores";
import { useMemo } from "react";
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

export default function Chart({
  space,
  tokenContractAddress,
  tokenSymbol,
}: {
  space: string;
  tokenContractAddress: string;
  tokenSymbol: string;
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
    return <div>Loading...</div>;
  }

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

  return (
    <ResponsiveContainer width="90%" height="70%">
      <BarChart
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
        <XAxis
          dataKey="titleShort"
          angle={-45}
          textAnchor="end"
          interval={0}
          offset={1000}
        />
        <YAxis label={{ value: "JBX", angle: -90 }} offset={100} />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" />
        <Bar dataKey="yesVotesTokens" fill="#1E88E5" />
        <Bar dataKey="noVotesTokens" fill="#D81B60" />
      </BarChart>
    </ResponsiveContainer>
  );
}
