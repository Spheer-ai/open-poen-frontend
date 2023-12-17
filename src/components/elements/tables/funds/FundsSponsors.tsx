import React from "react";

interface FundsSponsorsProps {
  grantId?: number;
  grantName?: string;
  grantReference?: string;
  grantBudget?: number;
}

const FundsSponsors: React.FC<FundsSponsorsProps> = ({
  grantId,
  grantName,
  grantReference,
  grantBudget,
}) => {
  return (
    <div>
      {grantName && <p>{grantName}</p>}
      {grantReference && <p>Beslissingsnummer/referentie {grantReference}</p>}
      {grantBudget && <p>Begroting: {grantBudget}</p>}
    </div>
  );
};

export default FundsSponsors;
