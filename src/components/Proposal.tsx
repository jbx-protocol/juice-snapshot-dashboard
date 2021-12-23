import ProposalTokenVotes from "./ProposalTokenVotes";
import VoteProgressBar from "./VoteProgressBar";

export default function Proposal({ chartData }: { chartData: any }) {
  return (
    <div>
      <ProposalTokenVotes chartData={[chartData]} />
      <VoteProgressBar totalVotes={chartData.totalVotes} voteThreshold={15} />
    </div>
  );
}
