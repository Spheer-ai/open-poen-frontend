import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import {
  addOfficerToGrant,
  getUsers,
  getGrantOverseers,
} from "../middleware/Api";
import { Officer } from "../../types/AddOfficerType";
import useCachedImages from "../utils/images";

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
  const images = useCachedImages();

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
    if (isOpen) {
      async function fetchAndSetOverseers() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token is not available in localStorage");
            return;
          }

          if (!sponsorId || !regulationId || !grantId) {
            console.error("Required IDs are not available.");
            return;
          }

          const overseers = await getGrantOverseers(
            Number(sponsorId),
            Number(regulationId),
            Number(grantId),
            token,
          );

          const overseerEmails = overseers.map((overseer) => ({
            id: overseer.id,
            email: overseer.email,
          }));

          setAddedOfficers(overseerEmails);
        } catch (error) {
          console.error("Error fetching overseers:", error);
        }
      }
      fetchAndSetOverseers();
    }
  }, [isOpen, sponsorId, regulationId, grantId]);

  useEffect(() => {
    if (isOpen) {
      async function fetchAllUsers() {
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
      fetchAllUsers();
    }
  }, [isOpen]);

  const handleOfficerSelect = (officer: Officer) => {
    if (!addedOfficers.some((added) => added.id === officer.id)) {
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

      if (!sponsorId || !regulationId || !grantId || !selectedOfficerId) {
        console.error("Required IDs are not available.");
        return;
      }

      let officerIds = addedOfficers.map((officer) => officer.id);

      if (selectedOfficerId && !officerIds.includes(selectedOfficerId)) {
        officerIds.push(selectedOfficerId);
      }

      if (officerIds.length === 0) {
        console.error("No officer IDs to send.");
        return;
      }

      await addOfficerToGrant(
        token,
        Number(sponsorId),
        Number(regulationId),
        Number(grantId),
        officerIds,
      );

      handleClose();
      onOfficerAdded();
    } catch (error) {
      console.error("Failed to add officer:", error);
    }
  };

  const handleRemoveOfficer = (officerId: number) => {
    const updatedOfficers = addedOfficers.filter(
      (officer) => officer.id !== officerId,
    );
    setAddedOfficers(updatedOfficers);
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
        <div className={styles.formTop}>
          <h2 className={styles.title}>Penvoerder aanmaken</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Penvoerders</h3>
          <ul className={styles["officers-list"]}>
            {addedOfficers.map((officer) => (
              <li key={officer.id}>
                {officer.email}
                <img
                  src={images.deleteRed}
                  alt="Delete"
                  className={styles.deleteIcon}
                  onClick={() => handleRemoveOfficer(officer.id)}
                />
              </li>
            ))}
          </ul>
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
