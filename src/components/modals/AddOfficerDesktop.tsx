import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { addOfficerToGrant, getUsers } from "../middleware/Api";
import { Officer } from "../../types/AddOfficerType";

interface AddOfficerDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onOfficerAdded: () => void;
  sponsorId?: string;
  regulationId?: string;
  grantId?: string;
  officers: Officer[];
}

const AddOfficerDesktop: React.FC<AddOfficerDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onOfficerAdded,
  sponsorId,
  regulationId,
  grantId,
  officers,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [selectedOfficerId, setSelectedOfficerId] = useState<number | null>(
    null,
  );
  const [allUsers, setAllUsers] = useState<Officer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addedOfficers, setAddedOfficers] = useState<Officer[]>([]);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchAndSetUsers() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is not available in localStorage");
          return;
        }
        const response = await getUsers(token);
        setAllUsers(response.users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    }
    fetchAndSetUsers();
  }, []);

  const handleOfficerSelect = (officer: Officer) => {
    if (!addedOfficers.includes(officer)) {
      setAddedOfficers((prev) => [...prev, officer]);
    }
    setSelectedOfficerId(officer.id);
    setSearchTerm("");
  };
  const handleAddOfficer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      console.log("sponsorId", sponsorId);
      console.log("regulationId", regulationId);
      console.log("grantId", grantId);
      console.log("selectedOfficerId", selectedOfficerId);

      if (!sponsorId || !regulationId || !grantId || !selectedOfficerId) {
        console.error("Required IDs are not available.");
        return;
      }

      await addOfficerToGrant(
        token,
        Number(sponsorId),
        Number(regulationId),
        Number(grantId),
        [selectedOfficerId],
      );
      handleClose();
      onOfficerAdded();
    } catch (error) {
      console.error("Failed to add officer:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
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
        <h2 className={styles.title}>Penvoerder aanmaken</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Penvoerders</h3>
          <ul className={styles["officers-list"]}>
            {addedOfficers.map((officer) => (
              <li key={officer.id}>{officer.email}</li>
            ))}
          </ul>
          <label className={styles.label}>Selecteer een penvoerder...</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Vul een e-mailadres in..."
            className={`${styles.inputDefault} ${
              searchTerm && styles.inputWithResults
            }`}
          />
          {searchTerm && (
            <div
              className={`${styles.dropdownContainer} ${
                searchTerm && styles.dropdownWithResults
              }`}
            >
              <div className={styles.dropdown}>
                {allUsers
                  .filter((user) => user.email.includes(searchTerm))
                  .map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleOfficerSelect(user)}
                    >
                      {user.email}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleAddOfficer} className={styles.saveButton}>
            Toevoegen
          </button>
        </div>
      </div>
    </>
  );
};

export default AddOfficerDesktop;
