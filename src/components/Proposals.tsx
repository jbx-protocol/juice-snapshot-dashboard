import { useProposals } from "../hooks/Proposals";
import useScores from "../hooks/Scores";
import { useState } from "react";
import ProposalsChart, { ChartData } from "./ProposalsChart";
import Navbar from "./Navbar";
import EmptyState from "./EmptyState";
import FundingCycleTimer from "./FundingCycleTimer";
import FundingCycleSelector from "./FundingCycleSelector";
import { SnapshotProposalExtended, SnapshotScore } from "../models/Snapshot";

const getChartData = (
  proposals?: SnapshotProposalExtended[],
  scores?: { [proposalId: string]: SnapshotScore }
): ChartData | undefined => {
  if (
    proposals === undefined ||
    !scores ||
    Object.keys(scores || {}).length === 0
  ) {
    return;
  }

  return proposals.map((proposal, idx) => {
    const yesVotes = proposal.votes.filter((vote) => vote.choice === 1);
    const noVotes = proposal.votes.filter((vote) => vote.choice === 2);
    const abstainVotes = proposal.votes.filter((vote) => vote.choice === 3);
    const yesVoteTokenVolume = yesVotes.reduce((sum: number, vote) => {
      return sum + scores[proposal.id][vote.voter];
    }, 0);
    const noVoteTokenVolume = noVotes.reduce((sum: number, vote) => {
      return sum + scores[proposal.id][vote.voter];
    }, 0);
    const abstainVoteTokenVolume = abstainVotes.reduce((sum: number, vote) => {
      return sum + scores[proposal.id][vote.voter];
    }, 0);

    return {
      idx,
      titleShort: proposal.title.split(" - ")[0],
      title: proposal.title,
      id: proposal.id,
      totalVoteCount: proposal.votes.length,
      yesVotes,
      noVotes,
      abstainVotes,
      yesVoteTokenVolume,
      noVoteTokenVolume,
      abstainVoteTokenVolume,
      totalVoteTokenVolume:
        yesVoteTokenVolume + noVoteTokenVolume + abstainVoteTokenVolume,
    };
  });
};

export default function Proposals({
  name,
  space,
  tokenContractAddress,
  tokenSymbol,
  voteThreshold,
  tokenVoteThresholdPercent,
  juiceboxLink,
  governanceProcessLink,
}: {
  name: string;
  space: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  voteThreshold?: number;
  tokenVoteThresholdPercent?: number;
  juiceboxLink?: string;
  governanceProcessLink?: string;
}) {
  const [start, setStart] = useState<number>();
  const { data: proposals, loading: proposalsLoading } = useProposals({
    space,
    start,
  });

  const { data: scores, loading: scoresLoading } = useScores({
    tokenContractAddress,
    tokenSymbol,
    proposals,
  });

  const chartData = getChartData(proposals, scores);

  const loading = proposalsLoading || scoresLoading;
  const hasProposals = !loading && (proposals?.length ?? 0) > 0;
  const endTime = proposals?.[0]?.end;
  const isActive = proposals?.[0]?.state === "active";

  return (
    <div
      style={{
        width: "80%",
        height: "80%",
        margin: "0 auto",
      }}
    >
      <h1>{name} active proposals</h1>
      <Navbar
        space={space}
        juiceboxLink={juiceboxLink}
        governanceProcessLink={governanceProcessLink}
      />

      <FundingCycleSelector space={space} onChange={(val) => setStart(val)} />

      {loading && (
        <div style={{ marginTop: "5rem" }}>
          <p style={{ marginBottom: "0.25rem" }}>Loading...</p>
          <small>May take up to 30 seconds</small>
        </div>
      )}
      {!loading && !hasProposals && (
        <EmptyState governanceProcessLink={governanceProcessLink} />
      )}
      {!loading && hasProposals && endTime && isActive && (
        <FundingCycleTimer endTime={endTime} />
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
