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
  const [selectedGrantId, setSelectedGrantId] = useState<string | undefined>(
    "",
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

  const [errors, setErrors] = useState({
    grantId: "",
    name: "",
    description: "",
    purpose: "",
    target_audience: "",
    budget: "",
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
        const userIdAsString = user.userId ? user.userId.toString() : undefined;

        if (userIdAsString) {
          const userGrants = await getUserGrants(userIdAsString, user.token);
          setUserGrants(userGrants);
        }
      } catch (error) {
        console.error("Failed to fetch user grants:", error);
      }
    };

    fetchUserGrants();
  }, [user]);

  const validateFields = () => {
    let isValid = true;

    const validationErrors = {
      grantId: "",
      name: "",
      description: "",
      purpose: "",
      target_audience: "",
      budget: "",
    };

    if (selectedGrantId === undefined) {
      validationErrors.grantId =
        "Kies een beschikking om een initiatief toe te voegen";
    }

    if (!fundData.name) {
      validationErrors.name = "Vul een naam in";
      isValid = false;
    }

    if (!fundData.description) {
      validationErrors.description = "Vul een beschrijving in";
      isValid = false;
    }

    if (!fundData.purpose) {
      validationErrors.purpose = "Vul een doel in";
      isValid = false;
    }

    if (!fundData.target_audience) {
      validationErrors.target_audience = "Vul een doelgroep in";
      isValid = false;
    }

    if (!fundData.budget || isNaN(parseFloat(fundData.budget))) {
      validationErrors.budget = "Vul een geldig begrotingsbedrag in";
      isValid = false;
    } else {
      const budgetValue = parseFloat(fundData.budget);
      if (budgetValue < 0) {
        validationErrors.budget = "Begroting mag niet negatief zijn.";
        isValid = false;
      } else if (budgetValue === 0) {
        validationErrors.budget = "Vul een begroting in.";
        isValid = false;
      } else if (budgetValue > 999999) {
        validationErrors.budget =
          "Het bedrag is te hoog, vul een lager bedrag in.";
        isValid = false;
      }
    }

    setErrors(validationErrors);

    return isValid;
  };

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
        setErrors({
          ...errors,
          grantId: "Kies een beschikking om een initiatief aan te maken",
        });
        return;
      }

      if (!validateFields()) {
        return;
      }

      const sanitizedFunderId = funderId === undefined ? 0 : funderId;
      const sanitizedRegulationId =
        regulationId === undefined ? 0 : regulationId;

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

      const response = await addFund(
        sanitizedFunderId,
        sanitizedRegulationId,
        Number(selectedGrantId),
        token,
        requestData,
      );

      console.log("Response from the server:", response);

      handleClose();
      onFundAdded();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setErrors({
            ...errors,
            grantId: "Kies een beschikking om een initiatief aan te maken",
          });
        } else if (error.response.status === 409) {
          setErrors({
            ...errors,
            name: "Naam is al in gebruik",
          });
        } else if (error.response.status === 422) {
          setErrors({
            ...errors,
            name: "Naam mag maximaal 65 tekens bevatten",
            purpose: "Doel mag maximaal 65 tekens bevatten",
            target_audience: "Doelgroep mag maximaal 65 tekens bevatten",
            description: "Beschrijving mag maximaal 200 tekens bevatten",
          });
        } else {
          console.error("Failed to create fund:", error);
        }
      }
    }
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      setModalIsOpen(false);
      onClose();
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
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
          <h3>Info</h3>
          <label className={styles.labelField}>Kies een beschikking:</label>
          <select
            className={`${styles.grantDropdown}`}
            name="grantId"
            value={selectedGrantId || ""}
            onChange={(e) => setSelectedGrantId(String(e.target.value))}
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
          {errors.grantId && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.grantId}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Naam initiatief:</label>
          <input
            type="text"
            placeholder="Vul de naam van het initiatief in"
            name="name"
            value={fundData.name}
            onChange={handleInputChange}
            onKeyDown={handleEnterKeyPress}
          />
          {errors.name && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.name}
            </span>
          )}
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
          {errors.description && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.description}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doel:</label>
          <input
            type="text"
            placeholder="Vul de doelstelling van het initiatief in"
            name="purpose"
            value={fundData.purpose}
            onChange={handleInputChange}
            onKeyDown={handleEnterKeyPress}
          />
          {errors.purpose && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.purpose}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Doelgroep:</label>
          <input
            type="text"
            placeholder="Vul de doelgroep van het initiatief in"
            name="target_audience"
            value={fundData.target_audience}
            onChange={handleInputChange}
            onKeyDown={handleEnterKeyPress}
          />
          {errors.target_audience && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.target_audience}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelField}>Begroting:</label>
          <input
            type="number"
            placeholder="Vul het begrootte bedrag in"
            name="budget"
            value={fundData.budget}
            onChange={handleInputChange}
            onKeyDown={handleEnterKeyPress}
          />
          {errors.budget && (
            <span style={{ color: "red", display: "block", marginTop: "5px" }}>
              {errors.budget}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <div className={styles.roleOptions}>
            <label className={styles.labelField}>
              <input
                type="checkbox"
                name="hidden"
                checked={fundData.hidden}
                onChange={(e) =>
                  setFundData({
                    ...fundData,
                    hidden: e.target.checked,
                  })
                }
              />
              Verberg initiatief
            </label>
          </div>
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
