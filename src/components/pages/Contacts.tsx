import React, { useState, useEffect } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
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
  const { userId } = useParams();

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

        const usersResponse = await getUsersOrdered(token || "", 0, 20);

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

        if (filteredUsers.length > 0) {
          setActiveUserId(filteredUsers[0].id);
          navigate(`/contacts/user/${filteredUsers[0].id}`);
        }
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
  }, [refreshTrigger]);

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

  const handleCtaClick = () => {
    setIsModalOpen(true);
  };

  const handleUserClick = (clickedUserId: string) => {
    setActiveUserId(clickedUserId);
    navigate(`/contacts/${clickedUserId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title={`Gebruikers ${userData.length}`}
          showSettings={false}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleCtaClick}
          onSearch={handleSearch}
          hasPermission={hasPermission}
          showSearch={false}
        />
        {error ? (
          <p>Error: {error.message}</p>
        ) : (
          <div>
            {userData.length === 0 ? (
              <div className={styles["loading-container"]}>
                <LoadingDot delay={0} />
                <LoadingDot delay={0.1} />
                <LoadingDot delay={0.1} />
                <LoadingDot delay={0.2} />
                <LoadingDot delay={0.2} />
              </div>
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
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </ul>
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
      <UserDetailsPage onUserDeleted={handleUserDeleted} />
    </div>
  );
}
