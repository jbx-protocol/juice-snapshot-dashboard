import useProposals from "../hooks/Proposals";

export default function Chart({ space }: { space: string }) {
  const proposals = useProposals([space]);

  if (!proposals) return <div>Loading...</div>;

  return (
    <div>
      {proposals.map((p: any) => (
        <div key={p.id}>
          <h2>{p.title}</h2>
          <div>
            {p.votes?.filter((p: any) => p.choice === 1).length} Yes votes
          </div>
          <div>
            {p.votes?.filter((p: any) => p.choice === 2).length} Abstain votes
          </div>
          <div>
            {p.votes?.filter((p: any) => p.choice === 3).length} No votes
          </div>
        </div>
      ))}
    </div>
  );
}
