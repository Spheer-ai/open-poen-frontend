import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import LoadingDot from "../animation/LoadingDot";
import { getUserById, getUsersOrdered } from "../middleware/Api";
import jwtDecode from "jwt-decode";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Contacts.module.scss";
import { UserData } from "../../types/ContactsTypes";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import UserItem from "../elements/users/UserItem";
import AddUser from "../modals/AddUser";
import UserDetailsPage from "./UserDetailPage";

interface DecodedToken {
  sub: string;
}

export default function Contacts() {
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [userListLoaded, setUserListLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create");
  const [page, setPage] = useState(1);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [initialUserList, setInitialUserList] = useState<UserData[]>([]);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);

  const checkBottom = () => {
    const sidePanel = sidePanelRef.current;

    if (sidePanel) {
      const scrollY = sidePanel.scrollTop;
      const panelHeight = sidePanel.clientHeight;
      const contentHeight = sidePanel.scrollHeight;

      if (scrollY + panelHeight >= contentHeight) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    }
  };

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
        }

        const usersResponse = await getUsersOrdered(
          token || "",
          currentPage,
          5,
          searchQuery,
        );

        const noResults = usersResponse.users.length === 0 && currentPage !== 0;

        if (noResults) {
          setNoResultsFound(true);
        } else {
          setNoResultsFound(false);
        }

        let originalUsers = [...usersResponse.users];

        if (loggedIn) {
          const loggedInUser = await getUserById(userId || "", token || "");
          originalUsers = [loggedInUser, ...usersResponse.users];
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

        if (searchQuery) {
          setUserList(filteredUsers);
        } else {
          if (currentPage === 0) {
            setInitialUserList(filteredUsers);
          }

          if (currentPage > 0) {
            setUserList((prevUserList) => [
              ...prevUserList,
              ...filteredUsers.filter((user) =>
                prevUserList.every((prevUser) => prevUser.id !== user.id),
              ),
            ]);
          }
        }

        setUserListLoaded(true);

        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
  }, [refreshTrigger, currentPage, searchQuery]);

  useEffect(() => {
    const updatedFilteredData = userList.filter((user) => {
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
  }, [searchQuery, userList]);

  useEffect(() => {
    if (userListLoaded && userList.length > 0) {
      if (userList[0].id === loggedInUserId) {
        setActiveUserId(loggedInUserId);
      } else {
        setActiveUserId(userList[0].id);
      }
    }
  }, [userListLoaded, userList, loggedInUserId]);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleUserClick = (clickedUserId: string) => {
    setActiveUserId(clickedUserId);
    navigate(`/contacts/${clickedUserId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setUserList(initialUserList);
    } else {
      const filteredUsers = userListLoaded
        ? userList.filter((user) => {
            const fullName = `${user.first_name || ""} ${user.last_name || ""}`;
            const email = user.email || "";
            const keywords = query.toLowerCase().split(" ");

            return keywords.every(
              (keyword) =>
                fullName.toLowerCase().includes(keyword) ||
                email.toLowerCase().includes(keyword),
            );
          })
        : [];

      setUserList(filteredUsers);
    }
  };

  const handleToggleAddUserModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(false);
        navigate("/contacts");
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate("/contacts/add-user");
    }
  };

  const handleUserAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUserDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUserEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUserProfileEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handlePasswordChanged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLoadMore = async () => {
    if (!isLoading) {
      setCurrentPage(currentPage + 1);
      setIsLoading(true);

      try {
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const sidePanel = sidePanelRef.current;

    if (sidePanel) {
      sidePanel.addEventListener("scroll", checkBottom);

      return () => {
        sidePanel.removeEventListener("scroll", checkBottom);
      };
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      console.log("User reached the bottom of the side panel");
      handleLoadMore();
    }
  }, [isAtBottom]);

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]} ref={sidePanelRef}>
        <TopNavigationBar
          title={`Gebruikers`}
          showSettings={false}
          showCta={isLoggedIn}
          onSettingsClick={() => {}}
          onCtaClick={handleCtaClick}
          onSearch={handleSearch}
          hasPermission={hasPermission}
          showSearch={true}
        />
        {error ? (
          <p>Error: {error.message}</p>
        ) : isLoading ? (
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        ) : (
          <div>
            {userList.length === 0 ? (
              <p className={styles["no-users"]}>Geen gegevens gevonden</p>
            ) : (
              <ul>
                {userList.map((user, index) => (
                  <li
                    key={user.id}
                    className={`${styles["user-fade-in"]}`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      padding: "0",
                    }}
                  >
                    <UserItem
                      key={`${user.id}-${index}`}
                      user={user}
                      isActive={activeUserId === user.id}
                      loggedInId={loggedInUserId}
                      isLoggedActiveUser={
                        activeUserId === user.id && loggedInUserId === user.id
                      }
                      handleUserClick={handleUserClick}
                      isLoggedIn={isLoggedIn}
                    />
                  </li>
                ))}
              </ul>
            )}
            {userList.length > 0 && (
              <div className={styles["load-more-button-container"]}>
                <button
                  className={styles["load-more-button"]}
                  onClick={handleLoadMore}
                >
                  Meer gebruikers laden...
                </button>
              </div>
            )}

            <Outlet />
          </div>
        )}
        <AddUser
          isOpen={isModalOpen}
          onClose={handleToggleAddUserModal}
          isBlockingInteraction={isBlockingInteraction}
          onUserAdded={handleUserAdded}
        />
      </div>
      {isLoggedIn && (
        <UserDetailsPage
          onUserDeleted={handleUserDeleted}
          onUserEdited={handleUserEdited}
          onUserProfileEdited={handleUserProfileEdited}
          onPasswordChanged={handlePasswordChanged}
        />
      )}
    </div>
  );
}
