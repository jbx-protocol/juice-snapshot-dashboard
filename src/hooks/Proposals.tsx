import { NetworkStatus, useQuery } from "@apollo/client";
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
    notifyOnNetworkStatusChange: true,
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
    networkStatus: proposalsNetworkStatus,
  } = useQuery<{ proposals: SnapshotProposal[] }>(getProposals, {
    variables: { spaces: [space], start, state, first: PROPOSALS_LIMIT },
    skip: !Boolean(start),
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  const proposalIds = proposalsData?.proposals.map((p) => p.id);
  const {
    data: votesData,
    error: votesError,
    loading: votesLoading,
    networkStatus: votesNetworkStatus,
  } = useQuery<{ votes: SnapshotVote[] }>(getVotes, {
    variables: {
      proposal_in: proposalIds,
    },
    skip: !Boolean(proposalIds),
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
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

  const loading =
    proposalsLoading ||
    votesLoading ||
    proposalsNetworkStatus === NetworkStatus.refetch ||
    votesNetworkStatus === NetworkStatus.refetch;

  if (votesByProposal === undefined) {
    return {
      data: undefined,
      loading,
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
    loading,
  };
}
