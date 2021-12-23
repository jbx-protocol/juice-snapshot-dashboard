import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
const getProposals = loader("../graphql/queries/getProposals.query.graphql");
const getVotes = loader("../graphql/queries/getVotes.query.graphql");

export default function useProposals(spaces: Array<string>) {
  const { data: proposalsData } = useQuery(getProposals, {
    variables: { spaces },
  });

  const proposalIds = proposalsData?.proposals.map((p: any) => p.id);
  const { data: votesData } = useQuery(getVotes, {
    variables: {
      proposal_in: proposalIds,
    },
    skip: !Boolean(proposalIds),
  });

  const votesByProposal = votesData?.votes.reduce(
    (proposals: { [key: string]: Array<any> }, vote: any) => {
      const proposalId = vote.proposal.id;
      if (!proposals[proposalId]) {
        proposals[proposalId] = [vote];
      } else {
        proposals[proposalId].push(vote);
      }

      return proposals;
    },
    {}
  );

  return proposalsData?.proposals.map((p: any) => {
    return {
      ...p,
      votesCount: p.votes,
      votes: votesByProposal?.[p.id],
    };
  });
}
