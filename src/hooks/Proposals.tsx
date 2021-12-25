import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { useMemo } from "react";
const getProposals = loader("../graphql/queries/getProposals.query.graphql");
const getVotes = loader("../graphql/queries/getVotes.query.graphql");

type Proposal = any;
type ExtendedProposal = any;

export default function useProposals(
  space: string
): ExtendedProposal[] | undefined {
  const { data: proposalsData } = useQuery(getProposals, {
    variables: { spaces: [space] },
  });

  const proposalIds = proposalsData?.proposals.map((p: Proposal) => p.id);
  const { data: votesData } = useQuery(getVotes, {
    variables: {
      proposal_in: proposalIds,
    },
    skip: !Boolean(proposalIds),
  });
  const votesByProposal = useMemo(() => {
    return votesData?.votes.reduce(
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
  }, [votesData]);

  if (!votesByProposal) return;

  const proposals = proposalsData?.proposals.map((p: any) => {
    return {
      ...p,
      votesCount: p.votes,
      votes: votesByProposal[p.id],
    };
  });

  return proposals;
}
