import { useProposalGroups } from "../hooks/Proposals";
import format from "date-fns/format";
import Select, { SingleValue } from "react-select";

const formatDateText = (seconds: number) => {
  return format(new Date(seconds * 1000), "yyyy-MM-dd");
};

type OptionType = {
  value: number;
  label: string;
};

export default function FundingCycleSelector({
  space,
  onChange,
}: {
  space: string;
  value?: SingleValue<OptionType>;
  onChange?: (val?: number) => void;
}) {
  const { data: proposalGroups, loading } = useProposalGroups(space);

  const proposalGroupDates = Object.keys(proposalGroups || [])
    .map((v) => parseInt(v, 10))
    .sort((a, b) => b - a); // sort descending order

  const onSelectChange = (option: SingleValue<OptionType>) => {
    return onChange?.(option?.value);
  };

  const selectOptions = proposalGroupDates.map((d) => ({
    value: d,
    label: formatDateText(d),
  }));

  return proposalGroupDates ? (
    <Select
      isLoading={loading}
      options={selectOptions}
      onChange={onSelectChange}
    />
  ) : null;
}
