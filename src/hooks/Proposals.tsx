import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import { SnapshotProposal, SnapshotVote } from "../models/Snapshot";
const getProposals = loader("../graphql/queries/getProposals.query.graphql");
const getVotes = loader("../graphql/queries/getVotes.query.graphql");

const PROPOSALS_LIMIT = 1000;

type ProposalsByDate = {
  [startDate: number]: SnapshotProposal[];
};

const groupProposalsByDate = (
  proposals: SnapshotProposal[] | undefined
): ProposalsByDate | undefined => {
  return proposals?.reduce((acc: ProposalsByDate, proposal) => {
    if (!acc[proposal.start]) {
      acc[proposal.start] = [];
    }

    acc[proposal.start].push(proposal);
    return acc;
  }, {});
};

export function useProposalGroups(space: string) {
  const { data: proposalsData, loading } = useQuery<{
    proposals: SnapshotProposal[];
  }>(getProposals, {
    variables: { spaces: [space], first: PROPOSALS_LIMIT },
  });

  return { data: groupProposalsByDate(proposalsData?.proposals), loading };
}

export function useProposals({
  space,
  start,
  state,
}: {
  space: string;
  start?: number;
  state?: string;
}) {
  const {
    data: proposalsData,
    error: proposalsError,
    loading: proposalsLoading,
  } = useQuery<{ proposals: SnapshotProposal[] }>(getProposals, {
    variables: { spaces: [space], start, state, first: PROPOSALS_LIMIT },
    skip: !Boolean(start),
  });

  const proposalIds = proposalsData?.proposals.map((p) => p.id);
  const {
    data: votesData,
    error: votesError,
    loading: votesLoading,
  } = useQuery<{ votes: SnapshotVote[] }>(getVotes, {
    variables: {
      proposal_in: proposalIds,
    },
    skip: !Boolean(proposalIds),
  });

  const votesByProposal = votesData?.votes.reduce(
    (proposals: { [proposalId: string]: SnapshotVote[] }, vote) => {
      const proposalId = vote.proposal.id;
      if (!proposals[proposalId]) {
        proposals[proposalId] = [];
      }
      proposals[proposalId].push(vote);

      return proposals;
    },
    {}
  );

  if (!votesByProposal) {
    return {
      data: undefined,
      loading: false,
      errors: [],
    };
  }

  const proposals = proposalsData?.proposals.map((proposal) => {
    return {
      ...proposal,
      votes: votesByProposal[proposal.id],
    };
  });

  return {
    data: proposals,
    errors: [proposalsError, votesError],
    loading: proposalsLoading || votesLoading,
  };
}
