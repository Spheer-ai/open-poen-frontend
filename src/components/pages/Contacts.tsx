import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingDot from "../animation/LoadingDot";
import { getUsersOrdered } from "../middleware/Api";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Contacts.module.scss";
import { UserData } from "../../types/ContactsTypes";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import UserItem from "../elements/users/UserItem";
import AddUser from "../modals/AddUser";
import UserDetailsPage from "./UserDetailPage";

const PAGE_SIZE = 10;
const SEARCH_DELAY = 300;

export default function Contacts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchPermissions } = usePermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create");
  const [userList, setUserList] = useState<UserData[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [isFetchingMoreUsers, setIsFetchingMoreUsers] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);

  const checkBottom = () => {
    const sidePanel = sidePanelRef.current;

    if (sidePanel) {
      const scrollY = sidePanel.scrollTop;
      const panelHeight = sidePanel.clientHeight;
      const contentHeight = sidePanel.scrollHeight;

      const threshold = 50;

      setIsAtBottom(contentHeight - (scrollY + panelHeight) < threshold);
    }
  };

  useEffect(() => {
    if (user && user.token && entityPermissions.length === 0) {
      fetchPermissions("User", undefined, user.token)
        .then((permissions) => setEntityPermissions(permissions || []))
        .catch((error) => console.error("Failed to fetch permissions:", error));
    }
  }, [user, fetchPermissions, entityPermissions]);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await getUsersOrdered(
          user?.token || "",
          currentPage,
          PAGE_SIZE,
          searchQuery,
        );

        const noResults = usersResponse.users.length === 0 && currentPage !== 0;

        if (searchQuery) {
          setUserList(usersResponse.users);
        } else {
          setNoResultsFound(noResults);
          setIsLoading(false);

          if (currentPage === 1) {
            setNoResultsFound(noResults);
            setUserList(usersResponse.users);
          } else {
            setUserList((prevUserList) => [
              ...prevUserList,
              ...usersResponse.users.filter(
                (user) =>
                  !prevUserList.some((prevUser) => prevUser.id === user.id),
              ),
            ]);
          }
        }

        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
  }, [refreshTrigger, user, currentPage, searchQuery]);

  useEffect(() => {
    const updatedFilteredData = userList.filter(
      (user) => user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setNoResultsFound(updatedFilteredData.length === 0);
  }, [searchQuery, userList]);

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleUserClick = (clickedUserId: string) => {
    const updatedUserList = userList.map((user) => ({
      ...user,
      isActive: user.id === clickedUserId,
    }));

    setUserList(updatedUserList);
    navigate(`/contacts/${clickedUserId}`);
  };

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      handleSearch(searchQuery);
    }, SEARCH_DELAY);

    return () => {
      clearTimeout(searchTimeout);
    };
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query === "") {
      setUserList([]);
    } else {
      try {
        const usersResponse = await getUsersOrdered(
          user?.token || "",
          1,
          PAGE_SIZE,
          query,
        );

        setUserList(usersResponse.users);
        setCurrentPage(1);
        setError(null);
        setNoResultsFound(usersResponse.users.length === 0);
      } catch (error) {
        setError(error);
        setNoResultsFound(true);
        setUserList([]);
      }
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
    setCurrentPage(1);
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

  useEffect(() => {
    const sidePanel = sidePanelRef.current;

    const handleScroll = () => {
      checkBottom();
    };

    if (sidePanel) {
      sidePanel.addEventListener("scroll", handleScroll);

      return () => {
        sidePanel.removeEventListener("scroll", handleScroll);
      };
    }
  }, [checkBottom]);

  useEffect(() => {
    if (isAtBottom) {
      console.log("User reached the bottom of the side panel");
      handleLoadMore();
    }
  }, [isAtBottom]);

  const handleLoadMore = async () => {
    if (!isLoading) {
      setIsFetchingMoreUsers(true);
      setCurrentPage((prev) => prev + 1);

      try {
        const usersResponse = await getUsersOrdered(
          user?.token || "",
          currentPage,
          PAGE_SIZE,
          searchQuery,
        );

        const noResults = usersResponse.users.length === 0 && currentPage !== 0;

        setUserList((prevUserList) => [
          ...prevUserList,
          ...usersResponse.users.filter(
            (user) => !prevUserList.some((prevUser) => prevUser.id === user.id),
          ),
        ]);

        setIsLoading(false);
        setIsFetchingMoreUsers(false);
        setNoResultsFound(noResults);
      } catch (error) {
        setError(error);
        setIsLoading(false);
        setIsFetchingMoreUsers(false);
      }
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]} ref={sidePanelRef}>
        <TopNavigationBar
          title={`Gebruikers`}
          showSettings={false}
          showCta={user ? true : false}
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
                      animationDelay: `${index * 0.05}s`,
                      padding: "0",
                    }}
                  >
                    <UserItem
                      key={`${user.id}-${index}`}
                      user={user}
                      isActive={user.isActive}
                      handleUserClick={handleUserClick}
                    />
                  </li>
                ))}
              </ul>
            )}
            {isFetchingMoreUsers ? (
              <div className={styles["loading-container-load-more"]}>
                <LoadingDot delay={0} />
                <LoadingDot delay={0.1} />
                <LoadingDot delay={0.1} />
                <LoadingDot delay={0.2} />
                <LoadingDot delay={0.3} />
              </div>
            ) : null}
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
      {user && (
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
