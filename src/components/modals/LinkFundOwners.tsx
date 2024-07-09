import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { updateInitiativeOwners, searchUsersByEmail } from "../middleware/Api";
import { InitiativeOwner } from "../../types/EditFundTypes";
import useCachedImages from "../utils/images";

interface User {
  id: string;
  email: string;
}

export interface LinkFundOwnerProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundOwnerLinked: (newOwners: InitiativeOwner[]) => void;
  initiativeId: string;
  token: string;
  initiativeOwners: InitiativeOwner[];
  onUpdateInitiativeOwners: (newOwners: InitiativeOwner[]) => void;
}

const LinkFundOwner: React.FC<LinkFundOwnerProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundOwnerLinked,
  initiativeId,
  token,
  initiativeOwners,
  onUpdateInitiativeOwners,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<InitiativeOwner[]>([]);
  const images = useCachedImages(["close", "deleteRed"]);

  const resetModalState = () => {
    setSelectedUsers([]);
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
    const newOwner: InitiativeOwner = {
      id: parseInt(user.id, 10),
      email: user.email,
      is_active: true,
      is_superuser: false,
      is_verified: false,
      first_name: "",
      last_name: "",
      biography: "",
      role: "user",
      profile_picture: null,
    };

    setSelectedUsers((prevSelectedUsers) => {
      if (!prevSelectedUsers.some((u) => u.email === user.email)) {
        return [...prevSelectedUsers, newOwner];
      }
      return prevSelectedUsers;
    });
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.id !== userId),
    );

    onUpdateInitiativeOwners(
      initiativeOwners.filter((owner) => owner.id !== userId),
    );
  };

  const handleSearch = async () => {
    try {
      const trimmedSearchTerm = searchTerm.trim();

      if (trimmedSearchTerm.length < 1) {
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
    if (searchTerm.length >= 1) {
      handleSearch();
    }
  }, [searchTerm]);

  const handleSave = async () => {
    try {
      const updatedOwners: InitiativeOwner[] = [
        ...initiativeOwners.filter(
          (owner) => !selectedUsers.some((user) => user.id === owner.id),
        ),
        ...selectedUsers,
      ];

      await updateInitiativeOwners(
        initiativeId,
        updatedOwners.map((owner) => owner.id.toString()),
        token,
      );

      onFundOwnerLinked(updatedOwners);
      onUpdateInitiativeOwners(updatedOwners);

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
        <div className={styles.formTop}>
          <h2 className={styles.title}>Initiatiefnemer toevoegen</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr />
        <div className={styles.formGroup}>
          <h3>Zoeken</h3>
          <input
            type="text"
            placeholder="Search users by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={handleSearch}
            onKeyPress={handleEnterKeyPress}
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
          <h3>Initiatiefnemers:</h3>
          <ul className={styles.formList}>
            {initiativeOwners.map((owner) => (
              <li key={owner.id} className={styles.formListItem}>
                {owner.email}
                <button
                  onClick={() => handleRemoveUser(owner.id)}
                  className={styles.removeButton}
                >
                  \
                  <img src={images.deleteRed} alt="Delete" />
                </button>
              </li>
            ))}
            {selectedUsers.map((user) => (
              <li key={user.id} className={styles.formListItem}>
                {user.email}
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className={styles.removeButton}
                >
                  <img src={images.deleteRed} alt="Delete" />
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

export default LinkFundOwner;
