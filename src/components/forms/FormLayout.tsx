import React from "react";
import styles from "../../assets/scss/FormLayout.module.scss";
import binIcon from "/bin-icon.svg";

interface FormLayoutProps {
  title?: string;
  children: React.ReactNode;
  showIcon: boolean;
  showOverviewButton?: boolean;
  reloadWindow?: () => void;
  showHr?: boolean;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  children,
  showIcon,
  showOverviewButton = false,
  reloadWindow,
  showHr = true,
}) => {
  return (
    <div className={styles["form-container"]}>
      <div className={styles["form-header"]}>
        {showIcon && (
          <img src={binIcon} alt="Trash Bin" className={styles.binIcon} />
        )}
        {title && <h2>{title}</h2>}
      </div>
      {showHr && <hr />}
      {children}
      {showOverviewButton && (
        <div className={styles["button-container"]}>
          <button
            className={`${styles["confirm-button"]} ${
              showOverviewButton ? "" : styles["hidden"]
            }`}
            onClick={reloadWindow}
          >
            Ga terug naar het overzicht
          </button>
        </div>
      )}
    </div>
  );
};

export default FormLayout;
