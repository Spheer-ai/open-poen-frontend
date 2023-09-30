import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getUserById, getUsersOrdered } from "../middleware/Api";
import axios from "axios";
import jwtDecode from "jwt-decode";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import AddItemModal from "../../components/modals/AddItemModal";
import AddUserForm from "../forms/AddUserForm";
import styles from "../../assets/scss/Contacts.module.scss";
import LoadingDot from "../animation/LoadingDot";
import ProfileIcon from "../../assets/profile-icon.svg";
import DropdownMenu from "../elements/dropdown-menu/DropDownMenu";
import { UserData } from "../../types/ContactsTypes";
import EditUserForm from "../forms/EditUserForm";
import DeleteUserForm from "../forms/DeleteUserForm";

interface DecodedToken {
  sub: string;
}

export default function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [userListLoaded, setUserListLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    console.log("Clicked User ID (before update):", clickedUserId);
    setActiveUserId(clickedUserId);
    console.log("activeUserId (after update):", activeUserId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const handleToggleDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    const dotPosition = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: dotPosition.bottom + window.scrollY,
      left: dotPosition.left + window.scrollX,
    });
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditButtonClick = () => {
    handleOpenEditModal();
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        let loggedIn = false;
        let userId: string | null = null;

        if (token !== null) {
          const decodedToken: DecodedToken = jwtDecode(token);
          loggedIn = true;
          userId = decodedToken.sub;
          setIsLoggedIn(loggedIn);
          setLoggedInUserId(userId);

          console.log("Fetching loggedInUserResponse:");
          console.log("URL:", `/api/user/${userId}`);
          console.log("Headers:", {
            Authorization: `Bearer ${token}`,
          });
        }

        console.log("Fetching usersResponse:");
        console.log("URL:", "/api/users");
        console.log("Headers:", {
          Authorization: `Bearer ${token || ""}`,
        });

        const usersResponse = await getUsersOrdered(token || "");

        const sortedUsers = loggedIn
          ? [await getUserById(userId || "", token || ""), ...usersResponse]
          : usersResponse;

        const filteredUsers = sortedUsers.reduce((uniqueUsers, user) => {
          if (!uniqueUsers.some((u) => u.id === user.id)) {
            uniqueUsers.push(user);
          }
          return uniqueUsers;
        }, []);

        setUserData(filteredUsers);
        setUserListLoaded(true);

        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

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
        title={`Contacts ${userData.length}`}
        showSettings={true}
        showCta={true}
        onSettingsClick={() => {}}
        onCtaClick={handleCtaClick}
        onSearch={handleSearch}
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
      {isLoading ? (
        <div className={styles["loading-container"]}>
          <div className={styles["loading-dots-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        </div>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          {userData.length === 0 ? (
            <p>Data could not be loaded.</p>
          ) : (
            <ul>
              {userData
                .filter((user) => {
                  const fullName = `${user.first_name} ${user.last_name}`;
                  const email = user.email;
                  const keywords = searchQuery.toLowerCase().split(" ");
                  return keywords.every(
                    (keyword) =>
                      fullName.toLowerCase().includes(keyword) ||
                      email.toLowerCase().includes(keyword),
                  );
                })
                .map((user) => {
                  const userItemId = user.id;
                  const loggedInId = loggedInUserId;
                  const isActive = activeUserId === userItemId;
                  const isLoggedActiveUser =
                    isActive && loggedInId === userItemId;

                  return (
                    <li
                      key={userItemId}
                      onClick={() => handleUserClick(userItemId)}
                      className={`${isActive ? styles["active-user"] : ""}`}
                      style={{
                        backgroundColor:
                          isActive && loggedInId === userItemId
                            ? "gray"
                            : "white",
                      }}
                    >
                      {isLoggedIn ? (
                        <Link
                          to={`/contacts/user/${userItemId}`}
                          className={`${styles["user-link"]} ${
                            isLoggedActiveUser ? styles["logged-in"] : ""
                          }`}
                        >
                          <div className={styles["profile"]}>
                            <img
                              src="../../../profile-placeholder.png"
                              alt="Profile"
                              className={styles["profile-image"]}
                            />
                            <div className={styles["user-info"]}>
                              <p>
                                {user.first_name} {user.last_name}
                              </p>
                              <p className={styles["profile-email"]}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                          {loggedInId == userItemId && (
                            <div>
                              <img
                                src={ProfileIcon}
                                alt="Profile Icon"
                                className={styles["profile-icon"]}
                              />
                            </div>
                          )}
                          <div
                            className={styles["three-dots"]}
                            onClick={(event) => handleToggleDropdown(event)}
                          >
                            <div className={styles["dot"]}></div>{" "}
                            <div className={styles["dot"]}></div>{" "}
                            <div className={styles["dot"]}></div>{" "}
                          </div>
                        </Link>
                      ) : (
                        <div
                          className={`${styles["user-link"]} ${
                            isLoggedActiveUser ? styles["logged-in"] : ""
                          }`}
                        >
                          <div className={styles["profile"]}>
                            <img
                              src="../../../profile-placeholder.png"
                              alt="Profile"
                              className={styles["profile-image"]}
                            />
                            <div className={styles["user-info"]}>
                              <p>
                                {user.first_name} {user.last_name}
                              </p>
                              <p className={styles["profile-email"]}>
                                {user.email}
                              </p>
                            </div>
                          </div>
                          {loggedInId == userItemId && (
                            <div>
                              <img
                                src={ProfileIcon}
                                alt="Profile Icon"
                                className={styles["profile-icon"]}
                              />
                            </div>
                          )}
                          <div
                            className={styles["three-dots"]}
                            onClick={(event) => handleToggleDropdown(event)}
                          >
                            <div className={styles["dot"]}></div>{" "}
                            <div className={styles["dot"]}></div>{" "}
                            <div className={styles["dot"]}></div>{" "}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
          <Outlet />
        </div>
      )}
      {isDropdownOpen && (
        <div
          className={styles["dropdown-container"]}
          style={{
            position: "absolute",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          <DropdownMenu
            isOpen={isDropdownOpen}
            onEditClick={handleEditButtonClick}
            onDeleteClick={handleOpenDeleteModal}
          />
        </div>
      )}
    </div>
  );
}
