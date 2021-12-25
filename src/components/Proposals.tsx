import useProposals from "../hooks/Proposals";
import useScores from "../hooks/Scores";
import { useMemo } from "react";
import ProposalsChart from "./ProposalsChart";
import useCountdownTimer from "../hooks/CountdownTimer";
import blueberry from "../assets/blueberry.png";

export default function Proposals({
  name,
  space,
  tokenContractAddress,
  tokenSymbol,
  voteThreshold,
  tokenVoteThresholdPercent,
  juiceboxLink,
}: {
  name: string;
  space: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  voteThreshold?: number;
  tokenVoteThresholdPercent?: number;
  juiceboxLink?: string;
}) {
  const proposals = useProposals(space);
  const { data: scores, loading: scoresLoading } = useScores({
    tokenContractAddress,
    tokenSymbol,
    proposals: proposals ?? [],
  });

  const chartData = useMemo(() => {
    if (
      proposals === undefined ||
      !scores ||
      Object.keys(scores || {}).length === 0
    ) {
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
  const fundingCycleEndTimer = useCountdownTimer({ end: proposals?.[0]?.end });

  const loading = proposals === undefined || scoresLoading;

  const hasProposals = !loading && proposals?.length > 0;

  const navItems = [
    { text: "Snapshot", href: `https://snapshot.org/#/${space}` },
    { text: "Juicebox", href: juiceboxLink },
  ];

  return (
    <div
      style={{
        width: "80%",
        height: "80%",
        margin: "0 auto",
      }}
    >
      <h1>{name} active proposals</h1>
      <nav>
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {navItems.map((n, i) => (
            <li key={n.text} style={{ listStyle: "none" }}>
              <a href={n.href} target="_blank" rel="noopener noreferrer">
                {n.text}
              </a>
              <span style={{ padding: "0 0.7rem" }}>
                {i < navItems.length - 1 && "•"}
              </span>
            </li>
          ))}
        </ul>
      </nav>

      {loading && <div>Loading (may take up to 30 seconds)...</div>}
      {!loading && !hasProposals && (
        <div>
          <img
            src={blueberry}
            alt="Blueberry"
            style={{ maxWidth: "400px", width: "100%", height: "auto" }}
          />
          <p>There are no active proposals.</p>
          <p>Check again in the next voting period.</p>
        </div>
      )}
      {!loading && hasProposals && fundingCycleEndTimer && (
        <h3>{fundingCycleEndTimer}</h3>
      )}
      {!loading && hasProposals && (
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
      )}
    </div>
  );
}
