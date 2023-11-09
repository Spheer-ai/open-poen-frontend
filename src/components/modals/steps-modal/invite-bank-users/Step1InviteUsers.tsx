import React, { useState, useEffect } from "react";
import styles from "../../../../assets/scss/layout/AddFundDesktop.module.scss";
import {
  linkUsersToBankAccount,
  fetchBankAccount,
} from "../../../middleware/Api";
import AddedEmailsList from "./added-users/AddedEmailList";
import SearchUsers from "./added-users/SearchUsers";

interface Step1InviteUsersProps {
  onNextStep: () => void;
  bankAccountId: number | null;
  userId: number;
  token: string;
}

const Step1InviteUsers: React.FC<Step1InviteUsersProps> = ({
  onNextStep,
  bankAccountId,
  userId,
  token,
}) => {
  const [userIds, setUserIds] = useState<number[]>([]);
  const [userEmails, setUserEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alreadyAddedEmails, setAlreadyAddedEmails] = useState<string[]>([]);

  useEffect(() => {
    if (bankAccountId !== null) {
      fetchBankAccount(userId, token, bankAccountId)
        .then((bankAccountData) => {
          const addedEmails = bankAccountData.users.map(
            (userData) => userData.email,
          );
          setAlreadyAddedEmails(addedEmails);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching added email addresses:", error);
          setIsLoading(false);
        });
    }
  }, [bankAccountId, userId, token]);

  const handleUserIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserIds(
      value
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "")
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id)),
    );
  };

  const handleNext = () => {
    console.log("Selected User IDs:", userIds);

    if (bankAccountId !== null) {
      linkUsersToBankAccount(userId, token, bankAccountId, userIds)
        .then(() => {
          onNextStep();
        })
        .catch((error) => {
          console.error("Error linking users to bank account:", error);
        });
    } else {
      console.error("Bank Account ID is null. Cannot link users.");
    }
  };

  const addUserEmail = (user: { email: string; userId: number }) => {
    setUserIds((prevUserIds) => [...prevUserIds, user.userId]);
    setUserEmails((prevUserEmails) => [...prevUserEmails, user.email]);
  };

  return (
    <div className={styles.step1}>
      <h3>Step 1: Invite Users</h3>
      <p>Enter user IDs or search for users by email:</p>

      {isLoading ? (
        <p>Loading email addresses...</p>
      ) : (
        <>
          <h3>Already Added Email Addresses</h3>
          <ul>
            {alreadyAddedEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
          <AddedEmailsList userEmails={userEmails} />
        </>
      )}

      <SearchUsers onAddUser={addUserEmail} />

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
