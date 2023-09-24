import styles from "./InitiativeList.module.scss";

function InitiativeList({ initiatives }) {
  return (
    <ul className={styles["initiative-list"]}>
      {initiatives.map((initiative) => (
        <li key={initiative.id}>{initiative.name}</li>
      ))}
    </ul>
  );
}

export default InitiativeList;
