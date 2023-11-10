import React from "react";
import styles from "../../../../../assets/scss/layout/AddFundDesktop.module.scss";

interface AddedEmailsListProps {
  userEmails: string[];
}

const AddedEmailsList: React.FC<AddedEmailsListProps> = ({ userEmails }) => {
  return (
    <div>
      <ul className={styles["search-result"]}>
        <h4>De volgende personen worden toegevoegd:</h4>
        {userEmails.map((email, index) => (
          <>
            <li key={index}>{email}</li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default AddedEmailsList;
