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
  onActivityOwnerLinked: (newOwners: any[]) => void;
  initiativeId: string;
  activityId: string;
  token: string;
  activityOwners: any[];
  onUpdateActivityOwners: (newOwners: any[]) => void;
}

const LinkActivityOwner: React.FC<LinkActivityOwnerProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onActivityOwnerLinked,
  initiativeId,
  activityId,
  token,
  activityOwners,
  onUpdateActivityOwners,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserEmails, setSelectedUserEmails] = useState<Set<string>>(
    new Set(),
  );
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );

  const resetModalState = () => {
    setSelectedUserEmails(new Set());
    setSelectedUserIds(new Set());
    setSearchedUsers([]);
    setSearchTerm("");
  };

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
    const isUserAlreadyAdded = activityOwners.some(
      (owner) => owner.email === user.email,
    );

    setSelectedUserEmails((prevEmails) => {
      const newEmails = new Set(prevEmails);
      newEmails.add(user.email);
      return newEmails;
    });

    setSelectedUserIds((prevUserIds) => {
      const newUserIds = new Set(prevUserIds);
      newUserIds.add(user.id);
      return newUserIds;
    });
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUserEmails((prevEmails) => {
      const newEmails = new Set(prevEmails);
      const userToRemove = activityOwners.find((owner) => owner.id === userId);

      if (userToRemove) {
        newEmails.delete(userToRemove.email);
      }

      return newEmails;
    });

    setSelectedUserIds((prevUserIds) => {
      const newUserIds = new Set(prevUserIds);
      newUserIds.delete(userId);

      return newUserIds;
    });
    const updatedInitiativeOwners = activityOwners.filter(
      (owner) => owner.id !== userId,
    );
    onUpdateActivityOwners(updatedInitiativeOwners);
  };

  const handleSearch = async () => {
    try {
      const trimmedSearchTerm = searchTerm.trim();

      if (trimmedSearchTerm.length < 3) {
        setSearchedUsers([]);
        return;
      }

      const usersWithEmails = await searchUsersByEmail(
        token,
        trimmedSearchTerm,
      );

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
      const filteredActivityOwners = activityOwners.filter(
        (owner) => !selectedUserIds.has(owner.id),
      );

      const updatedOwners = [
        ...Array.from(selectedUserIds),
        ...filteredActivityOwners.map((owner) => owner.id),
      ];

      await updateActivityOwners(
        initiativeId,
        activityId,
        updatedOwners,
        token,
      );

      onActivityOwnerLinked(filteredActivityOwners);

      handleClose();
      resetModalState();
    } catch (error) {
      console.error("Error updating initiative owners:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
      resetModalState();
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
            {activityOwners.map((owner) => {
              if (!selectedUserIds.has(owner.id)) {
                return (
                  <li key={owner.id} className={styles.formListItem}>
                    {owner.email}
                    <button
                      onClick={() => handleRemoveUser(owner.id)}
                      className={styles.removeButton}
                    >
                      <img src={deleteIcon} alt="Delete" />
                    </button>
                  </li>
                );
              }
              return null;
            })}
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
            Annuleren
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
