import React, { useState } from "react";
import styles from "../../../../assets/scss/layout/AddFundDesktop.module.scss";

interface Step1InviteUsersProps {
  onNextStep: () => void;
  userEmails: string[];
}

const Step1InviteUsers: React.FC<Step1InviteUsersProps> = ({
  onNextStep,
  userEmails,
}) => {
  const [userIds, setUserIds] = useState<string[]>([]);

  const handleUserIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserIds(value.split(",").map((id) => id.trim()));
  };

  const handleNext = () => {
    onNextStep();
  };

  return (
    <div className={styles.step1}>
      <h3>Step 1: Enter User IDs</h3>
      <p>
        Enter the user IDs of the users you want to invite (comma-separated):
      </p>
      <ul>
        {userEmails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
      <input
        type="text"
        value={userIds.join(", ")}
        onChange={handleUserIdsChange}
        placeholder="User IDs (e.g., 123, 456, 789)"
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default Step1InviteUsers;
