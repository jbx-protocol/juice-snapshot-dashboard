import snapshot from "@snapshot-labs/snapshot.js";
import { useState } from "react";
import { useDeepCompareEffect } from "react-use";
import {
  SnapshotProposalExtended,
  SnapshotScore,
  SnapshotVote,
} from "../models/Snapshot";

const getScores = ({
  space,
  tokenContractAddress,
  tokenSymbol,
  votes,
  snapshotBlockNumber,
}: {
  space: string;
  tokenContractAddress: string;
  tokenSymbol: string;
  votes: SnapshotVote[];
  snapshotBlockNumber: string;
}) => {
  //   const strategies = [
  //     {
  //       name: "erc20-balance-of",
  //       params: {
  //         address: tokenContractAddress,
  //         symbol: tokenSymbol,
  //         decimals: 18,
  //       },
  //     },
  //   ];
  const strategies = [
    {
      name: "contract-call",
      params: {
        args: ["%{address}", "0x01"],
        symbol: tokenSymbol,
        address: tokenContractAddress,
        decimals: 18,
        methodABI: {
          name: "balanceOf",
          type: "function",
          inputs: [
            { name: "", type: "address", internalType: "address" },
            { name: "", type: "uint256", internalType: "uint256" },
          ],
          outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
          stateMutability: "view",
        },
      },
    },
  ];
  const network = "1";
  const voters = votes.map((vote) => vote.voter);

  return snapshot.utils.getScores(
    space,
    strategies,
    network,
    voters,
    snapshotBlockNumber
  );
};

export default function useScores({
  tokenContractAddress,
  tokenSymbol,
  proposals,
}: {
  tokenContractAddress: string;
  tokenSymbol: string;
  proposals?: SnapshotProposalExtended[];
}) {
  const [data, setData] = useState<{ [proposalId: string]: SnapshotScore }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useDeepCompareEffect(() => {
    if (proposals === undefined) {
      setData(undefined);
      return;
    }

    setLoading(true);
    Promise.all(
      proposals.map((proposal) => {
        if (!proposal.votes) return [];

        return getScores({
          space: proposal.space.name,
          tokenContractAddress,
          tokenSymbol,
          snapshotBlockNumber: proposal.snapshot,
          votes: proposal.votes,
        });
      })
    )
      .then((scores: SnapshotScore[][]) => {
        const flatScores = scores.flat();
        const scoresByProposal = proposals?.reduce(
          (map: { [proposalId: string]: SnapshotScore }, proposal, idx) => {
            map[proposal.id] = flatScores[idx];
            return map;
          },
          {}
        );

        setData(scoresByProposal);
      })
      .catch((e: Error) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [proposals ?? [], tokenContractAddress, tokenSymbol]);

  return { data, loading, error };
}
