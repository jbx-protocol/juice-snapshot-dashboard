export type SnapshotVote = {
  choice: number;
  created: number;
  id: string;
  proposal: {
    id: string;
  };
  voter: string;
};

export type SnapshotProposal = {
  choices: string[];
  end: number;
  id: string;
  snapshot: string;
  space: {
    name: string;
  };
  start: number;
  state: string;
  title: string;
};

export type SnapshotProposalExtended = SnapshotProposal & {
  votes: SnapshotVote[];
};

export type SnapshotScore = {
  [voterAddress: string]: number;
};
