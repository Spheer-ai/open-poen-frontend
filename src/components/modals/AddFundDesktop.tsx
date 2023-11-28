import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { addFund, getUserGrants } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";

interface AddFundDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundAdded: () => void;
  funderId?: number;
  regulationId?: number;
}

const AddFundDesktop: React.FC<AddFundDesktopProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onFundAdded,
  funderId,
  regulationId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const { user } = useAuth();
  const [selectedGrantId, setSelectedGrantId] = useState<number | undefined>(
    undefined,
  );
  const [userGrants, setUserGrants] = useState<{ id: number; name: string }[]>(
    [],
  );

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

  useEffect(() => {
    const fetchUserGrants = async () => {
      try {
        if (!user?.token) {
          console.error("Token is not available in user object");
          return;
        }

        // Ensure userId is of type string if it's defined
        const userIdAsString = user.userId ? user.userId.toString() : undefined;

        if (userIdAsString) {
          // Use the user's token and the converted userId to fetch the user's grants
          const userGrants = await getUserGrants(userIdAsString, user.token);

          // Set the fetched grants in the state
          setUserGrants(userGrants);
        }
      } catch (error) {
        console.error("Failed to fetch user grants:", error);
      }
    };

    fetchUserGrants();
  }, [user]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      if (funderId === undefined || regulationId === undefined) {
        console.error("Missing required IDs (funderId or regulationId)");
        return;
      }

      if (selectedGrantId === undefined) {
        console.error("No grant selected");
        return;
      }

      const sanitizedFunderId = funderId === undefined ? 0 : funderId;
      const sanitizedRegulationId =
        regulationId === undefined ? 0 : regulationId;

      console.log("Selected grantId:", selectedGrantId); // Log the selected grantId

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
        sanitizedFunderId,
        sanitizedRegulationId,
        selectedGrantId, // Use selectedGrantId here
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
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Over het initiatief</h3>
          <label className={styles.labelField}>Kies een beschikking:</label>
          <select
            className={`${styles.grantDropdown}`}
            name="grantId"
            value={selectedGrantId || ""}
            onChange={(e) => setSelectedGrantId(Number(e.target.value))}
          >
            <option value="">Kies een beschikking</option>
            {userGrants.map((grant) => (
              <option
                className={styles.customOption}
                key={grant.id}
                value={grant.id}
              >
                {grant.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam initiatief:</label>
          <input
            type="text"
            placeholder="Vul de naam van het initiatief in"
            name="name"
            value={fundData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Beschrijving:</label>
          <textarea
            className={styles.description}
            placeholder="Vul de omschrijving van het initiatief in"
            name="description"
            value={fundData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doel:</label>
          <input
            type="text"
            placeholder="Vul de doelstelling van het initiatief in"
            name="purpose"
            value={fundData.purpose}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doelgroep:</label>
          <input
            type="text"
            placeholder="Vul de doelgroep van het initiatief in"
            name="target_audience"
            value={fundData.target_audience}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Begroting:</label>
          <input
            type="number"
            placeholder="Vul het begrootte bedrag in"
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
