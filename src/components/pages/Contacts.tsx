import React, { useState, useEffect } from "react";
import axios from "axios";
import TopNavigationBar from "../../components/TopNavigationBar";
import AddItemModal from "../../components/modals/AddItemModal";
import AddUserForm from "../forms/AddUserForm";
import "./Contacts.css";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
}

function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("/api/users/?ordering=-id");
        const data = response.data;
        console.log("API response data:", data);

        setUserData(data.users);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return (
    <div>
      <TopNavigationBar
        title="Contacts"
        showSettings={true}
        showCta={true}
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
      />

      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddUserForm
          onContinue={() => {
            setIsModalOpen(false);
            // Optionally, you can trigger a refresh of the user list or do other actions
          }}
          onCancel={handleCancel}
        />
      </AddItemModal>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          {userData.length === 0 ? (
            <p>Gegevens niet kunnen laden:</p>
          ) : (
            <ul>
              {userData
                .sort((a, b) => b.id - a.id) // Sort users by descending ID
                .map((user) => (
                  <li key={user.id}>
                    <div className="profile">
                      <img
                        src="profile-placeholder.png" // Add your profile image placeholder source here
                        alt="Profile"
                        className="profile-image"
                      />
                      <div className="user-info">
                        <p>
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="profile-email">example@example.com</p>{" "}
                        {/* Hardcoded email */}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Contacts;
