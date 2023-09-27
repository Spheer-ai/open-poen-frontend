import styles from "../../assets/scss/FormLayout.module.scss";
import binIcon from "../../../public/bin-icon.svg";

const FormLayout = ({ title, children, showIcon }) => {
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
    </div>
  );
};

export default FormLayout;
