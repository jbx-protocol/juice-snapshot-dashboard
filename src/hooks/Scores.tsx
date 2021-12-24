import snapshot from "@snapshot-labs/snapshot.js";
import { useState } from "react";
import { useDeepCompareEffect } from "react-use";

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
  votes: any[];
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
  const voters = votes.map((v: any) => v.voter);

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
  proposals?: any;
}) {
  const [data, setData] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useDeepCompareEffect(() => {
    if (!proposals) return;

    setLoading(true);

    Promise.all(
      proposals?.map((p: any) => {
        return getScores({
          space: p.space.name,
          tokenContractAddress,
          tokenSymbol,
          snapshotBlockNumber: p.snapshot,
          votes: p.votes,
        });
      })
    )
      .then((scores) => {
        const scoresByProposal = proposals?.reduce(
          (map: any, p: any, i: any) => {
            map[p.id] = scores[i][0];
            return map;
          },
          {}
        );

        setData(scoresByProposal);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [proposals]);

  return { data, loading, error };
}
