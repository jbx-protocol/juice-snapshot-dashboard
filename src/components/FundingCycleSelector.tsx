import { useProposalGroups } from "../hooks/Proposals";
import format from "date-fns/format";
import Select, { SingleValue, StylesConfig } from "react-select";
import { useCallback, useEffect, useState } from "react";

const formatDateText = (seconds: number) => {
  return format(new Date(seconds * 1000), "yyyy-MM-dd");
};

type OptionType = {
  value: number;
  label: string;
};

export default function FundingCycleSelector({
  id,
  space,
  onChange,
}: {
  id: string;
  space: string;
  onChange?: (val?: number) => void;
}) {
  const { data: proposalGroups, loading } = useProposalGroups(space);
  const [val, setVal] = useState<SingleValue<OptionType>>();
  const [loaded, setLoaded] = useState<boolean>();
  const proposalDateGroups = Object.keys(proposalGroups || [])
    .map((v) => parseInt(v, 10))
    .sort((a, b) => b - a); // sort descending order

  const onSelectChange = useCallback(
    (option: SingleValue<OptionType>) => {
      setVal(option);
      onChange?.(option?.value);
    },
    [onChange]
  );

  const selectOptions = proposalDateGroups.map((d) => ({
    value: d,
    label: formatDateText(d),
  }));

  useEffect(() => {
    if (!loaded && selectOptions?.[0]) {
      setLoaded(true);
      onSelectChange(selectOptions[0]);
    }
  }, [loaded, selectOptions, onSelectChange]);

  const colourStyles: StylesConfig<any> = {
    control: (styles) => ({ ...styles, borderRadius: 0 }),
    option: (styles) => {
      return {
        ...styles,
        borderRadius: 0,
      };
    },
    input: (styles) => ({ ...styles, borderRadius: 0 }),
  };

  return proposalDateGroups ? (
    <Select
      id={id}
      isLoading={loading}
      options={selectOptions}
      onChange={onSelectChange}
      styles={colourStyles}
      placeholder="Select date"
      value={val}
    />
  ) : null;
}
