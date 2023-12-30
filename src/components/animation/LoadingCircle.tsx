import React from "react";
import styles from "../../assets/scss/LoadingCircle.module.scss";

const LoadingCircle = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingCircle}></div>
    </div>
  );
};

export default LoadingCircle;
