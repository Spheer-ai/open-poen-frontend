import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import LoadingDot from "../animation/LoadingDot";
import useCachedImage from "../hooks/useCachedImage";
import { addFund, fetchGrantDetails } from "../middleware/Api";
import useCachedImages from "../utils/images";

const initialFormData = {
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
};

interface AddFundDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onFundAdded: () => void;
  funderId: number;
  regulationId: number;
  grantId?: string;
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
  const images = useCachedImages();
  const [grantDetails, setGrantDetails] = useState(null);
  const [fundData, setFundData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    grantId: "",
    name: "",
    description: "",
    purpose: "",
    target_audience: "",
    budget: "",
  });
  const closeIconSrc = useCachedImage("/assets/images/icons/icon-close.svg");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is not available in localStorage");
          return;
        }

        if (funderId && regulationId && grantId) {
          const grantDetailsData = await fetchGrantDetails(
            token,
            funderId,
            regulationId,
            grantId,
          );

          setGrantDetails(grantDetailsData);

          setFundData({
            ...fundData,
            name: grantDetailsData.name,
            budget: grantDetailsData.budget.toString(),
          });
        }
      } catch (error) {
        console.error("Error fetching grant details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDetails();
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen, funderId, regulationId, grantId]);

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

    if (!fundData.name) {
      validationErrors.name = "Vul een naam in";
      isValid = false;
    } else if (fundData.name.length > 65) {
      validationErrors.name = "Naam mag maximaal 65 tekens bevatten";
      isValid = false;
    }

    if (!fundData.description) {
      validationErrors.description = "Vul een beschrijving in";
      isValid = false;
    } else if (fundData.description.length > 200) {
      validationErrors.description =
        "Beschrijving mag maximaal 200 tekens bevatten";
      isValid = false;
    }

    if (!fundData.purpose) {
      validationErrors.purpose = "Vul een doel in";
      isValid = false;
    } else if (fundData.purpose.length > 65) {
      validationErrors.purpose = "Doel mag maximaal 65 tekens bevatten";
      isValid = false;
    }

    if (!fundData.target_audience) {
      validationErrors.target_audience = "Vul een doelgroep in";
      isValid = false;
    } else if (fundData.target_audience.length > 65) {
      validationErrors.target_audience =
        "Doelgroep mag maximaal 65 tekens bevatten";
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

      if (!validateFields()) {
        return;
      }

      const sanitizedFunderId = funderId === undefined ? 0 : funderId;
      const sanitizedRegulationId =
        regulationId === undefined ? 0 : regulationId;
      const sanitizedGrantId = grantId === undefined ? 0 : grantId;

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
        Number(sanitizedGrantId),
        token,
        requestData,
      );

      handleClose();
      onFundAdded();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
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
      setFundData(initialFormData);
      setErrors({
        grantId: "",
        name: "",
        description: "",
        purpose: "",
        target_audience: "",
        budget: "",
      });

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
        {isLoading ? (
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        ) : (
          <>
            <div className={styles.formTop}>
              <h2 className={styles.title}>Initiatief toevoegen</h2>
              <button onClick={handleClose} className={styles.closeBtn}>
                <img src={images.close} alt="Close Icon" />
              </button>
            </div>
            <hr></hr>
            <div className={styles.formGroup}>
              <h3>Info</h3>
              {errors.grantId && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
                  {errors.grantId}
                </span>
              )}
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
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
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
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
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
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
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
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
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
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
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
          </>
        )}
      </div>
    </>
  );
};

export default AddFundDesktop;
