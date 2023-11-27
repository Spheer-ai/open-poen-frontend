import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { addFund } from "../middleware/Api";

interface AddFundDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundAdded: () => void;
  funderId: number;
  regulationId: number;
  grantId: number;
}

const AddFundDesktop: React.FC<AddFundDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundAdded,
  funderId,
  regulationId,
  grantId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  const [fundData, setFundData] = useState({
    name: "",
    description: "",
    purpose: "",
    target_audience: "",
    budget: "0",
    owner: "",
    owner_email: "",
    legal_entity: "stichting",
    address_applicant: "",
    location: "",
    hidden_sponsors: false,
    hidden: false,
  });

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      const requestData = {
        name: fundData.name,
        description: fundData.description,
        purpose: fundData.purpose,
        target_audience: fundData.target_audience,
        owner: fundData.owner,
        owner_email: fundData.owner_email,
        legal_entity: fundData.legal_entity,
        address_applicant: fundData.address_applicant,
        kvk_registration: fundData.address_applicant,
        location: fundData.location,
        hidden_sponsors: fundData.hidden_sponsors,
        hidden: fundData.hidden,
        budget: parseFloat(fundData.budget),
      };

      console.log("Data being sent to the server:", requestData);

      const response = await addFund(
        funderId,
        regulationId,
        grantId,
        token,
        requestData,
      );

      console.log("Response from the server:", response);

      handleClose();
      onFundAdded();
    } catch (error) {
      console.error("Failed to create fund:", error);
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFundData({
      ...fundData,
      [name]: value,
    });
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
        <h2 className={styles.title}>Initiatief toevoegen</h2>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Over initiatief</label>
          <input
            type="text"
            placeholder="Enter fund name"
            name="name"
            value={fundData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Beschrijving:</label>
          <textarea
            className={styles.description}
            placeholder="Enter fund description"
            name="description"
            value={fundData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doel:</label>
          <input
            type="text"
            placeholder="Enter fund purpose"
            name="purpose"
            value={fundData.purpose}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doelgroep:</label>
          <input
            type="text"
            placeholder="Enter target audience"
            name="target_audience"
            value={fundData.target_audience}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Begroting:</label>
          <input
            type="number"
            placeholder="Enter amount"
            name="budget"
            value={fundData.budget}
            onChange={handleInputChange}
          />
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

export default AddFundDesktop;
