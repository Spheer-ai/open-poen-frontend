import React, { useState, useEffect } from "react";
import Select, { SingleValue, ActionMeta } from "react-select";
import styles from "../../../../assets/scss/TransactionOverview.module.scss";

interface TransactionFiltersProps {
  transactions: Array<{
    iban: string;
    initiative_name: string;
    activity_name: string;
  }>;
  onFilter: (filters: {
    iban: string;
    initiative: string | null;
    activity: string | null;
  }) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const TransactionFilters: React.FC<
  TransactionFiltersProps & {
    ibanFilter: string;
    setIbanFilter: React.Dispatch<React.SetStateAction<string>>;
    initiativeFilter: string;
    setInitiativeFilter: React.Dispatch<React.SetStateAction<string>>;
    activityFilter: string;
    setActivityFilter: React.Dispatch<React.SetStateAction<string>>;
  }
> = ({
  transactions,
  onFilter,
  ibanFilter,
  setIbanFilter,
  initiativeFilter,
  setInitiativeFilter,
  activityFilter,
  setActivityFilter,
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      color: "black",
      borderRadius: "6px",
      boxShadow: "none",
    }),
    input: (provided) => ({
      ...provided,
      color: "black",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "6px",
      padding: "10px 15px",
      width: "fit-content",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "black",
      width: "fit-content",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  useEffect(() => {
    onFilter({
      iban: ibanFilter,
      initiative: initiativeFilter,
      activity: activityFilter,
    });
  }, [ibanFilter, initiativeFilter, activityFilter, onFilter]);

  const uniqueIbans = Array.from(new Set(transactions.map((t) => t.iban))).map(
    (iban) => ({ value: iban, label: iban }),
  );

  const uniqueInitiatives = Array.from(
    new Set(transactions.map((t) => t.initiative_name)),
  )
    .filter((initiative) => initiative !== null)
    .map((initiative) => ({ value: initiative, label: initiative }));

  const uniqueActivities = Array.from(
    new Set(transactions.map((t) => t.activity_name)),
  )
    .filter((activity) => activity !== null)
    .map((activity) => ({ value: activity, label: activity }));

  const handleChange = (
    option: SingleValue<OptionType>,
    { name }: ActionMeta<OptionType>,
  ) => {
    const value = option ? option.value : "";
    switch (name) {
      case "iban":
        setIbanFilter(value);
        break;
      case "initiative":
        setInitiativeFilter(value);
        break;
      case "activity":
        setActivityFilter(value);
        break;
      default:
    }
  };

  return (
    <div className={styles.filterButtons}>
      <Select
        name="iban"
        options={uniqueIbans}
        value={uniqueIbans.find((option) => option.value === ibanFilter)}
        onChange={handleChange}
        isClearable
        placeholder="IBAN"
        styles={customStyles}
      />

      <Select
        name="initiative"
        options={uniqueInitiatives}
        value={uniqueInitiatives.find(
          (option) => option.value === initiativeFilter,
        )}
        onChange={handleChange}
        isClearable
        placeholder="Initiatief"
        styles={customStyles}
      />

      <Select
        name="activity"
        options={uniqueActivities}
        value={uniqueActivities.find(
          (option) => option.value === activityFilter,
        )}
        onChange={handleChange}
        isClearable
        placeholder="Activiteit"
        styles={customStyles}
      />
    </div>
  );
};

export default TransactionFilters;
