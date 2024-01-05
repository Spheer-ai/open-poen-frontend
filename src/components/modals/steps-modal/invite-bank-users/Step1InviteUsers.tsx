import React, { useState, useEffect } from "react";
import styles from "../../../../assets/scss/layout/AddFundDesktop.module.scss";
import {
  linkUsersToBankAccount,
  fetchBankAccount,
} from "../../../middleware/Api";
import AddedEmailsList from "./added-users/AddedEmailList";
import SearchUsers from "./added-users/SearchUsers";

interface UserProfile {
  email: string;
  userId: number;
  profile_picture: {
    attachment_thumbnail_url_128: string | null;
  } | null;
}

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
  const [alreadyAddedEmails, setAlreadyAddedEmails] = useState<UserProfile[]>(
    [],
  );
  const [searchResults, setSearchResults] = useState<
    {
      email: string;
      userId: number;
    }[]
  >([]);
  const [bankInfo, setBankInfo] = useState<{
    logo: string | null;
    iban: string | null;
    name: string | null;
    institution_name: string | null;
  }>({
    logo: null,
    iban: null,
    name: null,
    institution_name: null,
  });

  useEffect(() => {
    if (bankAccountId !== null) {
      fetchBankAccount(userId, token, bankAccountId)
        .then((bankAccountData) => {
          const addedEmails = bankAccountData.users.map((userData) => ({
            email: userData.email,
            userId: userData.id,
            profile_picture: userData.profile_picture,
          }));
          setAlreadyAddedEmails(addedEmails);
          setIsLoading(false);

          setBankInfo({
            logo: bankAccountData.logo,
            iban: bankAccountData.iban,
            name: bankAccountData.name,
            institution_name: bankAccountData.institution_name,
          });
        })
        .catch((error) => {
          console.error("Error fetching added email addresses:", error);
          setIsLoading(false);
        });
    }
  }, [bankAccountId, userId, token]);

  useEffect(() => {
    const initialUserIds = alreadyAddedEmails.map((user) => user.userId);
    setUserIds(initialUserIds);
  }, [alreadyAddedEmails]);

  useEffect(() => {
    const userIdsString = userIds.join(", ");
    console.log("User IDs in the background:", userIdsString);
  }, [alreadyAddedEmails, userIds]);

  const handleNext = () => {
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
    const updatedResults = searchResults.filter(
      (result) => result.email !== user.email,
    );
    setSearchResults(updatedResults);
  };

  const deleteAddedEmail = (userIdToDelete: number) => {
    const updatedUserIds = userIds.filter((id) => id !== userIdToDelete);
    setUserIds(updatedUserIds);

    const updatedUserEmails = userEmails.filter(
      (_, index) => userIds[index] !== userIdToDelete,
    );
    setUserEmails(updatedUserEmails);

    const updatedAddedEmails = alreadyAddedEmails.filter(
      (user) => user.userId !== userIdToDelete,
    );
    setAlreadyAddedEmails(updatedAddedEmails);
  };

  const updateSearchResults = (
    results: {
      email: string;
      userId: number;
    }[],
  ) => {
    setSearchResults(results);
  };

  return (
    <div className={styles.step1}>
      {isLoading ? (
        <p>Loading email addresses...</p>
      ) : (
        <>
          <div className={styles.bankInfo}>
            {bankInfo.institution_name === "Sandbox" ? (
              <div className={styles.bankLogo}>
                <img
                  src="/sandbox-bank.png"
                  alt="Sandbox Bank Logo"
                  width="80"
                  height="80"
                />
              </div>
            ) : (
              bankInfo.logo && (
                <div className={styles.bankLogo}>
                  <img
                    src={bankInfo.logo}
                    alt={`${bankInfo.name} Logo`}
                    width="80"
                    height="80"
                  />
                </div>
              )
            )}

            <div className={styles.bankDetails}>
              <p className={styles.bankName}>{bankInfo.institution_name}</p>
              {bankInfo.name && <p className={styles.name}>{bankInfo.name}</p>}
              {bankInfo.iban && (
                <p className={styles.bankIban}>IBAN: {bankInfo.iban}</p>
              )}
            </div>
          </div>

          <ul className={styles["profile-list"]}>
            {alreadyAddedEmails.map((user, index) => (
              <li key={index} className={styles["profile-list-item"]}>
                <div className={styles["profile-container"]}>
                  {user.profile_picture ? (
                    <img
                      src={
                        user.profile_picture.attachment_thumbnail_url_128 ||
                        "/profile-placeholder.png"
                      }
                      alt={`${user.email} Profile Picture`}
                      width="40"
                      height="40"
                      className={styles["profile-picture"]}
                    />
                  ) : (
                    <img
                      src="/profile-placeholder.png"
                      alt="Profile Placeholder"
                      width="40"
                      height="40"
                      className={styles["profile-picture"]}
                    />
                  )}
                  {user.email}
                </div>
                <button
                  className={styles["danger-button"]}
                  onClick={() => deleteAddedEmail(user.userId)}
                >
                  Verwijderen
                </button>
              </li>
            ))}
          </ul>
          <h3>Geef toegang tot "{bankInfo.institution_name}" bankrekening</h3>
        </>
      )}

      <SearchUsers
        onAddUser={addUserEmail}
        searchResults={searchResults}
        updateSearchResults={updateSearchResults}
        alreadyAddedEmails={alreadyAddedEmails}
      />
      <AddedEmailsList userEmails={userEmails} />
      <input type="hidden" value={userIds.join(", ")} onChange={() => {}} />

      <button className={styles.saveButton} onClick={handleNext}>
        Volgende
      </button>
    </div>
  );
};

export default Step1InviteUsers;
