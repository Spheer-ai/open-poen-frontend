import React from "react";
import styles from "../../assets/scss//InitiativeList.module.scss";

export default function InitiativeList({ initiatives }) {
  return (
    <ul className={styles["initiative-list"]}>
      {initiatives.map((initiative) => (
        <li key={initiative.id}>{initiative.name}</li>
      ))}
    </ul>
  );
}
