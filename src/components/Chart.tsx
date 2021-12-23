import useProposals from "../hooks/Proposals";
import useScores from "../hooks/Scores";

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
  if (!proposals || !scores || Object.keys(scores || {}).length === 0)
    return <div>Loading...</div>;

  return (
    <div>
      {proposals.map((p: any) => {
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

        return (
          <div key={p.id}>
            <h2>{p.title}</h2>
            <div>
              {yesVotesTokens} JBX ({yesVotes.length} votes) Yes
            </div>
            <div>
              {noVotesTokens} JBX ({noVotes.length}) No votes
            </div>
            <div>
              {abstainVotesTokens} JBX ({abstainVotes.length}) Abstain votes
            </div>
          </div>
        );
      })}
    </div>
  );
}
