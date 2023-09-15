import React, { useState, useEffect } from "react";
import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import TopNavigationBar from "../../components/TopNavigationBar";
import AddItemModal from "../../components/modals/AddItemModal";
import AddUserForm from "../forms/AddUserForm";
import "./Contacts.css";
import LoadingDot from "../animation/LoadingDot";
import ProfileIcon from "../../assets/profile-icon.svg";
import DropdownMenu from "../DropDownMenu"; // Import the DropdownMenu component

interface UserData {
  email: string;
  id: string;
  first_name: string;
  last_name: string;
}

function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [userListLoaded, setUserListLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to track the dropdown

  const { userId } = useParams();
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
    console.log("Clicked User ID:", clickedUserId);
    setActiveUserId(clickedUserId);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const loggedIn = !!token;

        setIsLoggedIn(loggedIn);

        if (loggedIn) {
          const decodedToken: any = jwtDecode(token);
          const userId = decodedToken.sub;

          setLoggedInUserId(userId);

          const loggedInUserResponse = await axios.get(`/api/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const usersResponse = await axios.get("/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              ordering: `-${userId}`,
            },
          });

          const sortedUsers = [
            loggedInUserResponse.data,
            ...usersResponse.data.users,
          ];

          const filteredUsers = sortedUsers.reduce((uniqueUsers, user) => {
            if (!uniqueUsers.some((u) => u.id === user.id)) {
              uniqueUsers.push(user);
            }
            return uniqueUsers;
          }, []);

          setUserData(filteredUsers);
          setUserListLoaded(true);
        } else {
          const usersResponse = await axios.get("/api/users");
          setUserData(usersResponse.data.users);
          setUserListLoaded(true);
        }

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
        // Only navigate if the user is logged in
        navigate(`/contacts/user/${activeUserId}`);
      }
    }
  }, [activeUserId, navigate, isLoggedIn]);

  return (
    <div className="side-panel">
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

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-dots-container">
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
                .map((user, index) => {
                  const userItemId = user.id;
                  const loggedInId = loggedInUserId;
                  const isActive = activeUserId === userItemId;
                  const isLoggedActiveUser =
                    isActive && loggedInId === userItemId;

                  return (
                    <li
                      key={userItemId}
                      onClick={() => handleUserClick(userItemId)}
                      className={`${isActive ? "active-user" : ""}`}
                      style={{
                        animationName: "fadeIn",
                        animationDuration: "0.5s",
                        animationTimingFunction: "ease-in-out",
                        animationFillMode: "both",
                        backgroundColor:
                          isActive && loggedInId === userItemId
                            ? "gray"
                            : "white",
                        animationDelay: `${index * 0.2}s`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px",
                      }}
                    >
                      {isLoggedIn ? (
                        <Link
                          to={`/contacts/user/${userItemId}`}
                          className={`user-link ${
                            isLoggedActiveUser ? "logged-in" : ""
                          }`}
                          style={{
                            textDecoration: "none",
                            display: "flex",
                            padding: "10px",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <div className="profile">
                            <img
                              src="../../../profile-placeholder.png"
                              alt="Profile"
                              className="profile-image"
                            />
                            <div className="user-info">
                              <p>
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="profile-email">{user.email}</p>
                            </div>
                          </div>
                          {loggedInId == userItemId && (
                            <div>
                              <img
                                src={ProfileIcon}
                                alt="Profile Icon"
                                className="profile-icon"
                              />
                            </div>
                          )}
                          <div
                            className="three-dots"
                            onClick={(event) => handleToggleDropdown(event)}
                          >
                            {/* Add your three dots icon here */}
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        </Link>
                      ) : (
                        <div
                          className={`user-link ${
                            isLoggedActiveUser ? "logged-in" : ""
                          }`}
                          style={{
                            textDecoration: "none",
                            display: "flex",
                            padding: "10px",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <div className="profile">
                            <img
                              src="../../../profile-placeholder.png"
                              alt="Profile"
                              className="profile-image"
                            />
                            <div className="user-info">
                              <p>
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="profile-email">{user.email}</p>
                            </div>
                          </div>
                          {loggedInId == userItemId && (
                            <div>
                              <img
                                src={ProfileIcon}
                                alt="Profile Icon"
                                className="profile-icon"
                                style={{ marginRight: "15px" }}
                              />
                            </div>
                          )}
                          <div
                            className="three-dots"
                            onClick={(event) => handleToggleDropdown(event)}
                          >
                            {/* Add your three dots icon here */}
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
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
          className="dropdown-container"
          style={{
            position: "absolute",
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
<DropdownMenu
  isOpen={isDropdownOpen}
  onEditClick={() => {
    console.log("Edit clicked for user:", activeUserId);
  }}
  onDeleteClick={() => {
    console.log("Delete clicked for user:", activeUserId);
  }}
/>
        </div>
      )}
    </div>
  );
}

export default Contacts;
