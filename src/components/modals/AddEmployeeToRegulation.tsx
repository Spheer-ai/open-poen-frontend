import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import { addEmployeeToRegulation, getUsers } from "../middleware/Api";
import { Officer } from "../../types/AddOfficerType";

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
  sponsorId,
  regulationId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [selectedEmployees, setSelectedEmployees] = useState<Officer[]>([]);
  const [allUsers, setAllUsers] = useState<Officer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

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

  const handleEmployeeSelect = (employee: Officer) => {
    if (!selectedEmployees.some((selected) => selected.id === employee.id)) {
      setSelectedEmployees((prevSelected) => [...prevSelected, employee]);
    }
    setSearchTerm("");
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(event.target.value);
  };

  const handleAddEmployee = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is not available in localStorage");
        return;
      }

      console.log("sponsorId", sponsorId);
      console.log("regulationId", regulationId);
      console.log("selectedEmployees", selectedEmployees);
      console.log("selectedRole", selectedRole);

      if (
        !sponsorId ||
        !regulationId ||
        selectedEmployees.length === 0 ||
        !selectedRole
      ) {
        console.error("Required data is not available.");
        return;
      }
      const formattedRole =
        selectedRole === "grantOfficer" ? "grant officer" : "policy officer";
      const selectedEmployeeIds = selectedEmployees.map(
        (employee) => employee.id,
      );

      await addEmployeeToRegulation(
        token,
        Number(sponsorId),
        Number(regulationId),
        selectedEmployeeIds,
        formattedRole,
      );
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
        <h2 className={styles.title}>Medewerker aanmaken</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <h3>Medewerkers</h3>
          {selectedEmployees.length > 0 && (
            <ul className={styles["officers-list"]}>
              {selectedEmployees.map((employee) => (
                <li key={employee.id}>{employee.email}</li>
              ))}
            </ul>
          )}
          <label className={styles.label}>Selecteer een medewerker...</label>
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
                      onClick={() => handleEmployeeSelect(user)}
                    >
                      {user.email}
                    </div>
                  ))}
              </div>
            </div>
          )}
          <div className={styles["officer-checkbox"]}>
            <label className={styles.label}>Selecteer een rol:</label>
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxLabel}>
                <label htmlFor="policyOfficer">Beleidsmedewerker</label>
                <input
                  type="checkbox"
                  id="policyOfficer"
                  name="role"
                  value="policyOfficer"
                  checked={selectedRole === "policyOfficer"}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className={styles.checkboxLabel}>
                <label htmlFor="grantOfficer">Subsidiemedewerker</label>
                <input
                  type="checkbox"
                  id="grantOfficer"
                  name="role"
                  value="grantOfficer"
                  checked={selectedRole === "grantOfficer"}
                  onChange={handleCheckboxChange}
                />
              </div>
            </div>
          </div>
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
