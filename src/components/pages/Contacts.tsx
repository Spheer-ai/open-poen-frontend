import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getUserById, getUsersOrdered } from "../middleware/Api";
import jwtDecode from "jwt-decode";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import AddItemModal from "../../components/modals/AddItemModal";
import AddUserForm from "../forms/AddUserForm";
import styles from "../../assets/scss/Contacts.module.scss";
import { UserData } from "../../types/ContactsTypes";
import EditUserForm from "../forms/EditUserForm";
import DeleteUserForm from "../forms/DeleteUserForm";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import UserItem from "../elements/users/UserItem";
interface DecodedToken {
  sub: string;
}

export default function Contacts() {
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [userListLoaded, setUserListLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const dropdownRef = useRef(null as HTMLDivElement | null);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create");

  useEffect(() => {
    if (user && user.token && !permissionsFetched) {
      fetchPermissions("User", undefined, user.token)
        .then((permissions) => {
          setEntityPermissions(permissions || []);
          setPermissionsFetched(true);
        })
        .catch((error) => {
          console.error("Failed to fetch permissions:", error);
          setPermissionsFetched(true);
        });
    }
  }, [user, fetchPermissions, permissionsFetched]);

  const navigate = useNavigate();

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUserClick = (clickedUserId: string) => {
    setActiveUserId(clickedUserId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditButtonClick = (id) => {
    handleOpenEditModal();
  };

  const handleOpenDeleteModal = (id) => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let loggedIn = false;
        let userId: string | null = null;

        if (token !== null) {
          const decodedToken: DecodedToken = jwtDecode(token);
          loggedIn = true;
          userId = decodedToken.sub;
          setIsLoggedIn(loggedIn);
          setLoggedInUserId(userId);

          console.log("Fetching loggedInUserResponse:");
          console.log("Headers:", {
            Authorization: `Bearer ${token}`,
          });
        }

        console.log("Fetching usersResponse:");
        console.log("Headers:", {
          Authorization: `Bearer ${token || ""}`,
        });

        const usersResponse = await getUsersOrdered(token || "");

        let originalUsers = [...usersResponse];

        if (loggedIn) {
          const loggedInUser = await getUserById(userId || "", token || "");
          originalUsers = [loggedInUser, ...usersResponse];
        }

        const filteredUsers = originalUsers.reduce((uniqueUsers, user) => {
          if (!uniqueUsers.some((u: { id }) => u.id === user.id)) {
            const { first_name, last_name, ...rest } = user;
            const userWithNames = {
              first_name: first_name || "Voornaam",
              last_name: last_name || "Achternaam",
              ...rest,
            };
            uniqueUsers.push(userWithNames);
          }
          return uniqueUsers;
        }, []);

        setUserData(filteredUsers);
        setUserListLoaded(true);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const updatedFilteredData = userData.filter((user) => {
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`;
      const email = user.email || "";
      const keywords = searchQuery.toLowerCase().split(" ");

      return keywords.every(
        (keyword) =>
          fullName.toLowerCase().includes(keyword) ||
          email.toLowerCase().includes(keyword),
      );
    });

    setFilteredData(updatedFilteredData);
  }, [searchQuery, userData]);

  useEffect(() => {
    if (userListLoaded && userData.length > 0) {
      if (userData[0].id === loggedInUserId) {
        setActiveUserId(loggedInUserId);
      } else {
        setActiveUserId(userData[0].id);
      }
    }
  }, [userListLoaded, userData, loggedInUserId]);

  useEffect(() => {
    if (activeUserId) {
      if (isLoggedIn) {
        navigate(`/contacts/user/${activeUserId}`);
      }
    }
  }, [activeUserId, navigate, isLoggedIn]);

  console.log("isEditModalOpen:", isEditModalOpen);
  console.log("activeUserId:", activeUserId);

  return (
    <div className={styles["side-panel"]}>
      <TopNavigationBar
        title={`Gebruikers ${userData.length}`}
        showSettings={true}
        showCta={true}
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
        onSearch={handleSearch}
        hasPermission={hasPermission}
      />
      <AddItemModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddUserForm
          onContinue={() => {
            setIsModalOpen(false);
          }}
          onCancel={handleCancel}
        />
      </AddItemModal>

      {isEditModalOpen && activeUserId && (
        <AddItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <EditUserForm
            userId={activeUserId}
            onCancel={() => {
              setIsEditModalOpen(false);
            }}
            onContinue={() => {
              setIsEditModalOpen(false);
            }}
            navigate={navigate}
          />
        </AddItemModal>
      )}
      {isDeleteModalOpen && activeUserId && (
        <AddItemModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <DeleteUserForm
            userId={activeUserId}
            onCancel={() => {
              setIsDeleteModalOpen(false);
            }}
            onContinue={() => {
              setIsDeleteModalOpen(false);
            }}
          />
        </AddItemModal>
      )}
      {error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          {userData.length === 0 ? (
            <p>Gegevens konden niet geladen worden.</p>
          ) : (
            <ul>
              {userData.map((user) => (
                <UserItem
                  key={user.id}
                  user={user}
                  isActive={activeUserId === user.id}
                  loggedInId={loggedInUserId}
                  isLoggedActiveUser={
                    activeUserId === user.id && loggedInUserId === user.id
                  }
                  handleUserClick={handleUserClick}
                  handleEditButtonClick={handleEditButtonClick}
                  handleOpenDeleteModal={handleOpenDeleteModal}
                  dropdownOpen={dropdownOpen}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </ul>
          )}
          <Outlet />
        </div>
      )}
    </div>
  );
}
