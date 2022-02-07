import useCountdownTimer from "../hooks/CountdownTimer";

export default function FundingCycleTimer({ endTime }: { endTime: number }) {
  // use first proposal as timer reference.
  // Each active proposal should (in theory) have the same end time.
  const fundingCycleEndTimer = useCountdownTimer({ end: endTime });

  return <h3>{fundingCycleEndTimer}</h3>;
}
