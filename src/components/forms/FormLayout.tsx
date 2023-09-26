import styles from "../../assets/scss/FormLayout.module.scss";

const FormLayout = ({ title, children }) => {
    return (
      <div className={styles["form-container"]}>
        <div className={styles["form-header"]}>
          <h2>{title}</h2>
        </div>
        <hr />
        {children}
      </div>
    );
  };

export default FormLayout;
