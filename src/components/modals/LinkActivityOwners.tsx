import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { updateActivityOwners, searchUsersByEmail } from "../middleware/Api";
import deleteIcon from "/delete-icon.svg";

interface User {
  id: string;
  email: string;
}

interface LinkActivityOwnerProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onActivityOwnerLinked: () => void;
  initiativeId: string;
  activityId: string;
  token: string;
  activityOwners: any[];
}

const LinkActivityOwner: React.FC<LinkActivityOwnerProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onActivityOwnerLinked,
  initiativeId,
  activityId,
  token,
  activityOwners: initialActivityOwners,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [selectedUserEmails, setSelectedUserEmails] = useState<Set<string>>(
    new Set(),
  );
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityOwners, setActivityOwners] = useState<User[]>(
    initialActivityOwners,
  );

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleUserSelect = (user: User) => {
    setSelectedUserEmails((prevEmails) => new Set(prevEmails.add(user.email)));
    setSearchedUsers([]);
  };

  const handleRemoveUser = (userEmail: string) => {
    setSelectedUserEmails((prevEmails) => {
      const newEmails = new Set(prevEmails);
      newEmails.delete(userEmail);
      return newEmails;
    });

    setActivityOwners((prevOwners) =>
      prevOwners.filter((owner) => owner.email !== userEmail),
    );
  };

  const handleSearch = async () => {
    try {
      console.log("Searching for users with searchTerm:", searchTerm);

      const trimmedSearchTerm = searchTerm.trim();

      if (trimmedSearchTerm.length < 3) {
        setSearchedUsers([]);
        return;
      }

      const usersWithEmails = await searchUsersByEmail(
        token,
        trimmedSearchTerm,
      );
      console.log("Users with emails:", usersWithEmails);

      setSearchedUsers(usersWithEmails);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 3) {
      handleSearch();
    }
  }, [searchTerm]);

  const handleSave = async () => {
    try {
      const existingOwnerIds = activityOwners.map((owner) => owner.id);
      const selectedUserIds = Array.from(selectedUserEmails)
        .map((email) => {
          const owner = searchedUsers.find((user) => user.email === email);
          return owner ? owner.id : null;
        })
        .filter((id) => id !== null);

      const updatedOwners = [...existingOwnerIds, ...selectedUserIds];

      console.log("Data being sent to API:", {
        initiativeId,
        updatedOwners,
        token,
      });

      await updateActivityOwners(
        initiativeId,
        activityId,
        updatedOwners,
        token,
      );
      onActivityOwnerLinked();
      handleClose();
    } catch (error) {
      console.error("Error updating initiative owners:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  if (!isOpen && !modalIsOpen) {
    return null;
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>
      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <h2 className={styles.title}>Activiteitnemers toevoegen</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Zoeken</h3>

          <input
            type="text"
            placeholder="Search users by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={handleSearch}
          />
          {searchedUsers.length > 0 && (
            <div className={styles.dropdown}>
              <ul className={styles.formList}>
                {searchedUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={styles.formListItem}
                  >
                    {user.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className={styles.formGroup}>
          <h3>Activiteitnemers:</h3>
          <ul className={styles.formList}>
            {activityOwners.map((owner) => (
              <li key={owner.id} className={styles.formListItem}>
                {owner.email}
                <button
                  onClick={() => handleRemoveUser(owner.email)}
                  className={styles.removeButton}
                >
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </li>
            ))}
            {Array.from(selectedUserEmails).map((userEmail) => (
              <li key={userEmail} className={styles.formListItem}>
                {userEmail}
                <button
                  onClick={() => handleRemoveUser(userEmail)}
                  className={styles.removeButton}
                >
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  );
};

export default LinkActivityOwner;
