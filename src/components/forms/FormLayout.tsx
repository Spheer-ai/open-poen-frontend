import React from "react";
import styles from "../../assets/scss/FormLayout.module.scss";
import binIcon from "../../../public/bin-icon.svg";

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
  showIcon: boolean;
  showOverviewButton?: boolean; // Add this prop
  reloadWindow?: () => void; // Add this prop
}

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  children,
  showIcon,
  showOverviewButton = false, // Default value is false
  reloadWindow,
}) => {
  return (
    <div className={styles["form-container"]}>
      <div className={styles["form-header"]}>
        {showIcon && (
          <img src={binIcon} alt="Trash Bin" className={styles.binIcon} />
        )}
        <h2>{title}</h2>
      </div>
      <hr />
      {children}
      {showOverviewButton && (
        <button
          className={`${styles["confirm-button"]} ${
            showOverviewButton ? "" : styles["hidden"]
          }`}
          onClick={reloadWindow}
        >
          Go back to overview
        </button>
      )}
    </div>
  );
};

export default FormLayout;
