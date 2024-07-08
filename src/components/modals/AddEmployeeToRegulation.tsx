import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import {
  addEmployeeToRegulation,
  getUsers,
  fetchRegulationDetails,
} from "../middleware/Api";
import { Officer } from "../../types/AddOfficerType";
import useCachedImages from "../utils/images";

interface AddEmployeeToRegulationProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onEmployeeAdded: () => void;
  sponsorId?: string;
  regulationId?: string;
}

const AddEmployeeToRegulation: React.FC<AddEmployeeToRegulationProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onEmployeeAdded,
  sponsorId = "",
  regulationId = "",
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const images = useCachedImages(["close", "deleteRed"]);
  const [searchTermGrantOfficer, setSearchTermGrantOfficer] = useState("");
  const [searchTermPolicyOfficer, setSearchTermPolicyOfficer] = useState("");
  const [filteredGrantOfficers, setFilteredGrantOfficers] = useState<Officer[]>(
    [],
  );
  const [filteredPolicyOfficers, setFilteredPolicyOfficers] = useState<
    Officer[]
  >([]);
  const [selectedGrantOfficers, setSelectedGrantOfficers] = useState<Officer[]>(
    [],
  );
  const [selectedPolicyOfficers, setSelectedPolicyOfficers] = useState<
    Officer[]
  >([]);
  const [addedGrantOfficers, setAddedGrantOfficers] = useState<Officer[]>([]);
  const [removedGrantOfficers, setRemovedGrantOfficers] = useState<Officer[]>(
    [],
  );
  const [addedPolicyOfficers, setAddedPolicyOfficers] = useState<Officer[]>([]);
  const [removedPolicyOfficers, setRemovedPolicyOfficers] = useState<Officer[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

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
    async function fetchData(searchTerm: string) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token is not available in localStorage");
          return;
        }

        const regulationDetails = await fetchRegulationDetails(
          token,
          sponsorId,
          regulationId,
        );
        const grantOfficers = regulationDetails.grant_officers || [];
        const policyOfficers = regulationDetails.policy_officers || [];

        setSelectedGrantOfficers(grantOfficers);
        setSelectedPolicyOfficers(policyOfficers);

        const allUsersResponse = await getUsers(token);

        if (allUsersResponse && allUsersResponse.users) {
          setFilteredGrantOfficers(allUsersResponse.users);
          setFilteredPolicyOfficers(allUsersResponse.users);
        } else {
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData(searchTermGrantOfficer);
  }, [sponsorId, regulationId]);

  const handleDeleteGrantOfficer = (user: Officer) => {
    setRemovedGrantOfficers((prevRemoved) => [...prevRemoved, user]);
    setSelectedGrantOfficers((prevSelected) =>
      prevSelected.filter((officer) => officer.id !== user.id),
    );
    setAddedGrantOfficers((prevAdded) =>
      prevAdded.filter((officer) => officer.id !== user.id),
    );
    setSearchTermGrantOfficer("");
  };

  const handleDeletePolicyOfficer = (user: Officer) => {
    setRemovedPolicyOfficers((prevRemoved) => [...prevRemoved, user]);
    setSelectedPolicyOfficers((prevSelected) =>
      prevSelected.filter((officer) => officer.id !== user.id),
    );
    setAddedPolicyOfficers((prevAdded) =>
      prevAdded.filter((officer) => officer.id !== user.id),
    );
    setSearchTermPolicyOfficer("");
  };

  const handleAddToGrantOfficers = (user: Officer) => {
    setAddedGrantOfficers((prevAdded) => [...prevAdded, user]);
    setSelectedGrantOfficers((prevSelected) => [...prevSelected, user]);
    setFilteredGrantOfficers((prevFiltered) =>
      prevFiltered.filter((officer) => officer.id !== user.id),
    );
    setSearchTermGrantOfficer("");
  };

  const handleAddToPolicyOfficers = (user: Officer) => {
    setAddedPolicyOfficers((prevAdded) => [...prevAdded, user]);
    setSelectedPolicyOfficers((prevSelected) => [...prevSelected, user]);
    setRemovedPolicyOfficers((prevRemoved) =>
      prevRemoved.filter((officer) => officer.id !== user.id),
    );
    setSearchTermPolicyOfficer("");
  };

  const handleAddEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      if (!sponsorId || !regulationId) {
        console.error("Required data is not available.");
        return;
      }

      await Promise.all([
        addEmployeeToRegulation(
          token,
          Number(sponsorId),
          Number(regulationId),
          selectedGrantOfficers.map((employee) => employee.id),
          "grant officer",
        ),
        addEmployeeToRegulation(
          token,
          Number(sponsorId),
          Number(regulationId),
          selectedPolicyOfficers.map((employee) => employee.id),
          "policy officer",
        ),
      ]);

      handleClose();
      onEmployeeAdded();
    } catch (error) {
      console.error("Failed to add employees:", error);
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
        <div className={styles.formTop}>
          <h2 className={styles.title}>Medewerker aanmaken</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Subsidiemedewerkers</h3>
          <ul className={styles["officers-list"]}>
            {selectedGrantOfficers.map((employee) => (
              <li key={employee.id}>
                {employee.email}
                <img
                  src={images.deleteRed}
                  alt="Delete"
                  onClick={() => handleDeleteGrantOfficer(employee)}
                />
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={searchTermGrantOfficer}
            onChange={(e) => setSearchTermGrantOfficer(e.target.value)}
            placeholder="Vul een e-mailadres in..."
            className={`${styles.inputDefault} ${
              searchTermGrantOfficer && styles.inputWithResults
            }`}
          />
          {searchTermGrantOfficer && (
            <div className={styles.dropdownContainer}>
              <div className={styles.dropdown}>
                {isLoading ? (
                  <div>Zoeken...</div>
                ) : filteredGrantOfficers.length > 0 ? (
                  filteredGrantOfficers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleAddToGrantOfficers(user)}
                    >
                      {user.email}
                    </div>
                  ))
                ) : (
                  <div>Geen resultaten gevonden</div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={styles.formGroup}>
          <h3>Beleidsmedewerkers</h3>
          <ul className={styles["officers-list"]}>
            {selectedPolicyOfficers.map((employee) => (
              <li key={employee.id}>
                {employee.email}
                <img
                  src={images.deleteRed}
                  alt="Delete"
                  onClick={() => handleDeletePolicyOfficer(employee)}
                />
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={searchTermPolicyOfficer}
            onChange={(e) => setSearchTermPolicyOfficer(e.target.value)}
            placeholder="Vul een e-mailadres in..."
            className={`${styles.inputDefault} ${
              searchTermPolicyOfficer && styles.inputWithResults
            }`}
          />
          {searchTermPolicyOfficer && (
            <div className={styles.dropdownContainer}>
              <div className={styles.dropdown}>
                {isLoading ? (
                  <div>Zoeken...</div>
                ) : filteredPolicyOfficers.length > 0 ? (
                  filteredPolicyOfficers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleAddToPolicyOfficers(user)}
                    >
                      {user.email}
                    </div>
                  ))
                ) : (
                  <div>Geen resultaten gevonden</div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleAddEmployee} className={styles.saveButton}>
            Toevoegen
          </button>
        </div>
      </div>
    </>
  );
};

export default AddEmployeeToRegulation;
