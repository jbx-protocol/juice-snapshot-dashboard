import useProposals from "../hooks/Proposals";
import useScores from "../hooks/Scores";
import { useMemo } from "react";
import ProposalsChart from "./ProposalsChart";
import useCountdownTimer from "../hooks/CountdownTimer";

export default function Proposals({
  space,
  tokenContractAddress,
  tokenSymbol,
  voteThreshold,
  tokenVoteThresholdPercent,
}: {
  space: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  voteThreshold?: number;
  tokenVoteThresholdPercent?: number;
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
      const yesTokenVotes = yesVotes.reduce((sum: number, vote: any) => {
        return sum + scores[p.id][vote.voter];
      }, 0);
      const noTokenVotes = noVotes.reduce((sum: number, vote: any) => {
        return sum + scores[p.id][vote.voter];
      }, 0);
      const abstainTokenVotes = abstainVotes.reduce(
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
        yesTokenVotes,
        noTokenVotes,
        abstainTokenVotes,
        totalTokenVotes: yesTokenVotes + noTokenVotes + abstainTokenVotes,
      };
    });
  }, [proposals, scores]);

  // use first proposal as timer reference.
  // Each active proposal should (in theory) have the same end time.
  const fundingCycleEndTimer = useCountdownTimer({ end: proposals?.[0].end });

  if (!chartData) {
    return <div>Loading (may take up to 30 seconds)...</div>;
  }

  return (
    <div
      style={{
        width: "80%",
        height: "80%",
        margin: "0 auto",
      }}
    >
      {fundingCycleEndTimer && <h3>{fundingCycleEndTimer}</h3>}

      <a href={`https://snapshot.org/#/${space}`}>Snapshot</a>

      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "scroll",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            minWidth: "500px",
          }}
        >
          <ProposalsChart
            chartData={chartData}
            voteThreshold={voteThreshold}
            tokenVoteThresholdPercent={tokenVoteThresholdPercent}
            tokenSymbol={tokenSymbol}
          />
        </div>
      </div>
    </div>
  );
}
