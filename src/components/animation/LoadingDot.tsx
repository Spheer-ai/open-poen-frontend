import styles from "./LoadingDot.module.scss";

const LoadingDot = ({ delay }) => {
  return (
    <div
      className={styles["loading-dot"]}
      style={{ animationDelay: `${delay}s` }}
    ></div>
  );
};

export default LoadingDot;
