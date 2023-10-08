import React from "react";
import styles from "../../../assets/scss/layout/ResetPasswordLayout.module.scss";

function ResetPasswordLayout({ children }) {
  return <div className={styles["password-reset-layout"]}>{children}</div>;
}

export default ResetPasswordLayout;
