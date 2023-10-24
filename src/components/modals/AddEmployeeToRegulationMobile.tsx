import React, { useState, useEffect } from "react";
import styles from "../../assets/scss/layout/AddFundModal.module.scss";
import { addEmployeeToRegulation, getUsers } from "../middleware/Api";
import { Officer } from "../../types/AddOfficerType";

interface AddEmployeeToRegulationMobileProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onEmployeeAdded: () => void;
  sponsorId?: string;
  regulationId?: string;
}

const AddEmployeeToRegulationMobile: React.FC<
  AddEmployeeToRegulationMobileProps
> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onEmployeeAdded,
  sponsorId,
  regulationId,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null,
  );
  const [allUsers, setAllUsers] = useState<Officer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addedEmployees, setAddedEmployees] = useState<Officer[]>([]);

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
    if (!addedEmployees.includes(employee)) {
      setAddedEmployees((prev) => [...prev, employee]);
    }
    setSelectedEmployeeId(employee.id);
    setSearchTerm("");
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
      console.log("selectedEmployeeId", selectedEmployeeId);

      if (!sponsorId || !regulationId || !selectedEmployeeId) {
        console.error("Required IDs are not available.");
        return;
      }

      await addEmployeeToRegulation(
        token,
        Number(sponsorId),
        Number(regulationId),
        [selectedEmployeeId],
      );
      handleClose();
      onEmployeeAdded();
    } catch (error) {
      console.error("Failed to add employee:", error);
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
        <h2 className={styles.title}>Employee Toevoegen</h2>
        <hr></hr>
        <div className={styles.formGroup}>
          <label className={styles.label}>Search and Add an Employee:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email..."
          />
          {searchTerm && (
            <div className={styles.dropdown}>
              {allUsers
                .filter((user) => user.email.includes(searchTerm))
                .map((user) => (
                  <div key={user.id} onClick={() => handleEmployeeSelect(user)}>
                    {user.email}
                  </div>
                ))}
            </div>
          )}
        </div>
        <h3>Added Employees</h3>
        <ul>
          {addedEmployees.map((employee) => (
            <li key={employee.id}>{employee.email}</li>
          ))}
        </ul>
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

export default AddEmployeeToRegulationMobile;
