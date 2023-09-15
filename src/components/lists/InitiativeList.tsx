import React from "react";

function InitiativeList({ initiatives }) {
  return (
    <ul className="initiative-list">
      {initiatives.map((initiative) => (
        <li key={initiative.id}>{initiative.name}</li>
      ))}
    </ul>
  );
}

export default InitiativeList;
