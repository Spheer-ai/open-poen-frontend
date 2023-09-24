import styles from "./InitiativeItem.module.scss";

function InitiativeItem({ initiative }) {
  return (
    <div className={styles["initiative-item"]}>
      <h4>{initiative.name}</h4>
      <p>Description: {initiative.description}</p>
      <p>Owner: {initiative.owner}</p>
      {initiative.owner_email && <p>Email: {initiative.owner_email}</p>}
    </div>
  );
}

export default InitiativeItem;
