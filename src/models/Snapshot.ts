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
  id: string;
  title: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  space: {
    name: string;
  };
};

export type SnapshotProposalExtended = SnapshotProposal & {
  votes: SnapshotVote[] | undefined;
};

export type SnapshotScore = {
  [voterAddress: string]: number;
};
