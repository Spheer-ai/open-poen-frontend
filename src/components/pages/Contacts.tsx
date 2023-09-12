import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
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
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  let decodedToken: any = { sub: null };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        const loggedIn = !!token; // Check if a user is logged in

        if (loggedIn) {
          decodedToken = jwtDecode(token);
          setLoggedInUserId(decodedToken.sub); // Set the logged-in user's ID
          console.log("Decoded Token:", decodedToken);
        }

        const response = await axios.get("/api/users/?ordering=-id", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log("API response data:", data);

        // If a user is logged in, sort the users with the logged-in user at the top
        if (loggedIn) {
          data.users.sort((a, b) => {
            if (a.id === decodedToken.sub) {
              return -1; // Place the logged-in user at the top
            } else if (b.id === decodedToken.sub) {
              return 1;
            }
            return 0;
          });
        }

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
          }}
          onCancel={handleCancel}
        />
      </AddItemModal>

      {isLoading ? (
        <p></p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          {userData.length === 0 ? (
  <p>Data could not be loaded.</p>
) : (
  <ul>
    {userData.map((user, index) => (
      <li
        key={user.id}
        onClick={() =>
          console.log("User ID:", user.id, "LoggedInUserID:", loggedInUserId)
        }
        className={`${
          user.id === loggedInUserId ? "logged-in-user" : ""
        } fade-in`}
        style={{
          animationName: "fadeIn",
          animationDuration: "0.5s",
          animationTimingFunction: "ease-in-out",
          animationFillMode: "both",
          animationDelay: `${index * 0.15}s`,
        }}
      >
        <div className="profile">
          <img
            src="profile-placeholder.png"
            alt="Profile"
            className="profile-image"
          />
          <div className="user-info">
            <p>
              {user.first_name} {user.last_name}
            </p>
            <p className="profile-email">example@example.com</p>
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
