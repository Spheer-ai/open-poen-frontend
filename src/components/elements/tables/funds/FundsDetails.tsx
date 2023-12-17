import React from "react";

interface FundDetailsProps {
  name?: string;
  description?: string;
  purpose?: string;
  target_audience?: string;
}

const FundDetails: React.FC<FundDetailsProps> = ({
  name,
  description,
  purpose,
  target_audience,
}) => {
  return (
    <div>
      <label>Naam</label>
      <p>{name}</p>
      <label>Beschrijving</label>
      <p>{description}</p>
      <label>Doel</label>
      <p>{purpose}</p>
      <label>Doelgroep</label>
      <p>{target_audience}</p>
    </div>
  );
};

export default FundDetails;
